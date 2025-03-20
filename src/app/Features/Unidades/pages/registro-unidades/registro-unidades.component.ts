import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DepartamentosService } from '../../../../Core/services/departamentos.service';
import { GetAllDepartamentos } from '../../../../Core/interfaces/get-all-departamentos';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-registro-unidades',
  imports: [NgFor],
  templateUrl: './registro-unidades.component.html',
  styleUrl: './registro-unidades.component.css'
})
export default class RegistroUnidadesComponent implements OnInit{


    constructor(private httDepartamentos: DepartamentosService) {}

    public departamentos:GetAllDepartamentos = {
        'icono': '',
        'mensaje': '',
        'statusCode': 0,
        'titulo': '',
        'data': []

    };

    ngOnInit(): void {
        this.listadoDepartamentos();
    }

    listadoDepartamentos():void{
        this.httDepartamentos.getAllDepartamentos().subscribe(departamentos =>{
            if (departamentos.statusCode == 200 && departamentos.data.length > 0) {
                this.departamentos.data = departamentos.data;
            }
        });
    }

}
