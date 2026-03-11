# Backend — Plan completo de implementación

> Fichero temporal de referencia. Borrar tras lectura.

---

## 0. Estado actual

| Capa | Estado |
|---|---|
| **Backend (`backend/src/`)** | Esqueleto vacío — solo `.gitkeep` en cada carpeta. Sin `package.json`, sin servidor, sin código. |
| **Frontend** | SPA React + Vite + Tailwind. Habla **directamente con Firestore** (SDK cliente) para lecturas y clicks. Usa Firebase Auth (Google + Facebook). |
| **Base de datos** | Firestore: colección `listings` (lectura pública, escritura bloqueada). |
| **Auth** | Firebase Auth configurado en frontend (Google + Facebook providers). Login/signup solo hacen `console.log`, sin flujo real de sesión ni persistencia de usuario. |
| **Dashboard** | Existe UI con datos hardcodeados. No hay API real detrás. |

---

## 1. Inicialización del proyecto backend

### 1.1 Stack recomendado
- **Runtime**: Node.js + Express (o Fastify)
- **Lenguaje**: TypeScript
- **Base de datos**: Firestore (ya en uso) + opcionalmente PostgreSQL si se necesitan relaciones complejas
- **Auth**: Firebase Admin SDK para verificar tokens
- **WebSockets**: Socket.io (sobre el mismo servidor Express)
- **Validación**: Zod
- **Testing**: Vitest o Jest + Supertest

### 1.2 Ficheros a crear
```
backend/
  package.json
  tsconfig.json
  .env.example
  .env                    ← gitignored
  src/
    index.ts              ← entry point, arranca Express + Socket.io
    config/
      env.ts              ← validación de variables de entorno con Zod
      firebase.ts         ← inicialización firebase-admin con service account
      db.ts               ← conexión Firestore (y/o PostgreSQL si aplica)
    routes/
      index.ts            ← registro central de rutas
      auth.routes.ts
      users.routes.ts
      listings.routes.ts
      reviews.routes.ts      ← CRUD principal
      messages.routes.ts
      contact.routes.ts
      admin.routes.ts
    controllers/
      auth.controller.ts
      users.controller.ts
      listings.controller.ts
      reviews.controller.ts  ← CRUD principal
      messages.controller.ts
      contact.controller.ts
      admin.controller.ts
    services/
      auth.service.ts
      users.service.ts
      listings.service.ts
      reviews.service.ts     ← CRUD principal
      messages.service.ts
      contact.service.ts
      admin.service.ts
      email.service.ts     ← envío de emails (SendGrid/Resend/Nodemailer)
    middlewares/
      authenticate.ts      ← verificar Firebase ID token
      authorize.ts         ← verificar rol (admin, landlord, tenant, guest)
      validate.ts          ← middleware de validación con Zod
      errorHandler.ts      ← manejo global de errores
      rateLimiter.ts       ← rate limiting
      cors.ts
    models/
      user.model.ts
      listing.model.ts
      message.model.ts
      conversation.model.ts
      favorite.model.ts
      review.model.ts
    utils/
      logger.ts
      pagination.ts
      sanitize.ts
    sockets/
      index.ts             ← configuración Socket.io
      chat.handler.ts      ← handlers de mensajes en tiempo real
    tests/
      auth.test.ts
      users.test.ts
      listings.test.ts
      messages.test.ts
```

### 1.3 Variables de entorno necesarias (`.env.example`)
```env
PORT=4000
NODE_ENV=development
FIREBASE_PROJECT_ID=group5-grancanaria
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
# Si se usa PostgreSQL:
DATABASE_URL=postgresql://user:pass@localhost:5432/gcrenting
# JWT (si se complementa Firebase Auth):
JWT_SECRET=
# Email:
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=
# CORS:
CORS_ORIGIN=http://localhost:5173
# Rate limiting:
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

## 2. Autenticación y usuarios

### 2.1 Modelo de usuario (Firestore collection `users`)
```ts
type User = {
  uid: string              // Firebase Auth UID
  email: string
  displayName: string
  photoURL: string | null
  phone: string | null
  role: "admin" | "landlord" | "tenant" | "guest"
  verified: boolean        // landlord verificado, etc.
  createdAt: Timestamp
  updatedAt: Timestamp
  // Campos específicos por rol:
  landlordProfile?: {
    companyName: string | null
    taxId: string | null
    properties: string[]   // IDs de listings
  }
  tenantProfile?: {
    bio: string | null
    employment: string | null
    preferredLocations: string[]
  }
}
```

### 2.2 Flujo de autenticación
1. **Frontend**: usuario hace login con Firebase Auth (Google/Facebook/email-password)
2. **Frontend**: obtiene `idToken` con `getIdToken()`
3. **Frontend**: envía `Authorization: Bearer <idToken>` en cada petición al backend
4. **Backend middleware `authenticate.ts`**: verifica el token con `admin.auth().verifyIdToken(token)`
5. **Backend middleware `authorize.ts`**: busca el usuario en Firestore, comprueba su `role`
6. **Backend**: si es primer login, crea el documento en `users` con `role: "guest"` por defecto

### 2.3 Endpoints de Auth
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Crear perfil de usuario tras primer login social/email | Bearer token |
| GET | `/api/auth/me` | Obtener perfil del usuario autenticado | Bearer token |
| PUT | `/api/auth/me` | Actualizar perfil propio | Bearer token |

### 2.4 Endpoints de Users (admin)
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/users` | Listar usuarios (con paginación y filtros) | Admin |
| GET | `/api/users/:uid` | Ver detalle de un usuario | Admin |
| PATCH | `/api/users/:uid/role` | Cambiar rol de un usuario | Admin |
| PATCH | `/api/users/:uid/verify` | Verificar/desverificar un usuario | Admin |
| DELETE | `/api/users/:uid` | Eliminar cuenta de usuario | Admin |

---

## 3. Sistema de roles y permisos

### 3.1 Roles
| Rol | Permisos |
|---|---|
| **guest** | Ver listings, buscar, ver detalles. No puede contactar ni guardar favoritos. |
| **tenant** | Todo lo de guest + guardar favoritos + enviar mensajes + crear/editar/eliminar sus reviews. |
| **landlord** | Todo lo de tenant (los listings son scrapeados, no los crea el landlord). |
| **admin** | Acceso total: gestionar usuarios, moderar reviews, ver estadísticas, gestionar roles. |

### 3.2 Middleware `authorize.ts`
```ts
// Uso: router.get("/admin/users", authenticate, authorize("admin"), controller)
// Uso: router.post("/listings", authenticate, authorize("landlord", "admin"), controller)
```

### 3.3 Firestore rules (actualizar `firestore.rules`)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /listings/{doc} {
      allow read: if true;
      allow write: if false;  // listings son solo lectura (datos scrapeados)
    }
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin"
      );
    }
    match /users/{uid} {
      allow read: if request.auth != null && (request.auth.uid == uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin");
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    match /conversations/{convId} {
      allow read, write: if request.auth != null && request.auth.uid in resource.data.participants;
    }
    match /messages/{msgId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.senderId;
    }
    match /favorites/{favId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 4. Listings (solo lectura — datos scrapeados)

Los listings se obtienen de otra web mediante scraping y se importan a Firestore con el script `importListings.mjs`. **No hay CRUD de listings** — son datos externos de solo lectura.

### 4.1 Modelo de listing (sin cambios estructurales grandes)
```ts
type Listing = {
  id: string
  title: string
  type: string
  municipality: string
  location: string
  price: number | null
  currency: string
  bedrooms: number | null
  area: number | null
  floor: string | null
  description: string
  image: string
  phone: string
  url: string                // URL original del anuncio scrapeado
  source: string             // "lobstr", etc.
  coordinates: {             // para el mapa (añadir con migración)
    lat: number
    lng: number
  } | null
  clicks: number
  createdAt: Timestamp
}
```

### 4.2 Endpoints
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/listings` | Listar con filtros, paginación, ordenación | Público |
| GET | `/api/listings/:id` | Detalle de un listing | Público |
| POST | `/api/listings/:id/click` | Registrar click (mover del frontend) | Público |
| GET | `/api/listings/map` | Listings con coordenadas (ligero, solo id/title/price/coords) | Público |

> Los listings los gestiona únicamente el script de importación. No hay create/update/delete desde la app.

---

## 5. Mensajería en tiempo real (WebSockets)

### 5.1 Modelos

**Conversation**
```ts
type Conversation = {
  id: string
  participants: string[]       // UIDs de los 2 usuarios
  listingId: string | null     // listing relacionado (si aplica)
  lastMessage: {
    text: string
    senderId: string
    timestamp: Timestamp
  } | null
  unreadCount: Record<string, number>  // { [uid]: count }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Message**
```ts
type Message = {
  id: string
  conversationId: string
  senderId: string
  text: string
  read: boolean
  createdAt: Timestamp
}
```

### 5.2 Endpoints REST (historial)
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/conversations` | Listar conversaciones del usuario | Bearer token |
| GET | `/api/conversations/:id/messages` | Historial de mensajes (paginado) | Participante |
| POST | `/api/conversations` | Iniciar conversación (con un landlord sobre un listing) | Tenant+ |
| POST | `/api/conversations/:id/messages` | Enviar mensaje (fallback REST) | Participante |
| PATCH | `/api/conversations/:id/read` | Marcar como leídos | Participante |

### 5.3 Eventos Socket.io
```
Cliente → Servidor:
  "join-conversation"    { conversationId }
  "send-message"         { conversationId, text }
  "typing"               { conversationId }
  "mark-read"            { conversationId }

Servidor → Cliente:
  "new-message"          { message }
  "user-typing"          { conversationId, userId }
  "messages-read"        { conversationId, userId }
  "unread-count-update"  { conversationId, count }
```

### 5.4 Autenticación en Socket.io
- Al conectarse, el cliente envía el Firebase `idToken` como query param o en handshake auth
- El servidor verifica el token con firebase-admin antes de aceptar la conexión

---

## 6. Mapa

### 6.1 Opción recomendada: Leaflet + OpenStreetMap (gratis, sin API key)
- Frontend: usar `react-leaflet`
- Cada listing necesita `coordinates: { lat, lng }`

### 6.2 Geocodificación
- Servicio backend `geocode.service.ts` que convierta direcciones en coordenadas
- Usar **Nominatim** (OSM, gratis) o **Google Geocoding API** (de pago)
- Ejecutar geocodificación en el script de importación al importar listings nuevos
- Almacenar resultado en el campo `coordinates` del listing
- Para listings existentes: script de migración que geocodifique los títulos/ubicaciones

### 6.3 Endpoints
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/listings/map` | Listings con coordenadas (ligero, solo id/title/price/coords) | Público |

### 6.4 Frontend
- Componente `MapView.tsx` con react-leaflet
- Markers con popup que muestra nombre + precio
- Click en marker → navega al listing detail
- Integrar en la página de Rent o como vista alternativa

---

## 7. Favoritos

### 7.1 Modelo
```ts
type Favorite = {
  id: string
  userId: string
  listingId: string
  createdAt: Timestamp
}
```

### 7.2 Endpoints
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/favorites` | Listar favoritos del usuario | Tenant+ |
| POST | `/api/favorites` | Añadir favorito | Tenant+ |
| DELETE | `/api/favorites/:listingId` | Quitar favorito | Tenant+ |

---

## 8. Reviews / Valoraciones (CRUD principal)

Este es el recurso con CRUD completo de la aplicación. Los usuarios autenticados pueden crear, leer, editar y eliminar sus propias valoraciones sobre los listings.

### 8.1 Modelo
```ts
type Review = {
  id: string
  listingId: string
  userId: string
  userName: string           // nombre del usuario (desnormalizado para mostrar)
  userPhoto: string | null   // foto del usuario
  rating: number             // 1-5
  title: string              // título breve de la review
  comment: string            // texto de la valoración
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 8.2 Endpoints (CRUD completo)
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/listings/:id/reviews` | Listar reviews de un listing (paginado) | Público |
| GET | `/api/reviews/:id` | Ver una review específica | Público |
| POST | `/api/listings/:id/reviews` | **Crear** review | Tenant+ |
| PUT | `/api/reviews/:id` | **Editar** review propia | Owner de review |
| DELETE | `/api/reviews/:id` | **Eliminar** review | Owner de review / Admin |
| GET | `/api/reviews/my` | Listar reviews del usuario autenticado | Tenant+ |

### 8.3 Reglas de negocio
- Un usuario solo puede dejar **1 review por listing** (validar antes de crear)
- Solo el autor puede editar/eliminar su review (o un admin)
- Rating obligatorio (1-5), comment obligatorio (mínimo 10 caracteres, máximo 1000)
- Al crear/editar/eliminar, recalcular el `averageRating` y `reviewCount` en el listing
- El admin puede eliminar reviews inapropiadas desde el panel

### 8.4 Campos añadidos al listing (migración)
```ts
// Añadir a cada documento en `listings`:
{
  averageRating: number | null   // media de las valoraciones
  reviewCount: number            // número total de reviews
}
```

### 8.5 Validación con Zod
```ts
const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100),
  comment: z.string().min(10).max(1000),
})

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(3).max(100).optional(),
  comment: z.string().min(10).max(1000).optional(),
})
```

---

## 9. Contacto (formulario)

El formulario de contacto del frontend actualmente solo hace `console.log`.

### 9.1 Endpoint
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/contact` | Enviar formulario de contacto | Público (con rate limiting) |

### 9.2 Lógica
- Validar campos (nombre, email, asunto, mensaje)
- Guardar en colección `contact_submissions` en Firestore
- Enviar email al admin con el servicio de email
- Rate limiting: máximo 3 envíos por IP cada 15 minutos

---

## 10. Panel de administración (API)

### 10.1 Endpoints del dashboard
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/admin/stats` | Estadísticas globales (total usuarios, reviews, mensajes, etc.) | Admin |
| GET | `/api/admin/stats/traffic` | Datos para gráfica de tráfico | Admin |
| GET | `/api/admin/reviews` | Reviews reportadas o para moderar | Admin |
| DELETE | `/api/admin/reviews/:id` | Eliminar review inapropiada | Admin |
| GET | `/api/admin/users` | Gestión de usuarios | Admin |
| GET | `/api/admin/contact-submissions` | Ver mensajes de contacto | Admin |

### 10.2 Lo que falta en frontend
- Conectar los datos hardcodeados del dashboard a la API
- Componente de gestión de usuarios
- Componente de moderación de reviews
- Componente de ver mensajes de contacto

---

## 11. Migraciones y scripts de datos

### 11.1 Migración de listings existentes
```
scripts/
  migrations/
    001-add-coordinates-to-listings.mjs ← geocodificar direcciones
    002-add-clicks-default.mjs         ← asegurar que clicks existe en todos
    003-add-review-fields.mjs          ← añadir averageRating y reviewCount
    004-create-admin-user.mjs          ← crear documento de usuario admin
```

### 11.2 Script de seed para desarrollo
```
scripts/
  seed/
    seed-users.mjs         ← crear usuarios de prueba (1 admin, 2 landlords, 3 tenants)
    seed-conversations.mjs ← crear conversaciones y mensajes de prueba
    seed-favorites.mjs     ← crear favoritos de prueba
    seed-reviews.mjs       ← crear reviews de prueba (CRUD principal)
```

### 11.3 Pasos de migración
1. Hacer backup de Firestore antes de cada migración
2. Ejecutar scripts con `firebase-admin` (igual que `importListings.mjs`)
3. Cada script es idempotente (se puede ejecutar múltiples veces sin duplicar datos)
4. Registrar migraciones ejecutadas en una colección `_migrations`

---

## 12. Seguridad

### 12.1 Cosas que arreglar YA
- [ ] **`incrementListingClicks`** escribe directamente desde el cliente pero `firestore.rules` lo bloquea (`allow write: if false`). Mover a endpoint del backend: `POST /api/listings/:id/click`
- [ ] **Firebase config expuesta** en `lib/firebase.ts` con API keys en código fuente. Las API keys de Firebase son públicas por diseño, pero asegurar que Firestore rules y App Check estén bien configurados.
- [ ] **Login/signup no hacen nada real** — conectar Firebase Auth con creación de perfil en backend.

### 12.2 Medidas a implementar
- [ ] Rate limiting global y por endpoint
- [ ] Validación de input con Zod en todos los endpoints
- [ ] Sanitización de HTML/XSS en campos de texto
- [ ] CORS configurado solo para el dominio del frontend
- [ ] Helmet.js para headers de seguridad
- [ ] Firebase App Check para proteger las APIs
- [ ] Logs de auditoría para acciones administrativas

---

## 13. Infraestructura y despliegue

### 13.1 Opciones de despliegue del backend
| Opción | Pros | Contras |
|---|---|---|
| **Firebase Cloud Functions** | Sin servidor, escala automático, misma plataforma | Cold starts, limitaciones de runtime |
| **Cloud Run** | Contenedores, más flexible, WebSockets nativos | Más configuración |
| **Railway / Render / Fly.io** | Fácil, barato, WebSockets | Fuera del ecosistema Firebase |
| **VPS (DigitalOcean, etc.)** | Control total | Más mantenimiento |

> **Recomendación**: Cloud Run o Railway, porque necesitáis WebSockets (Cloud Functions no los soporta bien).

### 13.2 CI/CD
- GitHub Actions para:
  - Lint + tests en cada PR
  - Deploy automático del backend en merge a `main`
  - Deploy del frontend a Firebase Hosting

---

## 14. Orden de implementación sugerido

| Fase | Tareas | Prioridad |
|---|---|---|
| **1** | Inicializar backend (Express + TS + firebase-admin). Middleware de auth. Modelo de usuario. Endpoint `/api/auth/me`. | 🔴 Alta |
| **2** | Sistema de roles + middleware authorize. Endpoint admin para gestionar roles. | 🔴 Alta |
| **3** | CRUD de Reviews (crear, leer, editar, eliminar). Migración para añadir `averageRating`/`reviewCount` a listings. | 🔴 Alta |
| **4** | Conectar login/signup del frontend con el backend (crear perfil, guardar role). Proteger rutas del dashboard. | 🔴 Alta |
| **5** | Mensajería: endpoints REST + Socket.io. Frontend del chat. | 🟡 Media |
| **6** | Mapa: geocodificar listings existentes, componente MapView. | 🟡 Media |
| **7** | Favoritos + mover click tracking al backend. | 🟡 Media |
| **8** | Formulario de contacto funcional (backend + email). | 🟡 Media |
| **9** | Dashboard admin con datos reales de la API. | 🟢 Baja |
| **10** | Seguridad (rate limiting, App Check, logs). CI/CD. | 🟢 Baja |
| **11** | Seeds y migraciones completas. Testing. | 🟢 Baja |

---

## 15. Dependencias backend a instalar

```json
{
  "dependencies": {
    "express": "^4.21.0",
    "firebase-admin": "^13.7.0",
    "socket.io": "^4.8.0",
    "cors": "^2.8.5",
    "helmet": "^8.0.0",
    "zod": "^3.24.0",
    "express-rate-limit": "^7.5.0",
    "winston": "^3.17.0",
    "dotenv": "^16.5.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "typescript": "~5.9.3",
    "tsx": "^4.19.0",
    "vitest": "^3.0.0",
    "supertest": "^7.0.0",
    "@types/express": "^5.0.0",
    "@types/cors": "^2.8.17",
    "@types/multer": "^1.4.12",
    "nodemon": "^3.1.0"
  }
}
```

Frontend (nuevas dependencias):
```
react-leaflet + leaflet       ← para el mapa
socket.io-client              ← para mensajes en tiempo real
@types/leaflet                ← tipos
```
