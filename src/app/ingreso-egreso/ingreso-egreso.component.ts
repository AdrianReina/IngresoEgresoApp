import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IngresoEgresoModel } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import {
  ActivarLoadingAction,
  DesactivarLoadingAction,
} from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  forma!: FormGroup;
  tipo = 'ingreso';
  loadingSubs: Subscription = new Subscription();
  cargando: boolean = false;

  constructor(
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}
  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadingSubs = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });
    this.forma = new FormGroup({
      descripcion: new FormControl('', Validators.required),
      monto: new FormControl(0, Validators.min(0)),
    });
  }

  crearIngresoEgreso() {
    this.store.dispatch(new ActivarLoadingAction());
    const ingresoEgreso = new IngresoEgresoModel({
      ...this.forma.value,
      tipo: this.tipo,
    });
    console.log(ingresoEgreso);
    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        Swal.fire('Creado', ingresoEgreso.descripcion, 'success');
        this.forma.reset({
          monto: 0,
        });
        this.store.dispatch(new DesactivarLoadingAction());
      })
      .catch((err) => {
        console.log(err);
        this.store.dispatch(new DesactivarLoadingAction());
      });
  }
}
