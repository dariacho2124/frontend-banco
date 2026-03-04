# Sistema de Gestión Bancaria - Fullstack (Angular 21 & Spring Boot)

Este proyecto es una solución integral para la gestión de clientes, cuentas y movimientos bancarios. Incluye lógica avanzada para el procesamiento automático de transacciones y validación de saldos.

## Tecnologías Utilizadas

* **Frontend:** Angular 21.1.4 (usando Vitest para pruebas y RxJS para reactividad).
* **Backend:** Spring Boot con Java 17.
* **Gestión de Paquetes:** npm 11.6.2.
* **Infraestructura:** Docker y Docker Compose para servicios de base de datos y API.

---

## Requisitos y Ejecución

### 1. Backend (Java 17)
Asegúrese de estar en la carpeta raíz del servidor y ejecute:
```bash
docker-compose down
./mvnw clean package -DskipTests
docker-compose up --build

# Sistema Bancario Fullstack: Arquitectura Decoupled (Angular 21 & Spring Boot)

Este proyecto implementa una solución robusta para la gestión de transacciones financieras. Se enfoca en la integridad de los datos, el manejo asíncrono de estados y una experiencia de usuario fluida mediante una arquitectura desacoplada.

## Arquitectura Técnica

### Frontend (Angular 21.1.4)
La aplicación cliente utiliza un enfoque de **Componentes Reactivos** y servicios inyectables:
* **Enrutamiento Avanzado:** Implementado en `app.routes.ts` (o `app-routing.module.ts`), permitiendo la navegación SPA (Single Page Application) entre Clientes, Cuentas y Movimientos.
* **Comunicación API:** Uso de `HttpClient` con **Observables (RxJS)** para manejar flujos de datos asíncronos.
* **Proxy Configuration:** Uso de `proxy.conf.json` para mapear las peticiones `/api` al puerto `8080`, resolviendo problemas de **CORS** en entornos de desarrollo.
* **Interfaz Dinámica:** Renderizado condicional y manejo de eventos para formularios de transacciones en tiempo real.

### Backend (Spring Boot & Java 17)
Estructurado bajo el patrón **Controller-Service-Repository**:
* **Capa de Servicio:** Centraliza la lógica de negocio (validación de saldos y normalización de signos).
* **Persistencia:** JPA/Hibernate con repositorios que gestionan la integridad referencial.
* **Contenerización:** Despliegue mediante Docker para asegurar un entorno de ejecución idéntico (Reproducibilidad).

---

### Algoritmo de Normalización de Movimientos
Para evitar errores humanos y simplificar la interfaz, el sistema implementa una lógica de pre-procesamiento en la capa de servicio de Java:

1. **Input:** El usuario envía un valor siempre positivo (ej. `100`).
2. **Evaluación:** El sistema verifica el `tipoMovimiento`.
3. **Transformación:** - Si es **Retiro**: El valor se convierte internamente a negativo (`-100`).
   - Si es **Depósito**: Se asegura un valor positivo.
4. **Validación:** Se calcula el nuevo saldo. Si el resultado es `< 0`, se dispara una excepción `RuntimeException` que el Frontend captura para informar al usuario.

---

# Configuración Rutas y Endpoints

### API (Backend)
- `GET /api/clientes`: Listado de clientes.
- `POST /api/cuentas`: Creación de cuentas vinculadas a clientes.
- `GET/POST /api/movimientos`: Gestión de transacciones y cálculo de saldos.

### Navegación (Frontend)
- `/clientes`: Gestión de perfiles.
- `/cuentas`: Administración de productos bancarios.
- `/movimientos`: Panel de operaciones financieras y visualización de historial.

---

## Guía de Despliegue Rápido

### Requisitos
- Java 21, Node.js 20+, Docker Desktop.

### Backend (Container-First)
```bash
cd backend-banco
./mvnw clean package -DskipTests
docker-compose up --build