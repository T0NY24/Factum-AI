# ⚙️ Configuración Rápida

## ✅ Ya Configurado

- **Región AWS**: us-east-2 (Ohio)
- **API Gateway**: https://sjrqtfqq3k.execute-api.us-east-2.amazonaws.com/prod
- **Archivo .env**: Creado con tus credenciales

## 📝 Siguiente Paso: Actualizar Nombre del Bucket S3

Cuando crees tu bucket S3, actualiza el archivo `.env`:

```bash
# En factum-app/.env
VITE_S3_BUCKET_NAME=tu-nombre-de-bucket-real
```

También actualiza las variables de entorno en AWS Lambda:
1. Función `factum-get-presigned-url`:
   - `S3_BUCKET_NAME` = tu-nombre-de-bucket-real
   - `AWS_REGION` = us-east-2

2. Función `factum-moderate-image`:
   - `S3_BUCKET_NAME` = tu-nombre-de-bucket-real
   - `AWS_REGION` = us-east-2

## 🚀 Probar Localmente

```bash
cd factum-app
npm run dev
```

Abre http://localhost:5173

## 📚 Documentación Completa

Ver:
- [docs/AWS_SETUP.md](../docs/AWS_SETUP.md) - Configuración de AWS
- [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) - Despliegue
- [README.md](../README.md) - Documentación general

## ✨ URLs de tus Endpoints

- **Presigned URL**: POST https://sjrqtfqq3k.execute-api.us-east-2.amazonaws.com/prod/presigned-url
- **Moderation**: POST https://sjrqtfqq3k.execute-api.us-east-2.amazonaws.com/prod/moderate
