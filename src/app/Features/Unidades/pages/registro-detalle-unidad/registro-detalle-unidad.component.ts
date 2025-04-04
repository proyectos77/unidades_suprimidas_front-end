import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnidadesService } from '../../services/unidades.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-registro-detalle-unidad',
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './registro-detalle-unidad.component.html',
  styleUrl: './registro-detalle-unidad.component.css'
})
export default class RegistroDetalleUnidadComponent implements OnInit{


    public formDetalle!: FormGroup;

    constructor(


    ) {}

    ngOnInit(): void {

        this.listadoUnidades();
    }



    listadoUnidades():void{
        /* this.httUnidades.listUnidadesSelect().subscribe(listadoUnidades => {
            console.log(listadoUnidades);
        }); */
    }

    validarFormulario():void{

    }

}
