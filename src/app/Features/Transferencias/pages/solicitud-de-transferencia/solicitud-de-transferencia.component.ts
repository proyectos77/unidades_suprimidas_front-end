import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-solicitud-de-transferencia',
  imports: [ReactiveFormsModule],
  templateUrl: './solicitud-de-transferencia.component.html',
  styleUrl: './solicitud-de-transferencia.component.css'
})
export default class SolicitudDeTransferenciaComponent implements OnInit{

    public formTransferencia = FormGroup;

    constructor(private form: FormBuilder){}

    ngOnInit(): void {

    }

    /* formularioSolicitudTransferencia():FormGroup{
        return (this.formTransferencia = this.form.group({

        }));
    } */

}
