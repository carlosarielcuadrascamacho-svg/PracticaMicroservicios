<div align="center">

# 📚 Portal de Ventas — Microservicios con Express.js

### Arquitectura de Microservicios Node.js desplegada en Render
### _Práctica Académica — Backend Escalable_

![Node](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

</div>

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requerimientos Técnicos Cubiertos](#-requerimientos-técnicos-cubiertos)
- [Guía de Instalación Paso a Paso](#-guía-de-instalación-paso-a-paso)
- [API Endpoints](#-api-endpoints)
- [Casos de Prueba](#-casos-de-prueba)
- [Evidencias de Funcionamiento](#-evidencias-de-funcionamiento)
- [Frontend Web](#-frontend-web)
- [Despliegue en Render](#-despliegue-en-render)
- [Rúbrica de Evaluación](#-rúbrica-de-evaluación)

---

## 📖 Descripción del Proyecto

Sistema backend de una **librería en línea** construido con una arquitectura de **microservicios independientes** que se comunican entre sí de forma **síncrona mediante peticiones HTTP**.

### Flujo de funcionamiento

```
Cliente (Frontend / Postman)
        │
        ▼
┌───────────────────┐      HTTP GET       ┌──────────────────────┐
│  Servicio de      │ ◄─────────────────  │  Servicio de         │
│  Órdenes          │                     │  Catálogo            │
│  (Puerto 3002)    │                     │  (Puerto 3001)       │
│                   │                     │                      │
│  POST /api/ordenes│                     │  GET /api/libros     │
│                   │                     │  GET /api/libros/:id │
└───────────────────┘                     └──────────────────────┘
```

---

## 🏗 Arquitectura

| Servicio | Puerto | Dependencias | Rol |
|----------|--------|-------------|-----|
| **servicio-catalogo** | `3001` | express, cors, dotenv | Gestiona inventario de libros en memoria |
| **servicio-ordenes** | `3002` | express, axios, cors, dotenv | Procesa compras consultando al catálogo |
| **frontend-libreria** | — | — | Interfaz visual que consume la API |

### Comunicación entre servicios

```
POST /api/ordenes                    GET /api/libros/:id
  { libroId, cantidad, cliente } ───────►  { id, titulo, autor, precio, stock }
       │                                          │
       │ ◄────────────────────────────────────────┘
       │         (200 + datos del libro)
       │
       ├── ¿Existe el libro?      No  →  res 404 "Libro no encontrado"
       ├── ¿Stock suficiente?      No  →  res 400 "Stock insuficiente"
       └── Sí, todo correcto            →  res 201 + resumen de orden
```

---

## 🛠 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Node.js** | v20+ | Entorno de ejecución |
| **Express** | 5.2.1 | Framework web para APIs REST |
| **Axios** | 1.16.1 | Cliente HTTP para comunicación entre servicios |
| **CORS** | 2.8.6 | Habilitar peticiones cross-origin |
| **Dotenv** | 17.4.2 | Variables de entorno |
| **Render** | — | Plataforma de despliegue cloud |

---

## 📁 Estructura del Proyecto

```
PracticaMicroservicios/
│
├── servicio-catalogo/              # Microservicio #1
│   ├── index.js                    # Lógica: GET /api/libros, GET /api/libros/:id
│   ├── package.json                # express, cors, dotenv
│   └── package-lock.json
│
├── servicio-ordenes/               # Microservicio #2
│   ├── index.js                    # Lógica: POST /api/ordenes
│   ├── package.json                # express, axios, cors, dotenv
│   └── package-lock.json
│
├── frontend-libreria/              # Interfaz gráfica (consumo de API)
│   ├── index.html                  # Portal administrativo
│   ├── styles.css                  # Estilos (dark mode, responsive)
│   └── app.js                      # Lógica frontend
│
├── .gitignore                      # node_modules/ y .env excluidos
├── Microservicios con Express.docx # Documento de la actividad
└── README.md                       # ← Este archivo
```

---

## ✅ Requerimientos Técnicos Cubiertos

### 🔵 Parte 1: Servicio de Catálogo (Puerto 3001)

| # | Requisito | Estado | Archivo |
|---|-----------|--------|---------|
| 1 | Arreglo en memoria con 5+ libros (`id`, `titulo`, `autor`, `precio`) | ✅ | `servicio-catalogo/index.js:10-16` |
| 2 | Endpoint `GET /api/libros` (lista completa) | ✅ | `servicio-catalogo/index.js:18-20` |
| 3 | Endpoint `GET /api/libros/:id` | ✅ | `servicio-catalogo/index.js:22-31` |
| 4 | Éxito: retorna libro con `200 OK` | ✅ | `res.status(200).json(libro)` |
| 5 | Error: retorna `404` con JSON de error | ✅ | `res.status(404).json({ error: 'Libro no encontrado' })` |

### 🟢 Parte 2: Servicio de Órdenes (Puerto 3002)

| # | Requisito | Estado | Archivo |
|---|-----------|--------|---------|
| 1 | Arreglo vacío `ordenes` en memoria | ✅ | `servicio-ordenes/index.js:13` |
| 2 | Endpoint `POST /api/ordenes` con body `{libroId, cantidad, cliente}` | ✅ | `servicio-ordenes/index.js:15-46` |
| 3 | Usa Axios para consultar al catálogo (`GET /api/libros/:id`) | ✅ | `servicio-ordenes/index.js:19` |
| 4 | Catálogo responde 404 → Órdenes responde 404 | ✅ | `servicio-ordenes/index.js:41-42` |
| 5 | Catálogo responde 200 → calcula total, guarda, responde 201 | ✅ | `servicio-ordenes/index.js:26-38` |

### 🟡 Reto Extra: Stock

| # | Requisito | Estado | Archivo |
|---|-----------|--------|---------|
| 1 | Propiedad `stock` en cada libro | ✅ | `servicio-catalogo/index.js:11-15` |
| 2 | Validar stock antes de procesar orden | ✅ | `servicio-ordenes/index.js:22-24` |
| 3 | Rechazar con `400` si stock insuficiente | ✅ | `res.status(400).json({ error: 'Stock insuficiente' })` |

---

## 🚀 Guía de Instalación Paso a Paso

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)
- [Postman](https://www.postman.com/) o [curl](https://curl.se/) para pruebas

### 1. Clonar el repositorio

```bash
git clone https://github.com/carlosarielcuadrascamacho-svg/PracticaMicroservicios.git
cd PracticaMicroservicios
```

### 2. Instalar dependencias del Servicio de Catálogo

```bash
cd servicio-catalogo
npm install
```

Esto instalará: `express`, `cors`, `dotenv`

### 3. Instalar dependencias del Servicio de Órdenes

```bash
cd ../servicio-ordenes
npm install
```

Esto instalará: `express`, `axios`, `cors`, `dotenv`

### 4. Iniciar ambos servicios

Abre **dos terminales** distintas:

**Terminal 1 — Catálogo:**
```bash
cd servicio-catalogo
npm start
# Servicio de Catálogo corriendo en puerto 3001
```

**Terminal 2 — Órdenes:**
```bash
cd servicio-ordenes
npm start
# Servicio de Órdenes corriendo en puerto 3002
```

> ⚙️ Si deseas cambiar los puertos, crea un archivo `.env` en cada carpeta:
> ```
> PORT=3001
> ```
> Para órdenes, agrega también la URL del catálogo:
> ```
> PORT=3002
> CATALOGO_URL=http://localhost:3001
> ```

### 5. Probar los servicios

```bash
# Ver catálogo completo
curl http://localhost:3001/api/libros

# Ver un libro específico
curl http://localhost:3001/api/libros/1

# Crear una orden
curl -X POST http://localhost:3002/api/ordenes \
  -H "Content-Type: application/json" \
  -d '{"libroId":1,"cantidad":2,"cliente":"Carlos"}'
```

### 6. Abrir el Frontend (opcional)

Simplemente abre `frontend-libreria/index.html` en tu navegador.

---

## 📡 API Endpoints

### Servicio de Catálogo — `https://servicio-catalogo.onrender.com`

#### `GET /api/libros`
Devuelve el listado completo de libros.

<details>
<summary>📥 Respuesta (200 OK)</summary>

```json
[
  {
    "id": 1,
    "titulo": "Cien años de soledad",
    "autor": "Gabriel García Márquez",
    "precio": 19.99,
    "stock": 10
  },
  {
    "id": 2,
    "titulo": "El Quijote",
    "autor": "Miguel de Cervantes",
    "precio": 25.50,
    "stock": 5
  },
  { "id": 3, "titulo": "1984", "autor": "George Orwell", "precio": 15.00, "stock": 8 },
  { "id": 4, "titulo": "Orgullo y prejuicio", "autor": "Jane Austen", "precio": 12.99, "stock": 3 },
  { "id": 5, "titulo": "Matar a un ruiseñor", "autor": "Harper Lee", "precio": 14.50, "stock": 7 }
]
```
</details>

#### `GET /api/libros/:id`
Devuelve un libro por su ID.

<details>
<summary>📥 Respuesta (200 OK)</summary>

```json
{ "id": 1, "titulo": "Cien años de soledad", "autor": "Gabriel García Márquez", "precio": 19.99, "stock": 10 }
```
</details>

<details>
<summary>📥 Respuesta (404 Not Found)</summary>

```json
{ "error": "Libro no encontrado" }
```
</details>

---

### Servicio de Órdenes — `https://servicio-ordenes.onrender.com`

#### `POST /api/ordenes`
Procesa la compra de un libro.

<details>
<summary>📤 Request Body</summary>

```json
{
  "libroId": 1,
  "cantidad": 2,
  "cliente": "Carlos Pérez"
}
```
</details>

<details>
<summary>📥 Respuesta (201 Created) — Éxito</summary>

```json
{
  "id": 1,
  "libroId": 1,
  "titulo": "Cien años de soledad",
  "cantidad": 2,
  "totalAPagar": 39.98,
  "cliente": "Carlos Pérez",
  "fecha": "2026-05-24T22:30:59.757Z"
}
```
</details>

<details>
<summary>📥 Respuesta (400 Bad Request) — Stock insuficiente</summary>

```json
{ "error": "Stock insuficiente" }
```
</details>

<details>
<summary>📥 Respuesta (404 Not Found) — Libro no existe</summary>

```json
{ "error": "Libro no encontrado" }
```
</details>

---

## 🧪 Casos de Prueba

### Caso 1: Compra exitosa ✅

```bash
curl -X POST https://servicio-ordenes.onrender.com/api/ordenes \
  -H "Content-Type: application/json" \
  -d '{"libroId":1,"cantidad":2,"cliente":"Carlos"}'
```

**Resultado esperado:** `201 Created`
```json
{
  "id": 1,
  "libroId": 1,
  "titulo": "Cien años de soledad",
  "cantidad": 2,
  "totalAPagar": 39.98,
  "cliente": "Carlos",
  "fecha": "2026-05-24T22:30:59.757Z"
}
```

### Caso 2: Libro no encontrado ❌

```bash
curl -X POST https://servicio-ordenes.onrender.com/api/ordenes \
  -H "Content-Type: application/json" \
  -d '{"libroId":99,"cantidad":1,"cliente":"Carlos"}'
```

**Resultado esperado:** `404 Not Found`
```json
{ "error": "Libro no encontrado" }
```

### Caso 3: Stock insuficiente ❌

```bash
curl -X POST https://servicio-ordenes.onrender.com/api/ordenes \
  -H "Content-Type: application/json" \
  -d '{"libroId":4,"cantidad":99,"cliente":"Carlos"}'
```

**Resultado esperado:** `400 Bad Request`
```json
{ "error": "Stock insuficiente" }
```

---

## 📸 Evidencias de Funcionamiento

> *Las siguientes capturas demuestran el correcto funcionamiento de los microservicios.*

### 1. Servicios corriendo en Render

| Servicio | URL | Estado |
|----------|-----|--------|
| Catálogo | [servicio-catalogo.onrender.com](https://servicio-catalogo.onrender.com/api/libros) | ✅ Activo |
| Órdenes | [servicio-ordenes.onrender.com](https://servicio-ordenes.onrender.com) | ✅ Activo |

### 2. Compra exitosa (201)

<!-- Captura aquí: POSTMAN mostrando POST /api/ordenes con libroId=1 → 201 Created -->

```
Respuesta: 201 Created
Body: {
  "id": 1,
  "libroId": 1,
  "titulo": "Cien años de soledad",
  "cantidad": 2,
  "totalAPagar": 39.98,
  "cliente": "Carlos",
  "fecha": "2026-05-24T22:30:59.757Z"
}
```

### 3. Error 404 — Libro no existe

<!-- Captura aquí: POSTMAN mostrando POST /api/ordenes con libroId=99 → 404 -->

```
Respuesta: 404 Not Found
Body: { "error": "Libro no encontrado" }
```

### 4. Error 400 — Stock insuficiente

<!-- Captura aquí: POSTMAN mostrando POST /api/ordenes con libroId=4, cantidad=99 → 400 -->

```
Respuesta: 400 Bad Request
Body: { "error": "Stock insuficiente" }
```

---

## 🎨 Frontend Web

El proyecto incluye un **panel administrativo completo** que consume los microservicios:

### Funcionalidades

| Feature | Descripción |
|---------|-------------|
| **Catálogo visual** | Tarjetas con portada, precio y barra de stock (verde/amarillo/roja) |
| **Formulario inteligente** | Select con libros, vista previa, cálculo de total en vivo |
| **Modo Compra** | Formulario validado con dropdown, cálculo de total y preview del libro |
| **🧪 Modo Prueba** | Editor libre tipo Postman: método GET/POST, URL, body JSON, respuesta cruda con status y tiempo |
| **Historial persistente** | Tabla acumulativa de órdenes guardada en localStorage |
| **Exportar CSV** | Descarga del historial de órdenes |
| **Dark Mode** | Toggle sol/luna con persistencia |
| **Toast notifications** | Notificaciones animadas con auto-dismiss |
| **Confetti** | Animación en compra exitosa |
| **Atajo de teclado** | `Escape` para limpiar formulario |
| **Responsive** | 3 columnas en desktop, 2 en tablet, 1 en mobile |

### Cómo abrirlo

```bash
start frontend-libreria/index.html
```

O simplemente haz doble clic en el archivo `index.html`.

---

## ☁ Despliegue en Render

Los servicios están desplegados en [Render](https://render.com/) usando el plan gratuito.

### Configuración de cada servicio

| Servicio | Build Command | Start Command |
|----------|--------------|---------------|
| Catálogo | `npm install` | `npm start` |
| Órdenes | `npm install` | `npm start` |

### Variables de entorno

#### servicio-ordenes (OBLIGATORIO)
| Variable | Valor | Propósito |
|----------|-------|-----------|
| `CATALOGO_URL` | `https://servicio-catalogo.onrender.com` | URL del catálogo en la nube |

### Redeploy manual

1. Ir al Dashboard de Render
2. Seleccionar el servicio
3. Ir a **Manual Deploy → Deploy latest commit**

---

## 📊 Rúbrica de Evaluación

| Criterio | Ponderación | Cumplimiento | Evidencia |
|----------|------------|--------------|-----------|
| **Configuración** — Ambos servicios inicializados correctamente en puertos distintos | 20% | ✅ Completado | `servicio-catalogo/package.json`, `servicio-ordenes/package.json` |
| **Servicio de Catálogo** — GET responde correctamente y maneja error 404 | 25% | ✅ Completado | `servicio-catalogo/index.js:18-31` |
| **Comunicación HTTP** — Órdenes usa Axios para consultar al Catálogo | 30% | ✅ Completado | `servicio-ordenes/index.js:19` |
| **Manejo de Respuestas** — Calcula total y responde según lo que dictó el Catálogo | 25% | ✅ Completado | `servicio-ordenes/index.js:22-42` |
| **Reto Extra (Stock)** — Validación de stock y rechazo | Puntos extra | ✅ Completado | `servicio-catalogo/index.js:11-15`, `servicio-ordenes/index.js:22-24` |

---

<div align="center">

---

**Desarrollado por [Carlos Ariel Cuadras Camacho](https://github.com/carlosarielcuadrascamacho-svg)**  
Práctica de Microservicios con Node.js y Express — Mayo 2026

[🔼 Volver al inicio](#-portal-de-ventas--microservicios-con-expressjs)

</div>
