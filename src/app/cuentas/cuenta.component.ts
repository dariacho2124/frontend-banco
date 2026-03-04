import { Component, OnInit, signal } from '@angular/core';
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
  cuentas = signal<any[]>([]);
  mostrarFormulario = signal<boolean>(false);
  mensajeExito = signal<string>('');
  nuevaCuenta: any = {
    numeroCuenta: '',
    tipoCuenta: 'Ahorros',
    saldoInicial: 0,
    estado: true,
    cliente: { id: null }
  };

  constructor(private readonly cuentaService: CuentaService) {}

  ngOnInit() { this.listar(); }

  listar() {
    this.cuentaService.getAll().subscribe(res => this.cuentas.set(res));
  }

  guardar() {
    if (this.nuevaCuenta.id) {
      this.cuentaService.update(this.nuevaCuenta.id, this.nuevaCuenta).subscribe({
        next: () => { this.mensajeExito.set('¡Cuenta actualizada!'); this.finalizar(); },
        error: () => alert('Error al actualizar')
      });
    } else {
      this.cuentaService.save(this.nuevaCuenta).subscribe({
        next: () => { this.mensajeExito.set('¡Cuenta creada!'); this.finalizar(); },
        error: () => alert('Error al crear')
      });
    }
  }

  editar(cuenta: any) {
    this.nuevaCuenta = { ...cuenta };
    this.mostrarFormulario.set(true);
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta cuenta?')) {
      this.cuentaService.delete(id).subscribe({
        next: () => { this.mensajeExito.set('Cuenta eliminada'); this.listar(); },
        error: (err) => alert('Error: ' + err.error?.mensaje)
      });
    }
  }

  cancelar() {
    this.mostrarFormulario.set(false);
    this.nuevaCuenta = { numeroCuenta: '', tipoCuenta: 'Ahorros', saldoInicial: 0, estado: true, cliente: { id: null } };
  }

  finalizar() {
    this.cancelar();
    this.listar();
    setTimeout(() => this.mensajeExito.set(''), 3000);
  }
}