# AGENTS.MD - Documentación Técnica Completa de Factum AI

> **Propósito**: Este documento explica paso a paso cómo funciona el proyecto Factum AI para que cualquier inteligencia artificial o desarrollador pueda entenderlo completamente.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#1-descripción-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#3-tecnologías-utilizadas)
4. [Estructura de Carpetas](#4-estructura-de-carpetas)
5. [Frontend - Aplicación React](#5-frontend---aplicación-react)
6. [Backend - AWS Lambda](#6-backend---aws-lambda)
7. [Flujo de Datos Completo](#7-flujo-de-datos-completo)
8. [Sistema de Clasificación de Contenido](#8-sistema-de-clasificación-de-contenido)
9. [Servicios y Utilidades](#9-servicios-y-utilidades)
10. [Configuración de Variables de Entorno](#10-configuración-de-variables-de-entorno)
11. [Guía de Despliegue](#11-guía-de-despliegue)
12. [Despliegue en Producción](#12-despliegue-en-producción)
13. [Solución de Problemas](#13-solución-de-problemas)

---

## 1. Descripción General

### ¿Qué es Factum AI?

**Factum AI** es una aplicación web de moderación de contenido que analiza imágenes usando inteligencia artificial para detectar contenido inapropiado. Utiliza **Amazon Rekognition** como motor de análisis.

### ¿Qué problema resuelve?

Permite a plataformas web y aplicaciones moderar automáticamente imágenes subidas por usuarios, clasificándolas en tres niveles:

| Nivel | Color | Acción | Descripción |
|-------|-------|--------|-------------|
| **Seguro** | 🟢 Verde | Aprobación automática | Contenido apropiado para publicar |
| **Sugestivo** | 🟡 Amarillo | Revisión manual | Contenido que requiere decisión humana |
| **Inseguro** | 🔴 Rojo | Bloqueo automático | Contenido explícito o violento |

### Características Principales

- ✅ **Drag & Drop** para subir imágenes
- ✅ **Análisis con IA** usando Amazon Rekognition
- ✅ **Clasificación en 3 niveles** (safe/suggestive/unsafe)
- ✅ **7 pantallas navegables** con diseño modular
- ✅ **Historial persistente** en localStorage
- ✅ **Configuración personalizable** de umbrales

---

## 2. Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USUARIO (Navegador Web)                        │
│                                                                          │
│   1. Arrastra imagen    2. Ve progreso    3. Recibe resultado           │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                           │
│                                                                          │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                   │
│   │   App.jsx   │   │  Screens/   │   │ Components/ │                   │
│   │ Orquestador │   │  7 vistas   │   │ Reutilizables│                  │
│   └─────────────┘   └─────────────┘   └─────────────┘                   │
│                                                                          │
│   ┌─────────────────────────────────────────────────────┐               │
│   │                    Services/                         │               │
│   │  apiService.js │ historyService.js │ configService.js│              │
│   └─────────────────────────────────────────────────────┘               │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    │ HTTPS (REST API)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           AWS API GATEWAY                                │
│                                                                          │
│   POST /presigned-url  ───────►  Lambda: get-presigned-url              │
│   POST /moderate       ───────►  Lambda: moderate-image                  │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌─────────────────────────────┐   ┌─────────────────────────────────────┐
│        AWS S3 BUCKET        │   │        AMAZON REKOGNITION           │
│                             │   │                                      │
│  uploads/                   │   │  detectModerationLabels()           │
│    └── timestamp-image.jpg  │◄──│  - Analiza imagen                   │
│                             │   │  - Retorna etiquetas de moderación  │
│  Almacenamiento temporal    │   │  - Calcula niveles de confianza     │
└─────────────────────────────┘   └─────────────────────────────────────┘
```

### Comunicación entre Componentes

1. **Usuario → Frontend**: Interacción visual (clicks, drag & drop)
2. **Frontend → API Gateway**: Peticiones HTTP POST
3. **API Gateway → Lambda**: Invocación de funciones
4. **Lambda → S3**: Generación de URLs firmadas, almacenamiento
5. **Lambda → Rekognition**: Análisis de contenido
6. **Rekognition → Lambda → Frontend**: Respuesta con etiquetas

---

## 3. Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.0 | Framework de interfaz de usuario |
| **Vite** | 7.2.4 | Build tool y servidor de desarrollo |
| **Axios** | 1.7.9 | Cliente HTTP para llamadas a API |
| **Lucide React** | 0.562.0 | Librería de iconos |
| **React Dropzone** | 14.3.5 | Componente drag & drop |
| **Framer Motion** | 12.31.0 | Biblioteca de animaciones |
| **Sonner** | 2.0.7 | Sistema de notificaciones toast |

### Backend (AWS)

| Servicio | Función |
|----------|---------|
| **S3** | Almacenamiento de imágenes (temporal) |
| **Lambda** | Procesamiento serverless (2 funciones) |
| **API Gateway** | Exposición de endpoints REST |
| **Rekognition** | Análisis de contenido con IA |
| **IAM** | Control de acceso y permisos |

### Almacenamiento Local

| Key | Propósito |
|-----|-----------|
| `factum_history` | Historial de análisis (máx. 100 items) |
| `factum_config` | Configuración del usuario |

---

## 4. Estructura de Carpetas

```
Factum-AI/
│
├── README.md                      # Guía de instalación rápida
│
├── docs/                          # Documentación
│   ├── AWS_SETUP.md              # Guía de configuración de AWS
│   ├── DEPLOYMENT.md             # Guía de despliegue
│   └── images/                   # Imágenes para documentación
│
├── lambda/                        # Backend (AWS Lambda Functions)
│   │
│   ├── get-presigned-url/        # Función 1: Generar URL firmada
│   │   ├── index.js              # Código de la función
│   │   └── package.json          # Dependencias (@aws-sdk/client-s3)
│   │
│   └── moderate-image/           # Función 2: Moderar imagen
│       ├── index.js              # Código de la función
│       └── package.json          # Dependencias (@aws-sdk/client-rekognition)
│
└── factum-app/                    # Frontend (React Application)
    │
    ├── AGENTS.MD                  # 📍 ESTE ARCHIVO
    ├── .env                       # Variables de entorno (no en Git)
    ├── package.json               # Dependencias del proyecto
    ├── vite.config.js             # Configuración de Vite
    ├── index.html                 # HTML principal
    │
    ├── public/                    # Archivos estáticos
    │
    └── src/                       # Código fuente
        │
        ├── main.jsx              # Entry point de React
        ├── App.jsx               # Componente orquestador principal
        ├── App.css               # Estilos del App
        ├── index.css             # Estilos globales
        │
        ├── screens/              # 7 Pantallas de la aplicación
        │   ├── Screen1/          # Upload (Zona de aterrizaje)
        │   ├── Screen2/          # Procesamiento (Loading)
        │   ├── Screen3/          # Resultado: Seguro (Verde)
        │   ├── Screen4/          # Resultado: Inseguro (Rojo)
        │   ├── Screen5/          # Historial
        │   ├── Screen6/          # Configuración
        │   └── ScreenSuggestive/ # Resultado: Sugestivo (Amarillo)
        │
        ├── components/           # Componentes reutilizables
        │   ├── Navigation/       # Barra de navegación
        │   ├── ProgressSteps/    # Indicador de pasos
        │   ├── ProgressBar/      # Barra de progreso
        │   ├── ImagePreview/     # Vista previa de imagen
        │   ├── HistoryCard/      # Tarjeta de historial
        │   ├── ImageUploader.jsx # Componente de subida
        │   └── ModerationResult.jsx # Componente de resultado
        │
        ├── services/             # Servicios de datos
        │   ├── apiService.js     # Comunicación con AWS
        │   ├── historyService.js # Gestión de historial (localStorage)
        │   └── configService.js  # Gestión de configuración
        │
        ├── hooks/                # Custom React Hooks
        │   ├── useImageUpload.js # Hook para subida de imágenes
        │   ├── useModeration.js  # Hook para moderación
        │   └── useHistory.js     # Hook para historial
        │
        └── utils/                # Utilidades
            ├── constants.js      # Constantes globales
            └── helpers.js        # Funciones auxiliares
```

---

## 5. Frontend - Aplicación React

### 5.1 App.jsx - El Orquestador Principal

El archivo `App.jsx` es el **cerebro** de la aplicación. No contiene lógica de negocio, solo gestiona:

- **Estado global**: `currentScreen`, `imageData`, `moderationResult`
- **Navegación**: Cambio entre las 7 pantallas
- **Comunicación**: Callbacks entre screens
- **Clasificación**: Determina el nivel de contenido (safe/suggestive/unsafe)

#### Estados Principales

```javascript
const [currentScreen, setCurrentScreen] = useState(1);  // Pantalla actual (1-7)
const [imageData, setImageData] = useState(null);       // Datos de la imagen subida
const [moderationResult, setModerationResult] = useState(null); // Resultado del análisis
```

#### Función de Clasificación

La función `detectContentStatus()` analiza las etiquetas de Rekognition y determina el nivel:

```javascript
const detectContentStatus = (result) => {
  // GRUPO 1: INSEGURO (bloqueo automático)
  const UNSAFE_PARENTS = ['Explicit Nudity', 'Violence', 'Visually Disturbing', 'Hate Symbols'];
  
  // GRUPO 2: SUGESTIVO (revisión manual)
  const SUGGESTIVE_PARENTS = ['Suggestive', 'Tobacco', 'Alcohol', 'Drugs'];
  const SUGGESTIVE_LABELS = ['Revealing Clothes', 'Swimwear or Underwear', 'Partial Nudity'];
  
  // Lógica de clasificación (el orden importa)
  if (result.isInappropriate) return 'unsafe';
  if (labels.some(l => UNSAFE_PARENTS.includes(l.Name))) return 'unsafe';
  if (labels.some(l => SUGGESTIVE_LABELS.includes(l.Name))) return 'suggestive';
  return 'safe';
};
```

#### Flujo de Navegación

```
Screen 1 (Upload)
    │
    ▼ [imagen seleccionada]
Screen 2 (Procesamiento)
    │
    ├──▶ Screen 3 (Seguro)      → si status === 'safe'
    ├──▶ Screen 4 (Inseguro)    → si status === 'unsafe'
    └──▶ Screen 7 (Sugestivo)   → si status === 'suggestive'
```

### 5.2 Las 7 Pantallas

#### Screen 1: Zona de Aterrizaje (Upload)

**Archivo**: `screens/Screen1/Screen1.jsx`

**Propósito**: Permitir al usuario subir una imagen.

**Características**:
- Área de drag & drop usando `react-dropzone`
- Validación de formatos (JPG, PNG, GIF, WEBP)
- Límite de tamaño: 10MB
- Vista previa de imagen seleccionada
- Progreso de subida visual

**Props recibidos**:
- `onNavigate(screenNumber)` - Navegar a otra pantalla
- `onImageSelected(data)` - Pasar datos de imagen al App

**Flujo interno**:
1. Usuario arrastra/selecciona imagen
2. Se valida tipo y tamaño
3. Se solicita URL prefirmada a Lambda
4. Se sube imagen directamente a S3
5. Se activa `onImageSelected({ key, name, url })`
6. Se navega automáticamente a Screen 2

---

#### Screen 2: Procesamiento

**Archivo**: `screens/Screen2/Screen2.jsx`

**Propósito**: Mostrar el progreso del análisis con IA.

**Características**:
- Skeleton loader animado
- Indicador de pasos con estados:
  - ✅ Subiendo a S3 (completado)
  - ✅ Invocando Lambda (completado)
  - ⏳ Consultando Rekognition (en progreso)
- Dots animados (efecto bounce)
- Transición automática al completar

**Props recibidos**:
- `imageData` - Datos de la imagen (key, name, url)
- `onAnalysisComplete(result)` - Callback con resultado
- `onNavigate(screenNumber)` - Navegación

**Flujo interno**:
1. Al montar, inicia análisis automáticamente
2. Llama a `moderateImage(imageKey)` del apiService
3. Actualiza visual de cada paso
4. Al completar, llama `onAnalysisComplete(result)`
5. App.jsx redirige a Screen 3, 4 o 7

---

#### Screen 3: Contenido Seguro

**Archivo**: `screens/Screen3/Screen3.jsx`

**Propósito**: Mostrar resultado positivo (imagen segura).

**Características**:
- Icono de escudo verde
- Vista previa de imagen analizada
- Barras de progreso con categorías detectadas
- Botón "Aprobar y Publicar"
- Mensaje de éxito

**Props recibidos**:
- `moderationResult` - Resultado del análisis
- `imageUrl` - URL de la imagen analizada
- `onReset()` - Volver a Screen 1

---

#### Screen 4: Contenido Inseguro

**Archivo**: `screens/Screen4/Screen4.jsx`

**Propósito**: Mostrar resultado negativo (contenido peligroso).

**Características**:
- Imagen difuminada con overlay
- Icono X rojo en círculo
- Advertencia de contenido sensible
- Barras de detección con niveles
- Botón "Revelar (Solo Admin)"
- Botones: Rechazar / Solicitar Revisión

**Props recibidos**:
- `moderationResult` - Resultado del análisis
- `imageUrl` - URL de la imagen
- `onReset()` - Volver a Screen 1

---

#### Screen 5: Historial

**Archivo**: `screens/Screen5/Screen5.jsx`

**Propósito**: Ver análisis previos guardados.

**Características**:
- Filtros por estado: Todos / Seguros / Sugestivos / Inseguros
- Grilla responsive (4 → 3 → 2 → 1 columnas)
- Cards con borde de color según estado
- Estadísticas globales (total, seguros, sugestivos, inseguros)
- Datos persistidos en localStorage

**Funcionamiento**:
1. Lee datos de `localStorage.factum_history`
2. Aplica filtros según selección
3. Muestra tarjetas con `HistoryCard`
4. Permite limpiar historial

---

#### Screen 6: Configuración

**Archivo**: `screens/Screen6/Screen6.jsx`

**Propósito**: Ajustar parámetros de moderación.

**Características**:
- Slider para threshold (0-100%)
- Toggles para tipos de detección:
  - Detectar Desnudez Explícita (on/off)
  - Detectar Contenido Sugestivo (on/off)
- Botón "Guardar Configuración"
- Mensaje de confirmación
- Datos persistidos en localStorage

---

#### Screen 7 (ScreenSuggestive): Contenido Sugestivo

**Archivo**: `screens/ScreenSuggestive/ScreenSuggestive.jsx`

**Propósito**: Mostrar contenido que requiere revisión manual.

**Características**:
- Icono de advertencia amarillo
- Imagen visible (no bloqueada)
- Mensaje explicativo del nivel de riesgo
- Botones: Aprobar / Rechazar / Revisar
- Barras con etiquetas detectadas

---

### 5.3 Componentes Reutilizables

#### Navigation

**Archivo**: `components/Navigation/Navigation.jsx`

Barra de navegación superior.

```jsx
<Navigation 
  currentScreen={1}           // Pantalla actual resaltada
  onNavigate={(num) => {...}} // Función para cambiar pantalla
/>
```

**Botones**: Upload | Procesando | Seguro | Inseguro | Historial | Config

---

#### ProgressSteps

**Archivo**: `components/ProgressSteps/ProgressSteps.jsx`

Indicador de pasos con iconos y estados.

```jsx
<ProgressSteps steps={[
  { id: 's3', title: '1. Subiendo a S3...', status: 'completed' },
  { id: 'lambda', title: '2. Invocando Lambda...', status: 'loading' },
  { id: 'rekognition', title: '3. Consultando Rekognition...', status: 'pending' }
]} />
```

**Estados posibles**: `pending` | `loading` | `completed` | `error`

---

#### ProgressBar

**Archivo**: `components/ProgressBar/ProgressBar.jsx`

Barra de progreso horizontal.

```jsx
<ProgressBar 
  label="Desnudez"    // Nombre de la categoría
  value={0.85}        // Valor de 0 a 1
  color="#ef4444"     // Color de la barra
/>
```

---

#### ImagePreview

**Archivo**: `components/ImagePreview/ImagePreview.jsx`

Vista previa de imagen con soporte para blur.

```jsx
<ImagePreview 
  imageUrl="https://..."   // URL de la imagen
  blurred={true}           // Aplicar difuminado
  showRevealBtn={true}     // Mostrar botón revelar
  onReveal={() => {...}}   // Callback al revelar
/>
```

---

#### HistoryCard

**Archivo**: `components/HistoryCard/HistoryCard.jsx`

Tarjeta individual para el historial.

```jsx
<HistoryCard item={{
  status: 'safe',           // 'safe' | 'suggestive' | 'unsafe'
  imageName: 'foto.jpg',
  date: '2025-01-26',
  confidence: 95.5,
  labels: [...]
}} />
```

---

## 6. Backend - AWS Lambda

### 6.1 Lambda: get-presigned-url

**Ubicación**: `lambda/get-presigned-url/index.js`

**Propósito**: Generar una URL firmada temporal para subir imágenes a S3.

#### Entrada (Request Body)

```json
{
  "fileName": "imagen.jpg",
  "fileType": "image/jpeg"
}
```

#### Salida (Response)

```json
{
  "uploadUrl": "https://bucket.s3.amazonaws.com/uploads/...",
  "imageKey": "uploads/1706300000000-imagen.jpg",
  "expiresIn": 300
}
```

#### Lógica Interna

1. Recibe nombre y tipo de archivo
2. Valida que sea una imagen (`fileType.startsWith('image/')`)
3. Genera key único: `uploads/{timestamp}-{fileName}`
4. Crea URL prefirmada con expiración de 5 minutos
5. Retorna URL y key

#### Variables de Entorno Requeridas

| Variable | Descripción |
|----------|-------------|
| `S3_BUCKET_NAME` | Nombre del bucket S3 |
| `AWS_REGION` | Región de AWS (ej: us-east-2) |

#### Dependencias

```json
{
  "@aws-sdk/client-s3": "^3.x",
  "@aws-sdk/s3-request-presigner": "^3.x"
}
```

---

### 6.2 Lambda: moderate-image

**Ubicación**: `lambda/moderate-image/index.js`

**Propósito**: Analizar una imagen con Amazon Rekognition.

#### Entrada (Request Body)

```json
{
  "imageKey": "uploads/1706300000000-imagen.jpg"
}
```

#### Salida (Response)

```json
{
  "isInappropriate": true,
  "confidence": 95.5,
  "labels": [
    {
      "Name": "Explicit Nudity",
      "Confidence": 95.5,
      "ParentName": "Nudity"
    }
  ],
  "message": "Se detectó contenido inapropiado...",
  "threshold": 70
}
```

#### Lógica Interna

1. Recibe key de imagen en S3
2. Llama a `detectModerationLabels()` de Rekognition
3. Analiza etiquetas detectadas
4. Determina si es inapropiado basándose en:
   - Categorías: `Explicit Nudity`, `Violence`, etc.
   - Umbral de confianza: 70%
5. Retorna resultado estructurado

#### Categorías Explícitas (Bloqueo Automático)

```javascript
const explicitCategories = [
  'Explicit Nudity',
  'Nudity',
  'Graphic Male Nudity',
  'Graphic Female Nudity',
  'Sexual Activity',
  'Illustrated Explicit Nudity',
  'Adult Toys'
];
```

#### Variables de Entorno Requeridas

| Variable | Descripción |
|----------|-------------|
| `S3_BUCKET_NAME` | Nombre del bucket S3 |
| `AWS_REGION` | Región de AWS |

#### Dependencias

```json
{
  "@aws-sdk/client-rekognition": "^3.x"
}
```

---

## 7. Flujo de Datos Completo

### Paso a Paso Detallado

```
PASO 1: USUARIO SUBE IMAGEN
──────────────────────────────────────────────────────────
Usuario → Screen1.jsx
  │
  ├─ Arrastra imagen al área de drop
  ├─ react-dropzone detecta el archivo
  ├─ Valida: tipo (image/*) y tamaño (< 10MB)
  └─ Crea preview local con FileReader

PASO 2: OBTENER URL PREFIRMADA
──────────────────────────────────────────────────────────
Screen1.jsx → apiService.getPresignedUrl()
  │
  ├─ POST a: {API_GATEWAY}/presigned-url
  │   Body: { fileName: "foto.jpg", fileType: "image/jpeg" }
  │
  ▼
API Gateway → Lambda: get-presigned-url
  │
  ├─ Genera key: "uploads/1706300000000-foto.jpg"
  ├─ Crea URL prefirmada (válida 5 minutos)
  └─ Retorna: { uploadUrl, imageKey, expiresIn }

PASO 3: SUBIR IMAGEN A S3
──────────────────────────────────────────────────────────
apiService.uploadToS3(presignedUrl, file)
  │
  ├─ PUT directo a S3 usando la URL prefirmada
  ├─ Headers: Content-Type: image/jpeg
  └─ Imagen guardada en: s3://bucket/uploads/{key}

PASO 4: TRANSICIÓN A PROCESAMIENTO
──────────────────────────────────────────────────────────
Screen1.jsx
  │
  ├─ Llama: onImageSelected({ key, name, url })
  ├─ App.jsx actualiza: setImageData(data)
  └─ App.jsx navega: setCurrentScreen(2)

PASO 5: ANÁLISIS CON REKOGNITION
──────────────────────────────────────────────────────────
Screen2.jsx → apiService.moderateImage(imageKey)
  │
  ├─ POST a: {API_GATEWAY}/moderate
  │   Body: { imageKey: "uploads/..." }
  │
  ▼
API Gateway → Lambda: moderate-image
  │
  ├─ Llama a: rekognition.detectModerationLabels()
  │   Parámetros: { Image: { S3Object: { Bucket, Name } } }
  │
  ▼
Amazon Rekognition
  │
  ├─ Analiza contenido de la imagen
  ├─ Detecta etiquetas de moderación
  └─ Retorna: [ { Name, Confidence, ParentName }, ... ]

PASO 6: PROCESAMIENTO DE RESULTADO
──────────────────────────────────────────────────────────
Lambda: moderate-image
  │
  ├─ Evalúa etiquetas vs categorías explícitas
  ├─ Calcula: isInappropriate = true/false
  ├─ Prepara mensaje en español
  └─ Retorna: { isInappropriate, labels, confidence, message }

PASO 7: CLASIFICACIÓN Y REDIRECCIÓN
──────────────────────────────────────────────────────────
App.jsx → handleAnalysisComplete(result)
  │
  ├─ Llama: detectContentStatus(result)
  │   └─ Evalúa labels contra taxonomía
  │   └─ Retorna: 'safe' | 'suggestive' | 'unsafe'
  │
  ├─ Enriquece resultado: { ...result, status: 'safe' }
  ├─ Guarda en historial: saveToHistory(imageData, result)
  │
  └─ Navega según status:
      ├─ 'safe'       → Screen 3 (Verde)
      ├─ 'suggestive' → Screen 7 (Amarillo)
      └─ 'unsafe'     → Screen 4 (Rojo)

PASO 8: MOSTRAR RESULTADO
──────────────────────────────────────────────────────────
Screen3/4/7.jsx
  │
  ├─ Muestra imagen (con/sin blur según pantalla)
  ├─ Muestra barras de categorías detectadas
  ├─ Muestra mensaje de estado
  └─ Ofrece acciones: Aprobar/Rechazar/Revisar

PASO 9: RESET (OPCIONAL)
──────────────────────────────────────────────────────────
Usuario click "Nuevo Análisis"
  │
  └─ onReset() → App.jsx:
      ├─ setImageData(null)
      ├─ setModerationResult(null)
      └─ setCurrentScreen(1)
```

---

## 8. Sistema de Clasificación de Contenido

### Taxonomía Oficial de Amazon Rekognition

#### Nivel 1: INSEGURO (Bloqueo Automático)

| Categoría | Descripción |
|-----------|-------------|
| `Explicit Nudity` | Desnudez explícita |
| `Graphic Male Nudity` | Desnudez masculina gráfica |
| `Graphic Female Nudity` | Desnudez femenina gráfica |
| `Sexual Activity` | Actividad sexual explícita |
| `Illustrated Explicit Nudity` | Desnudez explícita ilustrada |
| `Adult Toys` | Juguetes para adultos |
| `Violence` | Violencia física, armas en uso |
| `Visually Disturbing` | Gore, mutilaciones |
| `Hate Symbols` | Símbolos de odio, nazis |

#### Nivel 2: SUGESTIVO (Revisión Manual)

| Categoría | Descripción |
|-----------|-------------|
| `Suggestive` | Contenido sexualmente sugestivo |
| `Revealing Clothes` | Ropa reveladora |
| `Swimwear or Underwear` | Trajes de baño, ropa interior |
| `Partial Nudity` | Desnudez parcial |
| `Barechested` | Torso descubierto |
| `Tobacco` | Productos de tabaco |
| `Alcohol` | Bebidas alcohólicas |
| `Drugs` | Sustancias controladas |
| `Gambling` | Contenido de apuestas |

#### Nivel 3: SEGURO

Todo lo que no coincida con las categorías anteriores.

### Lógica de Clasificación en el Frontend

```javascript
// Orden de prioridad: primero lo más grave
1. Si backend.isInappropriate === true → 'unsafe'
2. Si labels contiene UNSAFE_PARENTS → 'unsafe'
3. Si labels contiene SUGGESTIVE → 'suggestive'
4. Default → 'safe'
```

---

## 9. Servicios y Utilidades

### 9.1 apiService.js

**Ubicación**: `src/services/apiService.js`

Maneja toda la comunicación con AWS.

#### Funciones Exportadas

```javascript
// Obtener URL prefirmada para subir a S3
export const getPresignedUrl = async (fileName, fileType) => {
  // POST a /presigned-url
  // Retorna: { uploadUrl, imageKey }
}

// Subir imagen usando URL prefirmada
export const uploadToS3 = async (presignedUrl, file) => {
  // PUT directo a S3
}

// Solicitar análisis de moderación
export const moderateImage = async (imageKey, threshold = 85) => {
  // POST a /moderate
  // Retorna: { isInappropriate, labels, confidence, message }
}
```

---

### 9.2 historyService.js

**Ubicación**: `src/services/historyService.js`

Gestiona el historial en localStorage.

#### Funciones Exportadas

```javascript
// Guardar análisis en historial
export const saveToHistory = (imageData, result) => {
  // Añade al inicio del array
  // Límite: 100 items máximo
}

// Obtener todo el historial
export const getHistory = () => {
  // Lee de localStorage.factum_history
  // Retorna: array de items
}

// Filtrar historial por estado
export const filterHistory = (status) => {
  // status: 'all' | 'safe' | 'suggestive' | 'unsafe'
}

// Limpiar historial
export const clearHistory = () => {
  // Elimina factum_history de localStorage
}

// Obtener estadísticas
export const getStats = () => {
  // Retorna: { total, safe, suggestive, unsafe }
}
```

#### Estructura de un Item de Historial

```javascript
{
  id: "uuid-generado",
  imageName: "foto.jpg",
  status: "safe",           // 'safe' | 'suggestive' | 'unsafe'
  confidence: 95.5,
  labels: [...],
  date: "2025-01-26T12:00:00.000Z",
  timestamp: 1706270400000
}
```

---

### 9.3 configService.js

**Ubicación**: `src/services/configService.js`

Gestiona la configuración del usuario.

#### Configuración por Defecto

```javascript
const DEFAULT_CONFIG = {
  threshold: 85,              // Umbral de confianza (0-100)
  explicitNudity: true,       // Detectar desnudez explícita
  suggestive: false           // Detectar contenido sugestivo
};
```

#### Funciones Exportadas

```javascript
// Obtener configuración actual
export const getConfig = () => {
  // Lee de localStorage.factum_config
  // Retorna configuración con defaults
}

// Guardar configuración
export const saveConfig = (config) => {
  // Merge con defaults
  // Guarda en localStorage
}

// Resetear a valores por defecto
export const resetConfig = () => {
  // Elimina factum_config
}
```

---

## 10. Configuración de Variables de Entorno

### Archivo `.env` en `factum-app/`

```env
# ============================================
# CONFIGURACIÓN DE AWS PARA FACTUM AI
# ============================================

# URL de tu API Gateway (SIN barra al final)
# Ejemplo: https://abc123xyz.execute-api.us-east-2.amazonaws.com/prod
VITE_API_GATEWAY_URL=https://tu-api-id.execute-api.us-east-2.amazonaws.com/prod

# Región de AWS donde están tus servicios
# Opciones comunes: us-east-1, us-east-2, us-west-2, eu-west-1
VITE_AWS_REGION=us-east-2

# Nombre de tu bucket S3 (debe coincidir con el de Lambda)
VITE_S3_BUCKET_NAME=tu-bucket-name
```

### Cómo Obtener Estos Valores

1. **VITE_API_GATEWAY_URL**:
   - AWS Console → API Gateway → Tu API → Stages → prod
   - Copiar "Invoke URL"

2. **VITE_AWS_REGION**:
   - La región donde creaste tus recursos (ej: us-east-2)

3. **VITE_S3_BUCKET_NAME**:
   - AWS Console → S3 → Nombre de tu bucket

### Variables en Lambda

Cada función Lambda también necesita variables:

| Lambda | Variable | Valor |
|--------|----------|-------|
| get-presigned-url | `S3_BUCKET_NAME` | tu-bucket-name |
| get-presigned-url | `AWS_REGION` | us-east-2 |
| moderate-image | `S3_BUCKET_NAME` | tu-bucket-name |
| moderate-image | `AWS_REGION` | us-east-2 |

---

## 11. Guía de Despliegue

### Desarrollo Local

```bash
# 1. Clonar repositorio
git clone https://github.com/T0NY24/Factum-AI.git
cd Factum-AI

# 2. Instalar dependencias del frontend
cd factum-app
npm install

# 3. Configurar .env (ver sección anterior)
cp .env.example .env
# Editar .env con tus valores de AWS

# 4. Ejecutar servidor de desarrollo
npm run dev
# Abrir http://localhost:5173
```

### Desplegar Lambdas

```bash
# Lambda 1: get-presigned-url
cd lambda/get-presigned-url
npm install
zip -r function.zip .
# Subir function.zip a AWS Lambda

# Lambda 2: moderate-image
cd ../moderate-image
npm install
zip -r function.zip .
# Subir function.zip a AWS Lambda
```

### Build de Producción

```bash
cd factum-app
npm run build
# Los archivos se generan en dist/
```

### Opciones de Hosting

1. **Vercel** (Actual en producción)
2. **AWS Amplify**: Conexión directa a GitHub
3. **AWS S3 + CloudFront**: Hosting estático
4. **Netlify**: Alternativa moderna

---

## 12. Despliegue en Producción

### Información de Producción

**Factum AI** está actualmente desplegado en producción y accesible públicamente:

- 🌐 **URL Principal**: [https://factum-ia.com](https://factum-ia.com)
- 🚀 **Plataforma de Hosting**: Vercel
- 📡 **Dominio**: factum-ia.com (registrado en Namecheap)
- 🔗 **API Backend**: AWS API Gateway (us-east-2)

### Arquitectura de Despliegue

```
┌─────────────────────────────────────────────────────────────┐
│                    factum-ia.com                            │
│                 (Dominio en Namecheap)                      │
└───────────────────────────┬─────────────────────────────────┘
                            │ DNS apunta a
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL                               │
│                  (Hosting Frontend)                         │
│                                                             │
│  • Build automático desde Git                              │
│  • CDN global                                               │
│  • SSL/TLS automático                                       │
│  • Variables de entorno configuradas                        │
└───────────────────────────┬─────────────────────────────────┘
                            │ API calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS SERVICIOS                            │
│                   (Region: us-east-2)                       │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  API Gateway     │  │   Lambda         │               │
│  │  (Prod Stage)    │──│   Functions      │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  S3 Bucket       │  │  Rekognition     │               │
│  │  (Images)        │  │  (AI Analysis)   │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### Configuración de Vercel

#### Build Settings

```bash
# Framework Preset
Framework: Vite

# Build Command
npm run build

# Output Directory
dist

# Install Command
npm install
```

#### Variables de Entorno en Vercel

En el panel de Vercel → Settings → Environment Variables:

| Variable | Valor | Entorno |
|----------|-------|----------|
| `VITE_API_GATEWAY_URL` | `https://sjrqtfqq3k.execute-api.us-east-2.amazonaws.com/prod` | Production |
| `VITE_AWS_REGION` | `us-east-2` | Production |
| `VITE_S3_BUCKET_NAME` | `factum-content-moderation` | Production |

#### Configuración del Dominio en Namecheap

**Dominio**: factum-ia.com

**Configuración DNS**:

1. **Tipo A**: Apunta a los IPs de Vercel
2. **Tipo CNAME**: `www` → `cname.vercel-dns.com`

**Pasos de configuración**:

1. En Namecheap:
   - Dashboard → Domain List → factum-ia.com → Manage
   - Advanced DNS → Host Records
   - Agregar registros según Vercel

2. En Vercel:
   - Project Settings → Domains
   - Add Domain: `factum-ia.com`
   - Add Domain: `www.factum-ia.com`
   - Copiar configuración DNS proporcionada

3. Esperar propagación DNS (puede tomar 24-48 horas)

### Despliegue Continuo

Vercel está configurado con **despliegue automático**:

- ✅ **Push a main** → Deploy automático a producción
- ✅ **Pull Request** → Preview deployment automático
- ✅ **Rollback** → Restaurar a versión anterior desde dashboard

### Monitoreo y Analytics

**Vercel Analytics** está habilitado para:
- Métricas de rendimiento (Core Web Vitals)
- Visitantes únicos
- Páginas vistas
- Tiempo de carga

**AWS CloudWatch** monitorea:
- Invocaciones de Lambda
- Errores en las funciones
- Uso de Rekognition
- Transferencias en S3

### URLs de Acceso

| Entorno | URL | Propósito |
|---------|-----|----------|
| **Producción** | [https://factum-ia.com](https://factum-ia.com) | Aplicación principal |
| **Producción (www)** | [https://www.factum-ia.com](https://www.factum-ia.com) | Alias con www |
| **Preview (Vercel)** | `https://factum-app-*.vercel.app` | Despliegues de preview |
| **Local** | `http://localhost:5173` | Desarrollo local |

### Proceso de Actualización

Para desplegar cambios a producción:

```bash
# 1. Desarrollo local
npm run dev
# Hacer cambios y probar localmente

# 2. Commit y push
git add .
git commit -m "feat: descripción del cambio"
git push origin main

# 3. Vercel despliega automáticamente
# Monitorear en: https://vercel.com/dashboard
```

### Configuración de AWS Backend

#### S3 Bucket: `factum-content-moderation`

```json
{
  "Región": "us-east-2",
  "Carpetas": {
    "uploads/": "Imágenes subidas por usuarios (temporal)"
  },
  "CORS": "Configurado para aceptar requests desde factum-ia.com",
  "Lifecycle": "Eliminar objetos después de 7 días"
}
```

#### API Gateway

```
URL Base: https://sjrqtfqq3k.execute-api.us-east-2.amazonaws.com/prod

Endpoints:
  POST /presigned-url  → Lambda: get-presigned-url
  POST /moderate       → Lambda: moderate-image

CORS: Habilitado
Autenticación: API Key (opcional)
```

#### Lambda Functions

**Función 1: get-presigned-url**
- Runtime: Node.js 18.x
- Memoria: 256 MB
- Timeout: 10 segundos
- Rol IAM: Permisos S3:PutObject

**Función 2: moderate-image**
- Runtime: Node.js 18.x
- Memoria: 512 MB
- Timeout: 30 segundos
- Rol IAM: Permisos S3:GetObject, Rekognition:DetectModerationLabels

---

## 13. Solución de Problemas

### Error: CORS en API Gateway

**Síntoma**: Error "Access to fetch at ... has been blocked by CORS policy"

**Solución**:
1. API Gateway → Recurso → Enable CORS
2. Marcar: POST, OPTIONS
3. Redesplegar la API

---

### Error: URL Prefirmada Expirada

**Síntoma**: Error al subir imagen después de esperar

**Causa**: Las URLs expiran en 5 minutos

**Solución**: Reintentar subida (genera nueva URL automáticamente)

---

### Error: Access Denied en S3

**Síntoma**: 403 Forbidden al subir imagen

**Solución**:
1. Verificar permisos IAM del rol de Lambda
2. Verificar configuración CORS del bucket S3
3. Confirmar que el bucket existe

---

### Error: Rekognition No Detecta Nada

**Síntoma**: Resultado siempre vacío

**Posibles causas**:
1. Imagen no se subió correctamente a S3
2. Permisos de Lambda para leer S3
3. MinConfidence muy alto

**Solución**: Revisar CloudWatch Logs de la Lambda

---

### Las Screens 3/4/7 Aparecen Vacías

**Síntoma**: Pantallas de resultado sin datos

**Causa**: Se accedió directamente sin pasar por el flujo

**Solución**: Iniciar desde Screen 1 (Upload)

---

## 📝 Notas Finales

### Lo que SÍ hace este proyecto

- ✅ Moderar imágenes estáticas (JPG, PNG, GIF, WEBP)
- ✅ Clasificar en 3 niveles de riesgo
- ✅ Guardar historial localmente
- ✅ Configurar umbrales de detección

### Lo que NO hace este proyecto

- ❌ Autenticación de usuarios
- ❌ Base de datos persistente (solo localStorage)
- ❌ Moderación de videos
- ❌ Moderación de texto
- ❌ Tests automatizados

### Mejoras Futuras Sugeridas

1. **Autenticación**: AWS Cognito
2. **Base de datos**: DynamoDB para historial persistente
3. **Video**: Soporte para moderación de video
4. **Tests**: Jest + React Testing Library
5. **CI/CD**: GitHub Actions + AWS Amplify

---

**Última actualización**: 2026-02-05  
**Versión**: 4.0.0  
**Estado**: En producción en https://factum-ia.com  
**Hosting**: Vercel + AWS (us-east-2)
