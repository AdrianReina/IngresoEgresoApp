import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IngresoEgresoModel } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';
import { UnSetUserAction } from '../auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  ingresoEgresoListerSubcription: Subscription = new Subscription();
  ingresoEgresoItemsSubcription: Subscription = new Subscription();

  constructor(
    private afDB: AngularFirestore,
    private auth: AuthService,
    private store: Store<AppState>
  ) {}
  initIngresoEgresoListener() {
    this.ingresoEgresoListerSubcription = this.store
      .select('auth')
      .pipe(filter((auth) => auth.user != null))
      .subscribe((auth) => {
        console.log(auth.user.uid);
        this.ingresoEgresoItems(auth.user.uid);
      });
  }
  private ingresoEgresoItems(uid: string) {
    this.ingresoEgresoItemsSubcription = this.afDB
      .collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map((docData) => {
          return docData.map((doc: any) => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data(),
            };
          });
        })
      )
      .subscribe((coleccion: any[]) => {
        this.store.dispatch(new SetItemsAction(coleccion));
      });
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgresoModel) {
    const user = this.auth.getUsuario();
    return this.afDB
      .doc(`${user.uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }

  cancelarSubscription() {
    this.ingresoEgresoListerSubcription.unsubscribe();
    this.ingresoEgresoItemsSubcription.unsubscribe();
    this.store.dispatch(new UnSetUserAction());
  }

  borrarIngresoEgreso(uid: string) {
    const user = this.auth.getUsuario();
    return this.afDB.doc(`${user.uid}/ingresos-egresos/items/${uid}`).delete();
  }
}
