import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms';
import { ClienteComponent } from './clientes/cliente.component';
import { ReporteComponent } from './reportes/reporte.component';
import { CuentaComponent } from './cuentas/cuenta.component';
import { MovimientoComponent } from './movimientos/movimiento.component';
@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    App,
    AppRoutingModule,
    FormsModule,
    AppRoutingModule,
    ClienteComponent,
    ReporteComponent,
    CuentaComponent,
    MovimientoComponent
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
  ],
  bootstrap: [App]
})
export class AppModule { }
