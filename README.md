# 🚀 My App - Sistema de Gestión de Clientes y Facturación

Sistema completo de gestión de clientes y facturación construido con NestJS, utilizando una arquitectura de microservicios con comunicación mediante TCP y Redis.

## 📋 Tabla de Contenidos

- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Autenticación](#-autenticación)
- [API Endpoints](#-api-endpoints)
- [Documentación Swagger](#-documentación-swagger)
- [Testing](#-testing)

## 🏗 Arquitectura

El sistema está compuesto por un **API Gateway** y **3 microservicios**:

```mermaid
graph TB
    Client[👤 Cliente HTTP]
    Gateway[🚪 API Gateway<br/>Puerto 3000<br/>main.ts]
    Auth[🔐 Auth Module<br/>JWT Strategy]
    
    InvoicesMS[📄 Invoices MS<br/>Puerto 8888<br/>TCP]
    NotificationsMS[🔔 Notifications MS<br/>Redis Pub/Sub]
    BillingMS[💳 Billing MS<br/>Event-driven]
    
    Redis[(Redis<br/>Puerto 6379)]
    
    Client -->|HTTP Request| Gateway
    Gateway -->|JWT Validation| Auth
    Gateway -->|TCP| InvoicesMS
    Gateway -->|Redis| NotificationsMS
    
    InvoicesMS -.->|Events| BillingMS
    InvoicesMS -.->|Events| NotificationsMS
    NotificationsMS -->|Pub/Sub| Redis
    
    style Gateway fill:#e1f5fe
    style Auth fill:#f3e5f5
    style InvoicesMS fill:#fff9c4
    style NotificationsMS fill:#e8f5e9
    style BillingMS fill:#fce4ec
    style Redis fill:#ffebee
```

### Componentes:

- **API Gateway**: Punto de entrada HTTP, gestiona autenticación JWT y enruta peticiones
- **Invoices Microservice**: Gestiona facturas (TCP en puerto 8888)
- **Notifications Microservice**: Envía notificaciones (Redis Pub/Sub)
- **Billing Microservice**: Procesa facturación automática (Event-driven)

## 🛠 Tecnologías

- **Framework**: NestJS 10.x
- **Runtime**: Node.js
- **Lenguaje**: TypeScript
- **Autenticación**: JWT (JSON Web Tokens)
- **Comunicación**: 
  - TCP (Invoices)
  - Redis (Notifications)
  - Event Emitter (Billing)
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Gateway
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu-secret-super-seguro-aqui
JWT_EXPIRATION=1h

# Swagger (solo desarrollo)
SWAGGER_USER=admin
SWAGGER_PASSWORD=admin123

# Redis (para Notifications)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Servicios Externos Requeridos

```bash
# Redis (para el microservicio de notificaciones)
docker run -d -p 6379:6379 redis:alpine

# O usar docker-compose
docker-compose up -d
```

## 🚀 Ejecución

### Modo Desarrollo

```bash
# Iniciar todo el sistema (Gateway + Microservicios)
npm run start:all

# O iniciar servicios por separado:

# Solo Gateway
npm run start

# Solo Microservicios
npm run start:microservices

# Microservicio individual
npm run start:micro:invoices
npm run start:micro:notifications
npm run start:micro:billing
```

### Modo Watch (Hot Reload)

```bash
npm run start:dev
```

### Modo Producción

```bash
npm run build
npm run start:prod
```

## 🔐 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para autenticar las peticiones.

### Flujo de Autenticación

```mermaid
sequenceDiagram
    actor Usuario
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant JWT as JWT Strategy
    participant Guard as JWT Guard
    
    Usuario->>Gateway: POST /auth/login<br/>{username, password}
    Gateway->>Auth: validateUser()
    Auth-->>Gateway: User válido
    Gateway->>Auth: generateToken()
    Auth->>JWT: sign(payload)
    JWT-->>Auth: JWT Token
    Auth-->>Gateway: {access_token}
    Gateway-->>Usuario: 200 OK + Token
    
    Note over Usuario: Petición protegida
    
    Usuario->>Gateway: GET /clients<br/>Authorization: Bearer <token>
    Gateway->>Guard: canActivate()
    Guard->>JWT: validate(token)
    JWT-->>Guard: payload {username}
    Guard-->>Gateway: true
    Gateway-->>Usuario: 200 OK + Data
```

### 1. Obtener Token

```bash
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Usar Token en Peticiones

Incluye el token en el header `Authorization` de todas las peticiones protegidas:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Credenciales por Defecto

- **Username**: `admin`
- **Password**: `admin`

> ⚠️ **Importante**: Cambiar estas credenciales en producción

## 📡 API Endpoints

### Mapa de Rutas

```mermaid
graph LR
    subgraph Public["🔓 Endpoints Públicos"]
        P1[GET /]
        P2[GET /status]
        P3[GET /status/uptime]
        P4[POST /auth/login]
    end
    
    subgraph Protected["🔒 Endpoints Protegidos - Requieren JWT"]
        C1[GET /clients]
        C2[GET /clients/:id]
        C3[POST /clients]
        C4[DELETE /clients/:id]
        I1[POST /clients/:id/invoice]
        I2[GET /clients/:id/invoices]
        I3[GET /clients/invoice/:id]
    end
    
    JWT[🔑 JWT Token]
    
    JWT -.->|Requerido| Protected
    
    style Public fill:#c8e6c9
    style Protected fill:#ffccbc
    style JWT fill:#fff9c4
```

### 🔓 Públicos (sin autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Homepage |
| GET | `/status` | Health check |
| GET | `/status/uptime` | Uptime del servidor |
| POST | `/auth/login` | Login y obtención de token |

### 🔒 Protegidos (requieren token JWT)

#### Clientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/clients` | Listar todos los clientes |
| GET | `/clients/:id` | Obtener un cliente específico |
| POST | `/clients` | Crear nuevo cliente |
| DELETE | `/clients/:id` | Eliminar cliente |

#### Facturas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/clients/:id/invoice` | Crear factura para un cliente |
| GET | `/clients/:id/invoices` | Listar facturas de un cliente |
| GET | `/clients/invoice/:id` | Obtener factura específica |

### 📝 Ejemplos de Uso

#### Crear Cliente

```bash
POST /clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

#### Crear Factura

```bash
POST /clients/1/invoice
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1500.50
}
```

#### Listar Facturas de un Cliente

```bash
GET /clients/1/invoices
Authorization: Bearer <token>
```

## 📘 Documentación Swagger

La documentación interactiva de la API está disponible en modo desarrollo:

🔗 **URL**: http://localhost:3000/api

### Acceso a Swagger

1. Navega a http://localhost:3000/api
2. Ingresa credenciales:
   - **Usuario**: valor de `SWAGGER_USER` (.env)
   - **Password**: valor de `SWAGGER_PASSWORD` (.env)
3. Usa el botón **"Authorize"** para agregar tu JWT token
4. Prueba los endpoints directamente desde Swagger

> 📝 **Nota**: Swagger solo está disponible en `NODE_ENV=development`

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📊 Estructura del Proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   └── dtos/
├── clients/                 # Módulo de clientes
│   ├── clients.controller.ts
│   ├── clients.service.ts
│   └── dtos/
├── invoices/               # Microservicio de facturas
│   ├── invoices.controller.ts
│   └── invoices.service.ts
├── notifications/          # Microservicio de notificaciones
│   ├── notifications.controller.ts
│   └── notifications.service.ts
├── billing/                # Microservicio de billing
│   ├── billing.service.ts
│   └── billing.module.ts
├── status/                 # Health checks
│   ├── status.controller.ts
│   └── status.service.ts
├── main.ts                 # Entry point del Gateway
├── main.invoices.ts        # Entry point Invoices MS
├── main.notifications.ts   # Entry point Notifications MS
└── main.billing.ts         # Entry point Billing MS
```

## 🔄 Flujo de Facturación

```mermaid
sequenceDiagram
    actor Cliente
    participant Gateway as API Gateway
    participant InvoicesMS as Invoices MS<br/>(TCP)
    participant BillingMS as Billing MS<br/>(Events)
    participant NotificationsMS as Notifications MS<br/>(Redis)
    
    Cliente->>Gateway: 1. POST /auth/login
    Gateway-->>Cliente: JWT Token
    
    Cliente->>Gateway: 2. POST /clients/1/invoice<br/>Authorization: Bearer <token>
    Gateway->>Gateway: Validate JWT
    
    Gateway->>InvoicesMS: 3. TCP: create_invoice<br/>{clientId: 1, amount: 1500}
    InvoicesMS->>InvoicesMS: Crear factura en DB
    
    InvoicesMS-->>Gateway: 4. Invoice created
    Gateway-->>Cliente: 200 OK + Invoice data
    
    InvoicesMS-->>BillingMS: 5. Event: invoice.created
    BillingMS->>BillingMS: Procesar factura
    
    InvoicesMS-->>NotificationsMS: 6. Event: invoice.created
    NotificationsMS->>NotificationsMS: 7. Publish to Redis
    
    Note over BillingMS,NotificationsMS: Procesamiento asíncrono
```

### Pasos del Flujo:

1. Cliente hace login → obtiene JWT token
2. Crea una factura: `POST /clients/:id/invoice`
3. **Gateway** → envía comando a **Invoices MS** (TCP)
4. **Invoices MS** → crea factura y emite evento
5. **Billing MS** → escucha evento y procesa factura
6. **Notifications MS** → envía notificación (Redis)

## 🐛 Troubleshooting

### Error: Cannot read properties of undefined (reading 'username')
- Asegúrate de enviar el header `Content-Type: application/json`
- Verifica que el body del request incluya `username` y `password`

### Error: 401 Unauthorized
- Verifica que el token JWT sea válido
- Asegúrate de incluir el header: `Authorization: Bearer <token>`
- El token expira en 1 hora, genera uno nuevo si expiró

### Microservicios no se conectan
- Verifica que Redis esté corriendo: `redis-cli ping`
- Revisa que los puertos no estén en uso
- Asegúrate de ejecutar `npm run start:all`

## 📄 Licencia

[MIT](LICENSE)

## 👥 Autor

Tu nombre - [@tuusuario](https://twitter.com/tuusuario)

---

**Desarrollado con ❤️ usando NestJS**
