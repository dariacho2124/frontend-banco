import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './clientes/cliente.component';
import { ReporteComponent } from './reportes/reporte.component';
import { CuentaComponent } from './cuentas/cuenta.component';
import { MovimientoComponent } from './movimientos/movimiento.component';

const routes: Routes = [
  { path: 'clientes', component: ClienteComponent },
  { path: 'reportes', component: ReporteComponent },
  { path: 'cuentas', component: CuentaComponent }, 
  { path: 'movimientos', component: MovimientoComponent }, 
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: '**', redirectTo: '/clientes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}