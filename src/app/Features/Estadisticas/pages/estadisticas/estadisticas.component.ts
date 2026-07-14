import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface EstadisticaKPI {
  titulo: string;
  valor: number;
  icon: string;
  color: string;
  tendencia: number;
}

interface DatoTransferencia {
  unidad: string;
  cajas: number;
  carpetas: number;
  folios: number;
  estado: string;
}

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule, FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export default class EstadisticasComponent implements OnInit {

  // KPIs
  kpis: EstadisticaKPI[] = [
    { titulo: 'Total Transferencias', valor: 48, icon: 'fa-exchange-alt', color: '#1c5e1c', tendencia: 12 },
    { titulo: 'Solicitudes Aprobadas', valor: 42, icon: 'fa-check-circle', color: '#28a745', tendencia: 8 },
    { titulo: 'Solicitudes Pendientes', valor: 6, icon: 'fa-hourglass-half', color: '#ffc107', tendencia: -3 },
    { titulo: 'Solicitudes Rechazadas', valor: 2, icon: 'fa-times-circle', color: '#dc3545', tendencia: 0 }
  ];

  // Datos para tablas
  datosTransferencias: DatoTransferencia[] = [
    { unidad: 'Unidad A', cajas: 150, carpetas: 300, folios: 5000, estado: 'Aprobada' },
    { unidad: 'Unidad B', cajas: 120, carpetas: 250, folios: 4200, estado: 'Aprobada' },
    { unidad: 'Unidad C', cajas: 80, carpetas: 180, folios: 2800, estado: 'Pendiente' },
    { unidad: 'Unidad D', cajas: 95, carpetas: 210, folios: 3500, estado: 'Aprobada' },
    { unidad: 'Unidad E', cajas: 110, carpetas: 280, folios: 4100, estado: 'Aprobada' }
  ];

  // Filtros
  filtroUnidad: string = '';
  filtroEstado: string = '';

  // Charts
  chartBarras: Chart<'bar'> | null = null;
  chartPie: Chart<'pie'> | null = null;
  chartLinea: Chart<'line'> | null = null;

  ngOnInit(): void {
    this.inicializarGraficos();
  }

  inicializarGraficos(): void {
    // Pequeño delay para asegurar que los elementos del DOM estén listos
    setTimeout(() => {
      this.crearGraficoBarras();
      this.crearGraficoPie();
      this.crearGraficoLinea();
    }, 100);
  }

  crearGraficoBarras(): void {
    const ctx = document.getElementById('chartBarras') as HTMLCanvasElement;
    if (ctx) {
      if (this.chartBarras) {
        this.chartBarras.destroy();
      }
      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
          datasets: [
            {
              label: 'Transferencias Realizadas',
              data: [8, 10, 12, 15, 14, 16],
              backgroundColor: '#1c5e1c',
              borderColor: '#0d3d0d',
              borderWidth: 1,
              borderRadius: 5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: true,
              labels: { font: { size: 12 } }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { font: { size: 11 } }
            },
            x: {
              ticks: { font: { size: 11 } }
            }
          }
        }
      };
      this.chartBarras = new Chart(ctx, config);
    }
  }

  crearGraficoPie(): void {
    const ctx = document.getElementById('chartPie') as HTMLCanvasElement;
    if (ctx) {
      if (this.chartPie) {
        this.chartPie.destroy();
      }
      const config: ChartConfiguration<'pie'> = {
        type: 'pie',
        data: {
          labels: ['Aprobadas', 'Pendientes', 'Rechazadas'],
          datasets: [
            {
              data: [42, 6, 2],
              backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
              borderColor: '#fff',
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: true,
              labels: { font: { size: 12 } }
            }
          }
        }
      };
      this.chartPie = new Chart(ctx, config);
    }
  }

  crearGraficoLinea(): void {
    const ctx = document.getElementById('chartLinea') as HTMLCanvasElement;
    if (ctx) {
      if (this.chartLinea) {
        this.chartLinea.destroy();
      }
      const config: ChartConfiguration<'line'> = {
        type: 'line',
        data: {
          labels: ['Marzo', 'Abril', 'Mayo', 'Junio'],
          datasets: [
            {
              label: 'Cajas Transferidas',
              data: [285, 340, 420, 395],
              borderColor: '#1c5e1c',
              backgroundColor: 'rgba(28, 94, 28, 0.2)',
              borderWidth: 3,
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#1c5e1c',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              yAxisID: 'y'
            },
            {
              label: 'Folios Transferidos (÷100)',
              data: [156, 185, 220, 210],
              borderColor: '#ffc107',
              backgroundColor: 'rgba(255, 193, 7, 0.1)',
              borderWidth: 2,
              fill: false,
              tension: 0.3,
              pointBackgroundColor: '#ffc107',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              display: true,
              labels: { font: { size: 12 }, padding: 15 }
            }
          },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cajas'
              },
              ticks: { font: { size: 11 } }
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Folios (÷100)'
              },
              grid: {
                drawOnChartArea: false
              },
              ticks: { font: { size: 11 } }
            },
            x: {
              ticks: { font: { size: 11 } }
            }
          }
        }
      };
      this.chartLinea = new Chart(ctx, config);
    }
  }

  obtenerDatosFilterrados(): DatoTransferencia[] {
    return this.datosTransferencias.filter(dato => {
      const unidadMatch = !this.filtroUnidad || dato.unidad.toLowerCase().includes(this.filtroUnidad.toLowerCase());
      const estadoMatch = !this.filtroEstado || dato.estado === this.filtroEstado;
      return unidadMatch && estadoMatch;
    });
  }

  limpiarFiltros(): void {
    this.filtroUnidad = '';
    this.filtroEstado = '';
  }

}
