import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Label, MultiDataSet } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgresoModel } from '../ingreso-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit {
  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [];
  ingresos!: number;
  egresos!: number;

  cuantosIngresos!: number;
  cuantosEgresos!: number;

  subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('ingresoEgreso')
      .subscribe((ingresoEgreso) => {
        this.contarIngresoEgreso(ingresoEgreso.items);
      });
  }

  contarIngresoEgreso(items: IngresoEgresoModel[]) {
    this.ingresos = 0;
    this.egresos = 0;

    this.cuantosEgresos = 0;
    this.cuantosIngresos = 0;

    items.forEach((item) => {
      if (item.tipo === 'ingreso') {
        this.cuantosIngresos++;
        this.ingresos += item.monto;
      } else {
        this.cuantosEgresos++;
        this.egresos += item.monto;
      }
    });
    this.doughnutChartData.push([this.ingresos, this.egresos]);
  }
}
