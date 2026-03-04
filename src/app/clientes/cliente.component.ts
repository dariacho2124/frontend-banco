import { Component, OnInit, signal, computed } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class ClienteComponent implements OnInit {
  clientes = signal<any[]>([]);
  searchTerm = signal<string>('');
  mostrarFormulario = signal<boolean>(false);
  mensajeExito = signal<string>('');
  nuevoCliente: any = { nombre: '', direccion: '', telefono: '', contrasena: '', estado: true };

  clientesFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.clientes();
    return this.clientes().filter(c =>
      c.nombre?.toLowerCase().includes(term) ||
      c.id?.toString().includes(term)
    );
  });

  constructor(private readonly clienteService: ClienteService) {}

  ngOnInit() {
    this.listarClientes();
  }

  listarClientes() {
    this.clienteService.getAll().subscribe({
      next: (data) => this.clientes.set(data),
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  soloLetras(event: KeyboardEvent): boolean {
    return /[a-zA-ZáéíóúÁÉÍÓÚñÑ ]/.test(event.key);
  }

  abrirFormulario() {
    this.mostrarFormulario.set(true);
    this.nuevoCliente = { nombre: '', direccion: '', telefono: '', contrasena: '', estado: true };
  }

  editar(cliente: any) {
    console.log('Datos recibidos de la fila:', cliente);
    this.mostrarFormulario.set(true);
    this.nuevoCliente = { ...cliente };
  }

  guardarCliente() {
    console.log('ID del cliente:', this.nuevoCliente.id);
    console.log('Datos:', this.nuevoCliente);
    if (this.nuevoCliente.id) {
      this.clienteService.update(this.nuevoCliente.id, this.nuevoCliente).subscribe({
        next: () => {
          this.mensajeExito.set('¡Cliente actualizado!');
          this.finalizarAccion();
          setTimeout(() => this.mensajeExito.set(''), 3000);
        },
        error: (err) => alert('Error al actualizar: ' + err.message)
      });
    } else {
      this.clienteService.create(this.nuevoCliente).subscribe({
        next: () => {
          this.mensajeExito.set('¡Cliente creado!');
          this.finalizarAccion();
          setTimeout(() => this.mensajeExito.set(''), 3000);
        },
        error: (err) => alert('Error al crear: ' + err.message)
      });
    }
  }

  finalizarAccion() {
    this.nuevoCliente = { nombre: '', direccion: '', telefono: '', contrasena: '', estado: true };
    this.mostrarFormulario.set(false);
    this.listarClientes();
    this.mensajeExito.set('¡Cliente actualizado exitosamente!');
    setTimeout(() => this.mensajeExito.set(''), 3000);
  }

  cancelar() {
    this.mostrarFormulario.set(false);
    this.nuevoCliente = { nombre: '', direccion: '', telefono: '', contrasena: '', estado: true };
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          this.mensajeExito.set('Cliente eliminado con éxito');
          setTimeout(() => this.mensajeExito.set(''), 3000);
          this.listarClientes();
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          console.error('Detalle:', err.error);
        }
      });
    }
  }
}