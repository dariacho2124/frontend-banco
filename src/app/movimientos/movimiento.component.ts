import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  movimientos: any[] = [];
  mostrarFormulario = false;
  mensajeExito = '';
  nuevoMovimiento: any = {
    fecha: new Date().toISOString().split('T')[0],
    tipoMovimiento: 'Deposito',
    valor: 0,
    cuenta: { id: null }
  };

  constructor(private readonly movimientoService: MovimientoService, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit() { this.listar(); }

  listar() {
    this.movimientoService.getAll().subscribe(res => {
      this.movimientos = [...res];
      this.cdr.detectChanges();
    });
  }

  registrar() {
    this.movimientoService.save(this.nuevoMovimiento).subscribe({
      next: (res) => {
        this.mensajeExito = `¡Éxito! Nuevo saldo: ${res.saldo}`;
        this.mostrarFormulario = false;
        this.nuevoMovimiento = { fecha: new Date().toISOString().split('T')[0], tipoMovimiento: 'Deposito', valor: 0, cuenta: { id: null } };
        this.listar();
        setTimeout(() => this.mensajeExito = '', 3000);
        this.cdr.detectChanges();
      },
      error: (err) => alert('Error: ' + (err.error?.mensaje || 'Saldo insuficiente'))
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este movimiento?')) {
      this.movimientoService.delete(id).subscribe({
        next: () => {
          this.mensajeExito = 'Movimiento eliminado';
          this.listar();
          setTimeout(() => this.mensajeExito = '', 3000);
          this.cdr.detectChanges();
        },
        error: () => alert('Error al eliminar')
      });
    }
  }
}