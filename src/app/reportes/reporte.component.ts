import { Component, signal } from '@angular/core';
import { MovimientoService } from '../services/movimiento.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  imports: [CommonModule, FormsModule],
})
export class ReporteComponent {
  movimientos = signal<any[]>([]);
  id: number = 1;
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private readonly movimientoService: MovimientoService) {}

  consultarReporte() {
    if (!this.id || !this.fechaInicio || !this.fechaFin) {
      alert('Por favor, ingresa el ID del cliente y ambas fechas.');
      return;
    }

    this.movimientoService.getMovimientos(this.id, this.fechaInicio, this.fechaFin).subscribe({
      next: (data) => {
        this.movimientos.set(data);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  exportarPDF() {
    const { jsPDF } = (globalThis as any).jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(0, 75, 129);
    doc.text('Reporte Bancario', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 28);

    doc.autoTable({
      startY: 35,
      head: [['Fecha', 'Cliente', 'Cuenta', 'Tipo', 'Saldo Inicial', 'Estado', 'Movimiento', 'Saldo Disponible']],
      body: this.movimientos().map((m: any) => [
        m.fecha,
        m.cuenta?.cliente?.nombre,
        m.cuenta?.numeroCuenta,
        m.cuenta?.tipoCuenta,
        m.cuenta?.saldoInicial,
        m.cuenta?.estado ? 'True' : 'False',
        m.movimiento,
        m.saldo
      ]),
      headStyles: { fillColor: [0, 75, 129], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 245, 255] },
      styles: { fontSize: 9 }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setTextColor(0, 128, 0);
    doc.text(`Total Créditos: ${this.totalCreditos}`, 14, finalY);
    doc.setTextColor(255, 0, 0);
    doc.text(`Total Débitos: ${this.totalDebitos}`, 14, finalY + 8);

    doc.save('reporte-bancario.pdf');
  }

  get totalCreditos(): number {
    return this.movimientos()
      .filter(m => m.movimiento > 0)
      .reduce((sum, m) => sum + m.movimiento, 0);
  }

  get totalDebitos(): number {
    return this.movimientos()
      .filter(m => m.movimiento < 0)
      .reduce((sum, m) => sum + m.movimiento, 0);
  }
}