# 🔐 Auth Service OAuth2

Sistema de autenticación centralizada construido con NestJS, TypeORM, PostgreSQL y Redis. Soporta autenticación tradicional (email/password) y OAuth2 (Google, GitHub).

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

---

## ✨ Características

- ✅ **Autenticación tradicional** (Email/Password con bcrypt)
- ✅ **OAuth2** (Google, GitHub)
- ✅ **JWT Access Tokens** (15 minutos)
- ✅ **JWT Refresh Tokens** (7 días, almacenados en BD)
- ✅ **Autorización basada en roles** (RBAC)
- ✅ **Gestión de usuarios** (CRUD completo)
- ✅ **Logout** (revocación de refresh tokens)
- ✅ **Logout en todos los dispositivos**
- ✅ **Documentación Swagger** (OpenAPI)
- ✅ **Docker & Docker Compose**
- ✅ **Tests unitarios** (Jest)
- ✅ **Validación de datos** (class-validator)
- ✅ **SOLID Principles**
- ✅ **Clean Code**
- ✅ **TDD** (Test-Driven Development)

---

## 🏗️ Arquitectura
```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Frontend)                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (NestJS)                      │
│  - Rate Limiting                                             │
│  - Request Validation                                        │
│  - JWT Authentication                                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Auth       │   │   User       │   │   Token      │
│   Module     │   │   Module     │   │   Module     │
│              │   │              │   │              │
│ - Local Auth │   │ - CRUD       │   │ - JWT Gen    │
│ - OAuth2     │   │ - Profiles   │   │ - Refresh    │
│ - Providers  │   │ - Roles      │   │ - Revoke     │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ▼
              ┌─────────────────────┐
              │   PostgreSQL DB     │
              │  - users            │
              │  - oauth_accounts   │
              │  - refresh_tokens   │
              └─────────────────────┘
```

---

## 🚀 Inicio Rápido

### **Requisitos:**

- Node.js 18+
- Docker Desktop
- Git

### **1. Clonar repositorio:**
```bash
git clone https://github.com/GAMR11/api-oauth2-google-github.git
cd api-oauth2-google-github
```

### **2. Instalar dependencias:**
```bash
npm install
```

### **3. Configurar variables de entorno:**

Copia el archivo de ejemplo y edítalo:
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=auth_service

# JWT
JWT_SECRET=tu-secreto-jwt-minimo-32-caracteres
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=tu-secreto-refresh-token
JWT_REFRESH_EXPIRATION=7d

# OAuth2 - Google
GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

# OAuth2 - GitHub
GITHUB_CLIENT_ID=tu-github-client-id
GITHUB_CLIENT_SECRET=tu-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/v1/auth/github/callback

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### **4. Iniciar Docker (PostgreSQL, Redis, PgAdmin):**
```bash
npm run docker:up
```

### **5. Iniciar aplicación:**
```bash
npm run start:dev
```

### **6. Abrir Swagger:**
```
http://localhost:3000/api/v1/docs
```

---

## 📡 Endpoints Principales

### **Autenticación**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Registrar nuevo usuario | ❌ |
| `POST` | `/auth/login` | Iniciar sesión | ❌ |
| `POST` | `/auth/refresh` | Renovar access token | ❌ |
| `POST` | `/auth/logout` | Cerrar sesión | ✅ |
| `POST` | `/auth/logout-all` | Cerrar todas las sesiones | ✅ |
| `GET` | `/auth/me` | Obtener perfil | ✅ |
| `GET` | `/auth/google` | Login con Google | ❌ |
| `GET` | `/auth/github` | Login con GitHub | ❌ |

### **Usuarios**

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| `GET` | `/users/me` | Mi perfil | ✅ | - |
| `PATCH` | `/users/me` | Actualizar perfil | ✅ | - |
| `GET` | `/users` | Listar usuarios | ✅ | ADMIN |
| `GET` | `/users/:id` | Ver usuario | ✅ | ADMIN |
| `PATCH` | `/users/:id` | Actualizar usuario | ✅ | ADMIN |
| `DELETE` | `/users/:id` | Eliminar usuario | ✅ | ADMIN |

---

## 🧪 Pruebas

### **Ejecutar tests:**
```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:cov

# Tests en modo watch
npm run test:watch

# Tests e2e
npm run test:e2e
```

---

## 📚 Documentación

### **Swagger UI:**
```
http://localhost:3000/api/v1/docs
```

### **PgAdmin (PostgreSQL UI):**
```
http://localhost:5050
Credenciales:
  - Email: admin@admin.com
  - Password: admin
```

### **Redis Commander:**
```
http://localhost:8081
```

---

## 🐳 Docker

### **Comandos útiles:**
```bash
# Iniciar servicios
npm run docker:up

# Parar servicios
npm run docker:down

# Ver logs
npm run docker:logs

# Reiniciar servicios
npm run docker:restart

# Limpiar todo (incluye volúmenes)
npm run docker:clean
```

### **Servicios disponibles:**

- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **PgAdmin**: `localhost:5050`
- **Redis Commander**: `localhost:8081`

---

## 🔑 Configurar OAuth2

### **Google OAuth:**

1. Ve a: https://console.cloud.google.com/
2. Crea un proyecto
3. Ve a "APIs & Services" → "Credentials"
4. Crea "OAuth client ID"
5. Tipo: "Web application"
6. Authorized redirect URI: `http://localhost:3000/api/v1/auth/google/callback`
7. Copia Client ID y Secret al `.env`

### **GitHub OAuth:**

1. Ve a: https://github.com/settings/developers
2. Click "New OAuth App"
3. Homepage URL: `http://localhost:3000`
4. Callback URL: `http://localhost:3000/api/v1/auth/github/callback`
5. Copia Client ID y Secret al `.env`

---

## 🏛️ Estructura del Proyecto
```
src/
├── common/                 # Utilidades compartidas
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── pipes/
├── config/                 # Configuraciones
│   └── database.config.ts
├── modules/
│   ├── auth/              # Módulo de autenticación
│   │   ├── controllers/
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── guards/
│   │   ├── interfaces/
│   │   ├── services/
│   │   ├── strategies/
│   │   └── auth.module.ts
│   ├── tokens/            # Gestión de tokens
│   │   ├── entities/
│   │   ├── services/
│   │   └── tokens.module.ts
│   └── users/             # Gestión de usuarios
│       ├── controllers/
│       ├── dto/
│       ├── entities/
│       ├── services/
│       └── users.module.ts
├── app.module.ts
└── main.ts
```

---

## 🛡️ Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 salt rounds)
- ✅ JWT con expiración corta (15 minutos)
- ✅ Refresh tokens almacenados en BD (revocables)
- ✅ Validación de datos con class-validator
- ✅ Guards de autenticación y autorización
- ✅ CORS configurado
- ✅ Rate limiting (próximamente)
- ✅ Helmet para headers de seguridad (próximamente)

---

## 🎯 Principios Aplicados

### **SOLID:**

- **S**ingle Responsibility: Cada módulo tiene una única responsabilidad
- **O**pen/Closed: Extensible sin modificar código existente
- **L**iskov Substitution: Interfaces bien definidas
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Inyección de dependencias

### **Clean Code:**

- Nombres descriptivos
- Funciones pequeñas y específicas
- Comentarios JSDoc
- Código autodocumentado

### **TDD:**

- Tests escritos primero
- Red-Green-Refactor
- Cobertura de código

---

## 📊 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| NestJS | 10.x | Framework backend |
| TypeScript | 5.x | Lenguaje tipado |
| PostgreSQL | 15 | Base de datos relacional |
| TypeORM | 0.3.x | ORM |
| Redis | 7 | Cache y sesiones |
| Passport | 0.7.x | Autenticación |
| JWT | 10.x | Tokens |
| Swagger | 7.x | Documentación API |
| Jest | 29.x | Testing |
| Docker | Latest | Containerización |

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

---

## 👨‍💻 Autor

**Tu Nombre**

- GitHub: [@tu-usuario](https://github.com/GAMR11)
- LinkedIn: [Tu LinkedIn](https://www.linkedin.com/in/gustavo-morales-640259221/)
- Email: gamr130898@gmail.com

---

## 🙏 Agradecimientos

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [Passport.js](http://www.passportjs.org/)

---

## 📅 Roadmap

- [x] Autenticación local
- [x] OAuth2 (Google, GitHub)
- [x] JWT + Refresh Tokens
- [x] Roles y permisos
- [x] Documentación Swagger
- [ ] Rate Limiting
- [ ] Email Verification
<!-- - [ ] Password Reset
- [ ] Two-Factor Authentication (2FA)
- [ ] Logs con Winston
- [ ] Monitoreo con Prometheus
- [ ] CI/CD con GitHub Actions
- [ ] Tests E2E completos -->