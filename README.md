# Factum AI

Sistema de moderación de contenido multimedia con inteligencia artificial usando Amazon Rekognition.

![Factum AI Banner](docs/images/banner.png)

---

## 📋 Requisitos

- **Node.js** 18 o superior
- **npm** 9 o superior  
- **Cuenta AWS** con acceso a S3, Lambda, API Gateway y Rekognition

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/T0NY24/Factum-AI.git
cd Factum-AI
```

### 2. Instalar dependencias del Frontend

```bash
cd factum-app
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la carpeta `factum-app/`:

```env
# URL de tu API Gateway (sin barra al final)
VITE_API_GATEWAY_URL=https://tu-api-id.execute-api.us-east-2.amazonaws.com/prod

# Región de AWS
VITE_AWS_REGION=us-east-2

# Nombre de tu bucket S3
VITE_S3_BUCKET_NAME=nombre-de-tu-bucket
```

> ⚠️ **Importante**: Debes configurar los servicios de AWS antes de usar la aplicación. Consulta [docs/AWS_SETUP.md](docs/AWS_SETUP.md) para instrucciones detalladas.

### 4. Instalar dependencias del Backend (Lambda)

```bash
# Lambda: Generador de URL Prefirmada
cd lambda/get-presigned-url
npm install

# Lambda: Moderación de Imágenes
cd ../moderate-image
npm install
```

---

## ▶️ Ejecución

```bash
cd factum-app
npm run dev
```

Acceder a `http://localhost:5173`

---

## 📸 Capturas de Pantalla

| Upload | Procesando | Resultado Seguro |
|--------|------------|------------------|
| ![Upload](docs/images/1.png) | 

| Resultado Inseguro | Resultado Sugestivo | Historial |
|--------------------|---------------------|-----------|
| ![History](docs/images/2.png) |

---

## 📁 Estructura del Proyecto

```
Factum-AI/
├── factum-app/           # Aplicación React (Frontend)
│   ├── src/
│   │   ├── screens/      # 7 pantallas de la aplicación
│   │   ├── components/   # Componentes reutilizables
│   │   ├── services/     # Servicios de API
│   │   └── hooks/        # Custom hooks
│   └── .env              # Variables de entorno
│
├── lambda/               # Funciones AWS Lambda (Backend)
│   ├── get-presigned-url/
│   └── moderate-image/
│
└── docs/                 # Documentación
    ├── AWS_SETUP.md      # Configuración de AWS
    └── DEPLOYMENT.md     # Guía de despliegue
```

---

## 📚 Documentación

- [AWS_SETUP.md](docs/AWS_SETUP.md) - Configuración completa de servicios AWS
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Guía de despliegue a producción
- [AGENTS.MD](factum-app/AGENTS.MD) - Documentación técnica detallada del proyecto

---

## 📄 Licencia

MIT License
