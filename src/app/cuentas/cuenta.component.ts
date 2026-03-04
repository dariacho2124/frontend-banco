import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuentaService } from '../services/cuenta.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CuentaComponent implements OnInit {
  cuentas: any[] = [];
  mostrarFormulario = false;
  mensajeExito = '';
  nuevaCuenta: any = {
    numeroCuenta: '',
    tipoCuenta: 'Ahorros',
    saldoInicial: 0,
    estado: true,
    cliente: { id: null }
  };

  constructor(private readonly cuentaService: CuentaService, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit() { this.listar(); }

  listar() {
    this.cuentaService.getAll().subscribe(res => {
      this.cuentas = [...res];
      this.cdr.detectChanges();
    });
  }

  guardar() {
    if (this.nuevaCuenta.id) {
      this.cuentaService.update(this.nuevaCuenta.id, this.nuevaCuenta).subscribe({
        next: () => { this.mensajeExito = '¡Cuenta actualizada!'; this.finalizar(); },
        error: () => alert('Error al actualizar')
      });
    } else {
      this.cuentaService.save(this.nuevaCuenta).subscribe({
        next: () => { this.mensajeExito = '¡Cuenta creada!'; this.finalizar(); },
        error: () => alert('Error al crear')
      });
    }
  }

  editar(cuenta: any) {
    this.nuevaCuenta = { ...cuenta };
    this.mostrarFormulario = true;
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta cuenta?')) {
      this.cuentaService.delete(id).subscribe({
        next: () => { this.mensajeExito = 'Cuenta eliminada'; this.listar(); this.cdr.detectChanges(); },
        error: (err) => alert('Error: ' + err.error?.mensaje)
      });
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.nuevaCuenta = { numeroCuenta: '', tipoCuenta: 'Ahorros', saldoInicial: 0, estado: true, cliente: { id: null } };
  }

  finalizar() {
    this.cancelar();
    this.listar();
    setTimeout(() => this.mensajeExito = '', 3000);
    this.cdr.detectChanges();
  }
}