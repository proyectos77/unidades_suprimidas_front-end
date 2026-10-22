import { ChangeDetectorRef, Component, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import RegistroArchivoUnidadActivaComponent from '../registro-archivo-unidad-activa/registro-archivo-unidad-activa.component';
import { LoaderComponent } from '../../../../Shared/Components/loader/loader.component';
import { SeriesSubseriesService } from '../../../../Core/services/series-subseries.service';
import { UnidadesActivasService } from '../../services/unidades-activas.service';
import { TransferenciasService } from '../../../Transferencias/services/transferencias.service';
import { SweetAlertService } from '../../../../Core/services/sweet-alert.service';
import { OrganizacionTransferenciaService } from '../../services/organizacion-transferencia.service';
import { SerieTransferida, VigenciaAprobada } from '../../interfaces/organizacion-transferencia';

/**
 * Organización física (cajas/carpetas/FUID) del archivo transferido por una unidad suprimida.
 * Hereda todo el flujo del registro de archivo de unidades activas y solo cambia:
 * - el año de la caja por las vigencias con transferencia aprobada,
 * - las series por las usadas en la transferencia de esa vigencia,
 * - el registro de cajas/carpetas por las rutas que validan contra lo transferido.
 */
@Component({
  selector: 'app-organizacion-transferencia-unidad-inactiva',
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor, LoaderComponent],
  templateUrl: './organizacion-transferencia-unidad-inactiva.component.html',
  styleUrl: './organizacion-transferencia-unidad-inactiva.component.css'
})
export default class OrganizacionTransferenciaUnidadInactivaComponent extends RegistroArchivoUnidadActivaComponent {

    private httpOrganizacion = inject(OrganizacionTransferenciaService);
    private alertas = inject(SweetAlertService);

    public vigencias: VigenciaAprobada[] = [];
    private seriesTransferidas: SerieTransferida[] = [];

    constructor() {
        super(
            inject(FormBuilder),
            inject(SeriesSubseriesService),
            inject(UnidadesActivasService),
            inject(TransferenciasService),
            inject(SweetAlertService),
            inject(ChangeDetectorRef),
        );
    }

    override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes['idUnidadActiva'] && changes['idUnidadActiva'].currentValue) {
            this.cargarVigencias();
        }
    }

    cargarVigencias(): void {
        this.httpOrganizacion.vigenciasAprobadas(this.idUnidadActiva).subscribe({
            next: (respuesta) => {
                this.vigencias = respuesta.data ?? [];
            },
            error: () => {
                this.vigencias = [];
                this.alertas.alertaGeneral('error', 'Error', 'Ocurrió un error al obtener las vigencias aprobadas.');
            },
        });
    }

    /** Cajas que aún se pueden organizar en la vigencia, descontando las agrupadas sin registrar. */
    cajasDisponiblesVigencia(anio: string): number {
        const vigencia = this.vigencias.find(v => v.anio === String(anio));
        if (!vigencia) {
            return 0;
        }
        const pendientes = this.cajasAgrupadas.cajas.filter(c => String(c.anio) === String(anio)).length;
        return vigencia.cajasTransferidas - vigencia.cajasOrganizadas - pendientes;
    }

    labelVigencia(vigencia: VigenciaAprobada): string {
        const disponibles = this.cajasDisponiblesVigencia(vigencia.anio);
        const estado = disponibles <= 0 ? 'completa' : `${vigencia.cajasOrganizadas}/${vigencia.cajasTransferidas} cajas`;
        return `${vigencia.anio} (${estado})`;
    }

    /* Las vigencias se cargan al abrir el modal; no se usa el listado genérico de años. */
    override listadoAnios(): void {
        this.cargarVigencias();
    }

    override listadoSeries(anio: string): void {
        this.httpOrganizacion.seriesTransferidas(this.idUnidadActiva, anio).subscribe({
            next: (respuesta) => {
                this.seriesTransferidas = respuesta.data ?? [];
                this.series = { ...respuesta, data: this.seriesTransferidas as any };
            },
            error: (error) => {
                this.seriesTransferidas = [];
                this.series = { ...this.series, data: [] };
                const respuesta = error?.error;
                this.alertas.alertaGeneral(respuesta?.icono || 'error', respuesta?.titulo || 'Error', respuesta?.mensaje || 'Ocurrió un error al obtener las series transferidas.');
            },
        });
    }

    override listadoSubseries(idSerie: number): void {
        const serie = this.seriesTransferidas.find(s => s.id_serie === Number(idSerie));
        this.subseries = { ...this.subseries, data: (serie?.subseries ?? []) as any };

        const subserieControl = this.formularioRegistroCarpeta.get('subserie');
        if (this.subseries.data.length === 0) {
            subserieControl?.reset('');
            subserieControl?.disable();
            subserieControl?.clearValidators();
        } else {
            subserieControl?.enable();
            subserieControl?.setValidators([Validators.required]);
        }
        subserieControl?.updateValueAndValidity();
    }

    override agregarCajaAgrupada(): void {
        const anio = this.formularioRegistroCaja.get('anio')?.value;
        if (anio && this.cajasDisponiblesVigencia(anio) <= 0) {
            this.alertas.alertaGeneral('warning', 'Vigencia completa', `La vigencia ${anio} ya tiene organizadas todas sus cajas transferidas.`);
            return;
        }
        super.agregarCajaAgrupada();
    }

    override registrarCajasAgrupadas(): void {
        if (this.cajasAgrupadas.cajas.length === 0) {
            this.alertas.alertaGeneral('warning', 'No hay cajas', 'Debe agregar al menos una caja antes de registrar.');
            return;
        }
        this.httpOrganizacion.registrarCajas(this.cajasAgrupadas).subscribe({
            next: () => {
                this.alertas.alertaGeneral('success', 'Registro exitoso', 'Las cajas han sido registradas correctamente.');
                this.cajasAgrupadas.cajas = [];
                this.mostrarPestana(this.carpetasTab.nativeElement);
                this.listadoCajasArchivoUnidadActiva();
                this.cargarVigencias();
            },
            error: (error) => this.mostrarError(error, 'Ocurrió un error al registrar las cajas.'),
        });
    }

    override registrarCarpetasAgrupadas(): void {
        if (this.carpetasAgrupadas.carpetas.length === 0) {
            this.alertas.alertaGeneral('warning', 'No hay carpetas', 'Debe agregar al menos una carpeta antes de registrar.');
            return;
        }
        this.httpOrganizacion.registrarCarpetas(this.carpetasAgrupadas).subscribe({
            next: () => {
                this.alertas.alertaGeneral('success', 'Registro exitoso', 'Las carpetas han sido registradas correctamente.');
                this.carpetasAgrupadas = { carpetas: [] };
                this.formularioRegistroCarpeta.reset({ caja: '', serie: '', subserie: '' });
                this.formularioRegistroCarpeta.get('serie')?.disable();
                this.formularioRegistroCarpeta.get('subserie')?.disable();
                this.mostrarPestana(this.cargaExcelTab.nativeElement);
                this.listadoCajasArchivoUnidadActiva();
                this.listadoCarpetasParaExcel();
                this.cargarVigencias();
            },
            error: (error) => this.mostrarError(error, 'Ocurrió un error al registrar las carpetas.'),
        });
    }

    private mostrarError(error: any, mensajePorDefecto: string): void {
        const respuesta = error?.error;
        this.alertas.alertaGeneral(respuesta?.icono || 'error', respuesta?.titulo || 'Error', respuesta?.mensaje || mensajePorDefecto);
    }

    private mostrarPestana(tabEl: HTMLElement | undefined): void {
        if (!tabEl) {
            return;
        }
        tabEl.classList.remove('disabled');
        const bootstrapGlobal = (window as any).bootstrap;
        if (bootstrapGlobal?.Tab) {
            bootstrapGlobal.Tab.getOrCreateInstance(tabEl).show();
        } else {
            tabEl.click();
        }
    }
}
