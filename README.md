# Factum AI

Sistema de moderación de contenido multimedia mediante inteligencia artificial. Utiliza Amazon Rekognition para clasificar imágenes en tres niveles de seguridad.

---

## Instalación

### Requisitos Previos

- Node.js 18 o superior
- npm 9 o superior  
- Cuenta AWS con acceso a S3, Lambda, API Gateway y Rekognition
- AWS CLI configurado (opcional)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/T0NY24/Factum-AI.git
cd Factum-AI
```

### Paso 2: Instalar Dependencias del Frontend

```bash
cd factum-app
npm install
```

Librerías instaladas automáticamente:

| Librería | Versión | Función |
|----------|---------|---------|
| react | 19.x | Framework de UI |
| vite | 6.x | Build tool y dev server |
| axios | 1.x | Cliente HTTP |
| lucide-react | 0.x | Iconos |
| react-dropzone | 14.x | Drag and drop de archivos |
| @aws-sdk/client-s3 | 3.x | SDK de AWS para S3 |
| @aws-sdk/s3-request-presigner | 3.x | Generador de URLs prefirmadas |

### Paso 3: Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editar el archivo `.env`:

```env
VITE_API_GATEWAY_URL=https://tu-api-id.execute-api.us-east-1.amazonaws.com/prod
VITE_AWS_REGION=us-east-1
VITE_S3_BUCKET_NAME=nombre-del-bucket
```

### Paso 4: Instalar Dependencias del Backend (Lambda)

```bash
# Lambda: Generador de URL Prefirmada
cd lambda/get-presigned-url
npm install
```

Librerías de get-presigned-url:

| Librería | Función |
|----------|---------|
| @aws-sdk/client-s3 | Conexión con S3 |
| @aws-sdk/s3-request-presigner | Generar URLs temporales |

```bash
# Lambda: Moderación de Imágenes
cd ../moderate-image
npm install
```

Librerías de moderate-image:

| Librería | Función |
|----------|---------|
| @aws-sdk/client-rekognition | Análisis de contenido |
| @aws-sdk/client-s3 | Mover archivos entre carpetas |

### Paso 5: Desplegar en AWS

Empaquetar cada función Lambda:

```bash
# En lambda/get-presigned-url
zip -r function.zip .

# En lambda/moderate-image  
zip -r function.zip .
```

Subir los archivos `.zip` a AWS Lambda. Configurar variable de entorno:
- `S3_BUCKET_NAME`: nombre del bucket S3

---

## Ejecución

### Desarrollo Local

```bash
cd factum-app
npm run dev
```

Acceder a `http://localhost:5173`

### Producción

```bash
cd factum-app
npm run build
npm run preview
```

Los archivos de producción se generan en `dist/`

---

## Funcionamiento

### Flujo de Análisis

1. El usuario carga una imagen
2. El frontend solicita una URL prefirmada a Lambda
3. La imagen se sube directamente a S3
4. Lambda invoca Amazon Rekognition para analizar el contenido
5. El sistema clasifica la imagen según las etiquetas detectadas
6. El usuario recibe el resultado con el nivel de riesgo

### Pantallas de Resultado

| Nivel | Pantalla | Acción |
|-------|----------|--------|
| Seguro | Verde | Aprobación automática |
| Sugestivo | Amarillo | Requiere revisión humana |
| Inseguro | Rojo | Bloqueo automático |

---

## Clasificación de Contenido

El sistema utiliza la taxonomía oficial de Amazon Rekognition para categorizar el contenido en dos grupos principales.

### Contenido Inseguro (Bloqueo Automático)

Contenido que requiere bloqueo inmediato sin intervención humana.

| Categoría | Descripción |
|-----------|-------------|
| Hate Symbols | Símbolos de odio, contenido nazi, supremacista |
| Explicit Nudity | Desnudez explícita |
| Violence | Violencia física, armas en uso |
| Visually Disturbing | Gore, accidentes gráficos, mutilaciones |
| Sexual Activity | Actividad sexual explícita |
| Graphic Male Nudity | Desnudez masculina gráfica |
| Graphic Female Nudity | Desnudez femenina gráfica |
| Illustrated Explicit Nudity | Desnudez explícita ilustrada |
| Adult Toys | Juguetes para adultos |

### Contenido Sugestivo (Revisión Humana)

Contenido que requiere evaluación por un moderador antes de tomar acción.

| Categoría | Descripción |
|-----------|-------------|
| Suggestive | Contenido sexualmente sugestivo |
| Revealing Clothes | Ropa reveladora, escotes pronunciados |
| Swimwear or Underwear | Trajes de baño, ropa interior |
| Female Swimwear or Underwear | Bikinis, lencería femenina |
| Non-Explicit Nudity | Desnudez no explícita |
| Partial Nudity | Desnudez parcial |
| Tobacco | Productos de tabaco |
| Alcohol | Bebidas alcohólicas |
| Drugs | Sustancias controladas |
| Gambling | Contenido de apuestas |

---

## Arquitectura

```
Usuario (React)
    |
    v
API Gateway --> Lambda: Presigned URL --> S3
    |
    v
API Gateway --> Lambda: Moderate --> Rekognition
    |
    v
Resultado (safe / suggestive / unsafe)
```

### Componentes AWS

| Servicio | Función |
|----------|---------|
| S3 | Almacenamiento temporal de imágenes |
| Lambda | Procesamiento serverless |
| API Gateway | Endpoints REST |
| Rekognition | Análisis de contenido |
| IAM | Control de acceso |

---

## Estructura del Proyecto

```
Factum-AI/
├── factum-app/           # Aplicación React
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── screens/      # Pantallas de la aplicación
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # Llamadas a API
│   │   └── utils/        # Utilidades
│   └── .env
│
├── lambda/               # Funciones AWS Lambda
│   ├── get-presigned-url/
│   └── moderate-image/
│
└── docs/                 # Documentación
    ├── AWS_SETUP.md
    └── DEPLOYMENT.md
```

---

## Seguridad

- URLs prefirmadas con expiración de 5 minutos
- Validación de tipos de archivo en cliente y servidor
- Límite de tamaño de archivo: 10MB
- Políticas IAM de mínimo privilegio
- CORS configurado para dominios específicos

---

## Costos Estimados

Para 10,000 imágenes mensuales:

| Servicio | Costo |
|----------|-------|
| S3 | $0.50 - $2.00 |
| Lambda | $1.00 - $3.00 |
| API Gateway | $3.50 |
| Rekognition | $10.00 |
| Total | $15 - $20/mes |

Los primeros 12 meses incluyen nivel gratuito.

---

## Solución de Problemas

| Error | Solución |
|-------|----------|
| CORS policy | Verificar configuración CORS en S3 y API Gateway |
| Access Denied | Revisar permisos IAM de Lambda |
| Timeout | Aumentar memoria y timeout de Lambda |

Consultar `docs/AWS_SETUP.md` para configuración detallada.

---
