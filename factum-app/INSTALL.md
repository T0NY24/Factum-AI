# 📦 Guía de Instalación Completa - Factum AI

Esta guía te ayudará a instalar y configurar el proyecto Factum AI desde cero.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js** versión 18.0.0 o superior → [Descargar Node.js](https://nodejs.org/)
- ✅ **npm** versión 9.0.0 o superior (incluido con Node.js)
- ✅ **Git** → [Descargar Git](https://git-scm.com/)
- ✅ **Cuenta AWS** activa → [Crear cuenta AWS](https://aws.amazon.com/)

### Verificar instalación:

```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 9.x.x o superior
git --version     # Debe mostrar git version 2.x.x
```

---

## 🚀 Instalación Paso a Paso

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/T0NY24/Factum-AI.git
cd Factum-AI
```

### 2️⃣ Instalar Dependencias del Frontend

```bash
cd factum-app
npm install
```

**Paquetes que se instalarán automáticamente:**

#### Dependencias de Producción:
- `@aws-sdk/client-s3` (^3.699.0)
- `@aws-sdk/s3-request-presigner` (^3.699.0)
- `axios` (^1.7.9)
- `baseline-browser-mapping` (^2.9.19)
- `framer-motion` (^12.31.0)
- `lucide-react` (^0.562.0)
- `react` (^19.2.0)
- `react-dom` (^19.2.0)
- `react-dropzone` (^14.3.5)
- `sonner` (^2.0.7)
- `use-scramble` (^2.2.15)

#### Dependencias de Desarrollo:
- `@eslint/js` (^9.39.1)
- `@types/react` (^19.2.5)
- `@types/react-dom` (^19.2.3)
- `@vitejs/plugin-react` (^5.1.1)
- `eslint` (^9.39.1)
- `eslint-plugin-react-hooks` (^7.0.1)
- `eslint-plugin-react-refresh` (^0.4.24)
- `globals` (^16.5.0)
- `vite` (^7.2.4)

### 3️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `factum-app/`:

```bash
# En Windows (PowerShell)
New-Item .env

# En macOS/Linux
touch .env
```

**Edita el archivo `.env` y agrega:**

```env
# URL de tu API Gateway (sin barra al final)
VITE_API_GATEWAY_URL=https://sjrqtfqq3k.execute-api.us-east-2.amazonaws.com/prod

# Región de AWS
VITE_AWS_REGION=us-east-2

# Nombre de tu bucket S3
VITE_S3_BUCKET_NAME=factum-content-moderation
```

> **⚠️ Importante**: Si vas a usar tus propios servicios AWS, reemplaza estos valores con los tuyos propios.

### 4️⃣ Instalar Dependencias de Lambda (Backend)

#### Lambda 1: get-presigned-url

```bash
cd ../lambda/get-presigned-url
npm install
```

**Paquetes instalados:**
- `@aws-sdk/client-s3` (^3.x)
- `@aws-sdk/s3-request-presigner` (^3.x)

#### Lambda 2: moderate-image

```bash
cd ../moderate-image
npm install
```

**Paquetes instalados:**
- `@aws-sdk/client-rekognition` (^3.x)

---

## ✅ Verificar Instalación

### Verificar Frontend

```bash
cd factum-app
npm run dev
```

Deberías ver:

```
  VITE v7.2.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abre tu navegador en `http://localhost:5173` y verifica que la aplicación carga correctamente.

### Otros comandos disponibles:

```bash
npm run build    # Compilar para producción
npm run preview  # Previsualizar build de producción
npm run lint     # Ejecutar linter
```

---

## 🔧 Configuración de AWS (Opcional)

Si necesitas configurar tus propios servicios AWS, sigue estos pasos:

### 1. Crear Bucket S3

```bash
# En AWS Console:
# S3 → Create bucket → Nombre: "tu-bucket-name"
# Región: us-east-2 (Ohio)
```

### 2. Configurar API Gateway

```bash
# En AWS Console:
# API Gateway → Create API → REST API
# Create Resource: /presigned-url
# Create Resource: /moderate
# Deploy API → Stage: prod
```

### 3. Desplegar Funciones Lambda

#### Para get-presigned-url:

```bash
cd lambda/get-presigned-url
zip -r function.zip .
# Subir function.zip a AWS Lambda Console
```

#### Para moderate-image:

```bash
cd lambda/moderate-image
zip -r function.zip .
# Subir function.zip a AWS Lambda Console
```

### 4. Configurar Variables de Entorno en Lambda

Para **ambas funciones Lambda**, agrega estas variables:

| Variable | Valor |
|----------|-------|
| `S3_BUCKET_NAME` | `tu-bucket-name` |
| `AWS_REGION` | `us-east-2` |

---

## 🌐 Despliegue en Vercel (Producción)

### Opción 1: Deploy Manual

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desde la carpeta factum-app
cd factum-app
vercel

# Seguir las instrucciones en pantalla
```

### Opción 2: Deploy desde GitHub

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno:
   - `VITE_API_GATEWAY_URL`
   - `VITE_AWS_REGION`
   - `VITE_S3_BUCKET_NAME`
3. Deploy automático en cada push a `main`

---

## 📚 Documentación Adicional

- **[README.md](../README.md)** - Guía de inicio rápido
- **[AGENTS.MD](AGENTS.MD)** - Documentación técnica completa
- **[SETUP.md](SETUP.md)** - Configuración rápida
- **[docs/AWS_SETUP.md](../docs/AWS_SETUP.md)** - Configuración de AWS
- **[docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)** - Guía de despliegue

---

## ❓ Solución de Problemas

### Error: "Cannot find module..."

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "CORS policy"

Verifica que tu API Gateway tenga CORS habilitado para los endpoints `/presigned-url` y `/moderate`.

### Error: "Access Denied en S3"

Verifica que las funciones Lambda tengan los permisos IAM correctos:
- `s3:PutObject` para get-presigned-url
- `s3:GetObject` para moderate-image

### Puerto 5173 en uso

```bash
# Usar otro puerto
npm run dev -- --port 3000
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la [documentación completa](AGENTS.MD)
2. Verifica los logs en AWS CloudWatch (para Lambdas)
3. Revisa la consola del navegador (F12)

---

## ✨ URLs del Proyecto

- **Producción**: [https://factum-ia.com](https://factum-ia.com)
- **Repositorio**: [https://github.com/T0NY24/Factum-AI](https://github.com/T0NY24/Factum-AI)
- **API Gateway**: `https://sjrqtfqq3k.execute-api.us-east-2.amazonaws.com/prod`

---

**Última actualización**: 2026-02-05  
**Versión**: 4.0.0
