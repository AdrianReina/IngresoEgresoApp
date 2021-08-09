import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgresoModel } from '../ingreso-egreso.model';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  items!: IngresoEgresoModel[];
  subscription: Subscription = new Subscription();
  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('ingresoEgreso')
      .subscribe((ingresoEgreso) => {
        console.log(ingresoEgreso);
        this.items = ingresoEgreso.items;
      });
  }

  borrarItem(item: IngresoEgresoModel) {
    this.ingresoEgresoService.borrarIngresoEgreso(item.uid!).then(() => {
      Swal.fire('Eliminado', item.descripcion, 'success');
    });
  }
}
