import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientoService } from '../services/movimiento.service';

@Component({
  selector: 'app-movimiento',
  templateUrl: './movimiento.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MovimientoComponent implements OnInit {
  movimientos = signal<any[]>([]);
  mostrarFormulario = signal<boolean>(false);
  mensajeExito = signal<string>('');
  nuevoMovimiento: any = {
    fecha: new Date().toISOString().split('T')[0],
    tipoMovimiento: 'Deposito',
    valor: 0,
    cuenta: { id: null }
  };

  constructor(private readonly movimientoService: MovimientoService) {}

  ngOnInit() { this.listar(); }

  listar() {
    this.movimientoService.getAll().subscribe(res => this.movimientos.set(res));
  }

  registrar() {
    this.movimientoService.save(this.nuevoMovimiento).subscribe({
      next: (res) => {
        this.mensajeExito.set(`¡Éxito! Nuevo saldo: ${res.saldo}`);
        this.mostrarFormulario.set(false);
        this.nuevoMovimiento = { fecha: new Date().toISOString().split('T')[0], tipoMovimiento: 'Deposito', valor: 0, cuenta: { id: null } };
        this.listar();
        setTimeout(() => this.mensajeExito.set(''), 3000);
      },
      error: (err) => alert('Error: ' + (err.error?.mensaje || 'Saldo insuficiente'))
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este movimiento?')) {
      this.movimientoService.delete(id).subscribe({
        next: () => {
          this.mensajeExito.set('Movimiento eliminado');
          this.listar();
          setTimeout(() => this.mensajeExito.set(''), 3000);
        },
        error: () => alert('Error al eliminar')
      });
    }
  }
}