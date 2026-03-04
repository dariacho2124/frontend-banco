import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
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
  clientes: any[] = [];
  searchTerm: string = '';
  
  mostrarFormulario: boolean = false;
  nuevoCliente: any = { 
    nombre: '', 
    direccion: '', 
    telefono: '', 
    contrasena: '', 
    estado: true 
  };

  constructor(private readonly clienteService: ClienteService, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.listarClientes();
  }

get clientesFiltrados() {
  if (!this.clientes) return [];

  if (!this.searchTerm || this.searchTerm.trim() === '') {
    return this.clientes;
  }

  return this.clientes.filter(c => {
    const nombreMatch = c.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase());
    const idMatch = c.id?.toString().includes(this.searchTerm);
    return nombreMatch || idMatch;
  });
}

  listarClientes() {
  this.clienteService.getAll().subscribe({
    next: (data) => {
      this.clientes = [...data];
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Error al cargar clientes', err)
  });
}
soloLetras(event: KeyboardEvent): boolean {
  return /[a-zA-ZáéíóúÁÉÍÓÚñÑ ]/.test(event.key);
}
 abrirFormulario() {
  this.mostrarFormulario = true;
  this.nuevoCliente = { nombre: '', direccion: '', telefono: '', contrasena: '', estado: true };
}

  editar(cliente: any) {
  console.log('Datos recibidos de la fila:', cliente);
  this.mostrarFormulario = true;
  this.nuevoCliente = { ...cliente }; 
}

mensajeExito: string = '';

guardarCliente() {
    console.log('ID del cliente:', this.nuevoCliente.id);
  console.log('Datos:', this.nuevoCliente);
  if (this.nuevoCliente.id) {
    this.clienteService.update(this.nuevoCliente.id, this.nuevoCliente).subscribe({
      next: () => {
        this.mensajeExito = '¡Cliente actualizado!';
        this.finalizarAccion();
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: (err) => alert('Error al actualizar: ' + err.message)
    });
  } else {
    this.clienteService.create(this.nuevoCliente).subscribe({
      next: () => {
        this.mensajeExito = '¡Cliente creado!';
        this.finalizarAccion();
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: (err) => alert('Error al crear: ' + err.message)
    });
  }
}
  finalizarAccion() {
  this.nuevoCliente = { nombre: '', direccion: '', telefono: '', contrasena: '', estado: true };
  this.mostrarFormulario = false;
  this.listarClientes();
  this.mensajeExito = '¡Cliente actualizado exitosamente!';
  setTimeout(() => this.mensajeExito = '', 3000);
  this.cdr.detectChanges();
}
cancelar() {
  this.mostrarFormulario = false;
  this.nuevoCliente = { nombre: '', direccion: '', telefono: '', contrasena: '', estado: true };
}

eliminar(id: number) {
  if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
    this.clienteService.delete(id).subscribe({
      next: () => {
        this.mensajeExito = 'Cliente eliminado con éxito';
        setTimeout(() => this.mensajeExito = '', 3000);
        this.listarClientes();
        this.cdr.detectChanges();
      },
     error: (err) => {
  console.error('Error al eliminar', err);
  console.error('Detalle:', err.error);
}
    });
  }
}

}