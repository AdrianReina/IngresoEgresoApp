import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/auth/auth.service';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  nombre!: string;
  subscription: Subscription = new Subscription();

  constructor(
    private auth: AuthService,
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('auth')
      .pipe(filter((auth) => auth.user != null))
      .subscribe((auth) => {
        this.nombre = auth.user.nombre;
      });
  }

  logout() {
    this.auth.logout();
    this.ingresoEgresoService.cancelarSubscription();
  }
}
