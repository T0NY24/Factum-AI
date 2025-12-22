# AGENTS.MD - Documentación del Proyecto Factum AI

## 📋 Índice

1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Arquitectura General](#arquitectura-general)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Frontend - React](#frontend---react)
5. [Backend - AWS](#backend---aws)
6. [Flujo de Datos](#flujo-de-datos)
7. [Componentes Detallados](#componentes-detallados)
8. [Servicios y Utilidades](#servicios-y-utilidades)
9. [Configuración](#configuración)
10. [Deployment](#deployment)

---

## 📖 Resumen del Proyecto

**Factum AI** es una aplicación web de moderación de contenido que utiliza **Amazon Rekognition** para detectar contenido inapropiado en imágenes. La aplicación permite subir imágenes, analizarlas con IA, y clasificarlas como seguras o inapropiadas.

### Tecnologías Principales

- **Frontend**: React 19, Vite, Lucide React (iconos)
- **Backend**: AWS (S3, Lambda, API Gateway, Rekognition)
- **Almacenamiento**: S3 (imágenes), LocalStorage (historial y configuración)
- **Deployment**: Vite (dev), AWS (producción)

### Características Clave

✅ **Upload de imágenes** con drag & drop  
✅ **Análisis con IA** usando Amazon Rekognition  
✅ **6 pantallas navegables** con diseño modular  
✅ **Historial persistente** en localStorage  
✅ **Configuración personalizable** (threshold, detecciones)  
✅ **Arquitectura modular** fácil de mantener

---

## 🏗 Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                      USUARIO (Browser)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  App.jsx (Orquestador)                               │   │
│  │  ├── Navigation                                       │   │
│  │  ├── Screen1 (Upload)                                 │   │
│  │  ├── Screen2 (Processing)                             │   │
│  │  ├── Screen3 (Safe Content)                           │   │
│  │  ├── Screen4 (Unsafe Content)                         │   │
│  │  ├── Screen5 (History)                                │   │
│  │  └── Screen6 (Configuration)                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services                                             │   │
│  │  ├── apiService    (AWS API calls)                    │   │
│  │  ├── historyService (LocalStorage)                    │   │
│  │  └── configService  (LocalStorage)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS (API Gateway)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       AWS BACKEND                           │
│                                                              │
│  ┌────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │ API Gateway│───▶│   Lambda    │───▶│   Rekognition   │  │
│  └────────────┘    └─────────────┘    └─────────────────┘  │
│         │                                                    │
│         │                                                    │
│         ▼                                                    │
│  ┌────────────┐                                              │
│  │     S3     │  (Almacenamiento de imágenes)               │
│  └────────────┘                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas

```
factum-app/
├── public/                    # Archivos estáticos
│
├── src/
│   ├── screens/              # 6 pantallas independientes
│   │   ├── Screen1/         # Upload/Landing
│   │   │   ├── Screen1.jsx
│   │   │   └── Screen1.css
│   │   ├── Screen2/         # Processing
│   │   │   ├── Screen2.jsx
│   │   │   └── Screen2.css
│   │   ├── Screen3/         # Safe Content
│   │   │   ├── Screen3.jsx
│   │   │   └── Screen3.css
│   │   ├── Screen4/         # Unsafe Content
│   │   │   ├── Screen4.jsx
│   │   │   └── Screen4.css
│   │   ├── Screen5/         # History
│   │   │   ├── Screen5.jsx
│   │   │   └── Screen5.css
│   │   └── Screen6/         # Configuration
│   │       ├── Screen6.jsx
│   │       └── Screen6.css
│   │
│   ├── components/          # Componentes reutilizables
│   │   ├── Navigation/
│   │   │   ├── Navigation.jsx
│   │   │   └── Navigation.css
│   │   ├── ProgressSteps/
│   │   │   ├── ProgressSteps.jsx
│   │   │   └── ProgressSteps.css
│   │   ├── ProgressBar/
│   │   │   ├── ProgressBar.jsx
│   │   │   └── ProgressBar.css
│   │   ├── ImagePreview/
│   │   │   ├── ImagePreview.jsx
│   │   │   └── ImagePreview.css
│   │   └── HistoryCard/
│   │       ├── HistoryCard.jsx
│   │       └── HistoryCard.css
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useImageUpload.js
│   │   ├── useModeration.js
│   │   └── useHistory.js
│   │
│   ├── services/            # Servicios de datos
│   │   ├── apiService.js
│   │   ├── historyService.js
│   │   └── configService.js
│   │
│   ├── utils/               # Utilidades
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos del App
│   ├── index.css            # Estilos globales
│   └── main.jsx             # Entry point
│
├── .env                     # Variables de entorno
├── .env.example             # Ejemplo de .env
├── package.json
├── vite.config.js
└── AGENTS.MD               # Este archivo
```

---

## ⚛️ Frontend - React

### App.jsx (Orquestador Principal)

El componente `App.jsx` actúa como orquestador de toda la aplicación. **No contiene lógica de negocio**, solo gestiona:

- **Navegación entre screens** (currentScreen state)
- **Estado global compartido** (imageData, moderationResult)
- **Callbacks** para comunicación entre screens

```javascript
function App() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [imageData, setImageData] = useState(null);
  const [moderationResult, setModerationResult] = useState(null);

  // Handlers para comunicación con screens
  const handleNavigate = (screenNumber) => { ... };
  const handleImageSelected = (data) => { ... };
  const handleAnalysisComplete = (result) => { ... };
  const handleReset = () => { ... };

  return (
    <div className="app">
      <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
      <main className="app-content">
        {currentScreen === 1 && <Screen1 ... />}
        {currentScreen === 2 && <Screen2 ... />}
        // ... resto de screens
      </main>
    </div>
  );
}
```

### Pantallas (Screens)

Cada pantalla es un componente independiente con su propia lógica y estilos.

#### **Screen 1: Zona de Aterrizaje (Upload)**
- **Propósito**: Upload de imágenes con drag & drop
- **Características**:
  - Área de drag & drop con react-dropzone
  - Validación de formatos (JPG, PNG, GIF, WEBP, máx 10MB)
  - Preview de imagen seleccionada
  - Progreso de upload
  - Transición automática a Screen 2 tras upload exitoso
- **Hook usado**: `useImageUpload`

#### **Screen 2: Procesamiento**
- **Propósito**: Mostrar progreso del análisis
- **Características**:
  - Skeleton loader animado
  - Indicadores de progreso paso a paso:
    1. Subiendo a S3 ✓
    2. Invocando AWS Lambda ✓
    3. Consultando Amazon Rekognition... ⏳
  - Dots animados (bounce)
  - Transición automática a Screen 3 o 4 según resultado
- **Hook usado**: `useModeration`

#### **Screen 3: Contenido Seguro**
- **Propósito**: Mostrar resultado de imagen segura
- **Características**:
  - Icono de escudo verde
  - Preview de imagen analizada
  - Barras de progreso con categorías detectadas
  - Botón "Aprobar y Publicar"
  - Datos de demostración si se accede directamente
- **Props**: `moderationResult`, `imageUrl`, `onReset`

#### **Screen 4: Contenido Inapropiado**
- **Propósito**: Mostrar resultado de imagen inapropiada
- **Características**:
  - Imagen difuminada con overlay
  - Icono X rojo en círculo
  - Advertencia de contenido sensible
  - Barras de progreso con niveles de detección
  - Botón "Revelar (Solo Admin)"
  - Botones de acción (Rechazar/Revisar)
  - Datos de demostración si se accede directamente
- **Props**: `moderationResult`, `imageUrl`, `onReset`

#### **Screen 5: Historial**
- **Propósito**: Ver análisis previos
- **Características**:
  - Filtros por estado (Todos, Seguros, Inapropiados)
  - Grilla responsive de 4 columnas (adapta a 3→2→1)
  - Cards con bordes verde/rojo según estado
  - Estadísticas globales
  - Persistencia en localStorage
- **Hook usado**: `useHistory`

#### **Screen 6: Configuración**
- **Propósito**: Ajustar parámetros de moderación
- **Características**:
  - Slider personalizado para threshold (0-100%)
  - Toggles personalizados para detecciones:
    - Detectar Desnudez Explícita
    - Detectar Contenido Sugestivo
  - Botón "Guardar Configuración"
  - Mensaje de confirmación
  - Persistencia en localStorage
- **Estado local**: threshold, explicitNudity, suggestive

### Componentes Reutilizables

#### **Navigation**
Barra de navegación superior con 6 botones.
```javascript
<Navigation currentScreen={1} onNavigate={(num) => {...}} />
```

#### **ProgressSteps**
Indicador de pasos con iconos y estados.
```javascript
<ProgressSteps steps={[
  { id: 's3', title: '1. Subiendo a S3...', status: 'completed', message: 'Completado' },
  { id: 'lambda', title: '2. Lambda...', status: 'loading', message: 'Procesando...' },
  ...
]} />
```

#### **ProgressBar**
Barra de progreso horizontal con label y porcentaje.
```javascript
<ProgressBar label="Desnudez" value={0.01} color="#9ca3af" />
```

#### **ImagePreview**
Preview de imagen con soporte para blur.
```javascript
<ImagePreview 
  imageUrl="..." 
  blurred={true} 
  showRevealBtn={true}
  onReveal={() => {...}} 
/>
```

#### **HistoryCard**
Card individual para historial.
```javascript
<HistoryCard item={{
  status: 'safe',
  date: '2025-12-22',
  imageName: 'landscape.jpg'
}} />
```

---

## 🔧 Custom Hooks

### useImageUpload
Gestiona el proceso de carga de imágenes.

```javascript
const {
  uploading,    // boolean: está subiendo
  progress,     // number: 0-100
  error,        // string|null: mensaje de error
  preview,      // string|null: URL de preview
  handleUpload, // function: sube archivo
  resetUpload   // function: resetea estado
} = useImageUpload();
```

**Flujo**:
1. Valida archivo (tipo, tamaño)
2. Crea preview con FileReader
3. Obtiene presigned URL de API
4. Sube a S3
5. Retorna `{ key, name, type, url }`

### useModeration
Gestiona el análisis de moderación.

```javascript
const {
  analyzing,        // boolean: está analizando
  result,           // object|null: resultado
  error,            // string|null: mensaje de error
  currentStep,      // string: paso actual
  steps,            // array: pasos con estados
  analyzeImage,     // function: analiza imagen
  resetModeration   // function: resetea estado
} = useModeration();
```

**Flujo**:
1. Actualiza paso a "Subiendo a S3" (ya completado)
2. Actualiza paso a "Invocando Lambda"
3. Actualiza paso a "Consultando Rekognition"
4. Llama a `moderateImage(imageKey, threshold)`
5. Retorna resultado

### useHistory
Gestiona el historial de análisis.

```javascript
const {
  history,          // array: lista de análisis
  filter,          // string: 'all'|'safe'|'unsafe'
  loading,         // boolean: está cargando
  applyFilter,     // function: cambia filtro
  clearHistory,    // function: limpia historial
  refreshHistory,  // function: recarga datos
  getStats         // function: retorna estadísticas
} = useHistory();
```

---

## 💾 Servicios y Utilidades

### apiService.js

Maneja todas las comunicaciones con AWS.

```javascript
// Obtener presigned URL para upload a S3
export const getPresignedUrl = async (fileName, fileType) => {
  const response = await axios.post(`${API_BASE_URL}/presigned-url`, {
    fileName, fileType
  });
  return response.data; // { uploadUrl, imageKey }
};

// Subir imagen a S3
export const uploadToS3 = async (presignedUrl, file) => {
  await axios.put(presignedUrl, file, {
    headers: { 'Content-Type': file.type }
  });
};

// Moderar imagen con Rekognition
export const moderateImage = async (imageKey, threshold = 85) => {
  const response = await axios.post(`${API_BASE_URL}/moderate`, {
    imageKey, threshold
  });
  return response.data; 
  // { isInappropriate, labels, confidence, message }
};
```

### historyService.js

Gestiona el historial en localStorage.

```javascript
// Guardar análisis
export const saveToHistory = (imageData, result) => {
  const history = getHistory();
  history.unshift({
    id: generateId(),
    imageName: imageData.name,
    status: result.isInappropriate ? 'unsafe' : 'safe',
    confidence: result.confidence,
    labels: result.labels,
    date: new Date().toISOString(),
    timestamp: Date.now()
  });
  localStorage.setItem('factum_history', JSON.stringify(history.slice(0, 100)));
};

// Obtener historial
export const getHistory = () => {
  const data = localStorage.getItem('factum_history');
  return data ? JSON.parse(data) : [];
};

// Filtrar historial
export const filterHistory = (status) => {
  return getHistory().filter(item => 
    status === 'all' || item.status === status
  );
};
```

### configService.js

Gestiona la configuración en localStorage.

```javascript
// Valores por defecto
const DEFAULT_CONFIG = {
  threshold: 85,
  explicitNudity: true,
  suggestive: false
};

// Obtener configuración
export const getConfig = () => {
  const data = localStorage.getItem('factum_config');
  return data ? JSON.parse(data) : DEFAULT_CONFIG;
};

// Guardar configuración
export const saveConfig = (config) => {
  const merged = { ...DEFAULT_CONFIG, ...config };
  localStorage.setItem('factum_config', JSON.stringify(merged));
  return merged;
};
```

### constants.js

Constantes globales de la aplicación.

```javascript
export const SCREEN_NAMES = {
  1: 'Zona de Aterrizaje',
  2: 'Procesando',
  3: 'Contenido Seguro',
  4: 'Contenido Inapropiado',
  5: 'Historial',
  6: 'Configuración'
};

export const STATUS_SAFE = 'safe';
export const STATUS_UNSAFE = 'unsafe';
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
```

### helpers.js

Funciones de utilidad.

```javascript
// Formatear fecha
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Validar archivo
export const validateFile = (file) => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Archivo inválido' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Archivo muy grande' };
  }
  return { valid: true, error: null };
};
```

---

## ☁️ Backend - AWS

### Arquitectura AWS

```
API Gateway (REST API)
  │
  ├─── POST /presigned-url  → Lambda: getPresignedUrl
  │                           └─→ genera presigned URL de S3
  │
  └─── POST /moderate        → Lambda: moderateImage
                              └─→ llama a Rekognition
                              └─→ retorna resultado
```

### Lambda Function: getPresignedUrl

```javascript
// Genera URL firmada para upload a S3
exports.handler = async (event) => {
  const { fileName, fileType } = JSON.parse(event.body);
  const imageKey = `uploads/${Date.now()}-${fileName}`;
  
  const uploadUrl = await s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: imageKey,
    ContentType: fileType,
    Expires: 300  // 5 minutos
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify({ uploadUrl, imageKey })
  };
};
```

### Lambda Function: moderateImage

```javascript
// Analiza imagen con Rekognition
exports.handler = async (event) => {
  const { imageKey, threshold } = JSON.parse(event.body);
  
  const result = await rekognition.detectModerationLabels({
    Image: {
      S3Object: {
        Bucket: BUCKET_NAME,
        Name: imageKey
      }
    },
    MinConfidence: threshold || 85
  }).promise();
  
  const labels = result.ModerationLabels;
  const isInappropriate = labels.length > 0;
  const confidence = labels[0]?.Confidence || 0;
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      isInappropriate,
      labels,
      confidence,
      message: isInappropriate 
        ? 'Contenido inapropiado detectado'
        : 'Contenido seguro'
    })
  };
};
```

### S3 Bucket Configuration

- **Nombre**: `factum-ai-images` (ejemplo)
- **Región**: `us-east-2`
- **CORS**: Habilitado para requests desde frontend
- **Lifecycle**: Borrar imágenes después de 30 días (opcional)

---

## 🔄 Flujo de Datos

### Flujo Completo de Análisis

```
1. USER: Arrastra imagen en Screen1
   └─→ Screen1.jsx: onDrop()
       └─→ useImageUpload: handleUpload()
           ├─→ validateFile()
           ├─→ apiService: getPresignedUrl()
           │   └─→ API Gateway → Lambda → S3 presigned URL
           └─→ apiService: uploadToS3()
               └─→ S3: imagen guardada
               └─→ onImageSelected({ key, name, url })
                   └─→ App.jsx: setImageData()
                   └─→ onNavigate(2) → SCREEN 2

2. Screen2.jsx auto-ejecuta análisis
   └─→ useModeration: analyzeImage(imageKey)
       ├─→ configService: getThreshold()
       └─→ apiService: moderateImage(imageKey, threshold)
           └─→ API Gateway → Lambda → Rekognition
               └─→ resultado: { isInappropriate, labels, confidence }
                   └─→ onAnalysisComplete(result)
                       ├─→ App.jsx: setModerationResult()
                       ├─→ historyService: saveToHistory()
                       └─→ onNavigate(3 o 4) → SCREEN 3/4

3. Screen3/4 muestra resultado
   └─→ Usuario: "Aprobar" o "Rechazar"
       └─→ onReset()
           └─→ App.jsx: reset + onNavigate(1) → SCREEN 1
```

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```bash
# API Gateway URL
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-2.amazonaws.com/prod

# Configuración opcional
VITE_AWS_REGION=us-east-2
VITE_S3_BUCKET=factum-ai-images
```

### package.json

```json
{
  "name": "factum-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-dropzone": "^14.3.5",
    "axios": "^1.7.9",
    "lucide-react": "^latest"
  },
  "devDependencies": {
    "vite": "^7.2.4",
    "@vitejs/plugin-react": "^5.1.1"
  }
}
```

---

## 🚀 Deployment

### Development

```bash
npm install
npm run dev
# App running on http://localhost:5173
```

### Production Build

```bash
npm run build
# Output: dist/
```

### Deploy a AWS (Amplify/S3+CloudFront)

```bash
# Opción 1: AWS Amplify
amplify init
amplify add hosting
amplify publish

# Opción 2: S3 + CloudFront
npm run build
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## 📝 Notas Importantes

### Ventajas de la Arquitectura Modular

✅ **Escalabilidad**: Fácil agregar nuevas screens o componentes  
✅ **Mantenibilidad**: Archivos pequeños y enfocados  
✅ **Reutilización**: Componentes compartidos entre screens  
✅ **Testabilidad**: Cada pieza puede testearse independientemente  
✅ **Claridad**: Estructura clara y lógica  

### Limitaciones Actuales

⚠️ **No hay autenticación**: Cualquiera puede usar la app  
⚠️ **No hay base de datos**: Historial solo en localStorage  
⚠️ **No hay tests**: Pruebas solo manuales  
⚠️ **No hay CI/CD**: Deployment manual  

### Mejoras Futuras Sugeridas

1. **Autenticación**: AWS Cognito para usuarios
2. **Database**: DynamoDB para historial persistente
3. **Tests**: Jest + React Testing Library
4. **CI/CD**: GitHub Actions + AWS Amplify
5. **Monitoring**: CloudWatch + Sentry
6. **Multi-región**: S3 en múltiples regiones

---

## 🆘 Troubleshooting

### Error: CORS en API Gateway
**Solución**: Habilitar CORS en API Gateway para POST requests

### Error: Presigned URL expirado
**Solución**: URLs expiran en 5 min, regenerar si es necesario

### Error: Rekognition no detecta nada
**Solución**: Verificar threshold y tipos de detección habilitados

### Screen 3/4 aparecen vacías
**Solución**: Ya resuelto - ahora muestran datos de demostración

---

**Última actualización**: 2025-12-22  
**Versión**: 2.0.0 (Arquitectura Modular)
