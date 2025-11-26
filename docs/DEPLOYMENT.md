# Guía de Despliegue - Factum AI

Guía paso a paso para desplegar tu aplicación de moderación de contenido.

## 🚀 Despliegue del Backend (AWS)

### 1. Prerequisitos

```bash
# Instalar AWS CLI
# Windows (usando chocolatey):
choco install awscli

# Configurar credenciales
aws configure
```

Ingresa:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-east-1`
- Default output format: `json`

### 2. Desplegar Lambdas

#### Script automatizado (PowerShell):

Crea un archivo `deploy-lambdas.ps1` en la raíz del proyecto:

```powershell
# deploy-lambdas.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== Desplegando Funciones Lambda ===" -ForegroundColor Cyan

# Lambda 1: get-presigned-url
Write-Host "`nDesplegando get-presigned-url..." -ForegroundColor Yellow
Set-Location lambda\get-presigned-url
npm install --production
Compress-Archive -Path * -DestinationPath function.zip -Force

aws lambda update-function-code `
    --function-name factum-get-presigned-url `
    --zip-file fileb://function.zip `
    --region us-east-1

Remove-Item function.zip
Set-Location ..\..

# Lambda 2: moderate-image
Write-Host "`nDesplegando moderate-image..." -ForegroundColor Yellow
Set-Location lambda\moderate-image
npm install --production
Compress-Archive -Path * -DestinationPath function.zip -Force

aws lambda update-function-code `
    --function-name factum-moderate-image `
    --zip-file fileb://function.zip `
    --region us-east-1

Remove-Item function.zip
Set-Location ..\..

Write-Host "`n=== Despliegue Completado ===" -ForegroundColor Green
```

Ejecutar:

```powershell
.\deploy-lambdas.ps1
```

#### Método manual:

```bash
# Lambda 1
cd lambda/get-presigned-url
npm install --production
Compress-Archive -Path * -DestinationPath function.zip -Force
# Subir manualmente en la consola de AWS Lambda
cd ../..

# Lambda 2
cd lambda/moderate-image
npm install --production
Compress-Archive -Path * -DestinationPath function.zip -Force
# Subir manualmente en la consola de AWS Lambda
cd ../..
```

### 3. Verificar Despliegue

```bash
# Verificar Lambda 1
aws lambda get-function --function-name factum-get-presigned-url

# Verificar Lambda 2
aws lambda get-function --function-name factum-moderate-image

# Test Lambda 1
aws lambda invoke \
    --function-name factum-get-presigned-url \
    --payload '{"body":"{\"fileName\":\"test.jpg\",\"fileType\":\"image/jpeg\"}"}' \
    response.json

cat response.json
```

## 🌐 Despliegue del Frontend

### Opción 1: Vercel (Recomendado)

1. **Conectar repositorio**:
   ```bash
   # Instalar Vercel CLI
   npm install -g vercel
   
   # Desde factum-app/
   cd factum-app
   vercel
   ```

2. **Configurar variables de entorno** en Vercel Dashboard:
   - `VITE_API_GATEWAY_URL`
   - `VITE_AWS_REGION`
   - `VITE_S3_BUCKET_NAME`

3. **Desplegar**:
   ```bash
   vercel --prod
   ```

### Opción 2: Netlify

1. **Conectar repositorio** desde Netlify Dashboard

2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `factum-app`

3. **Variables de entorno**: Agregar en Netlify Dashboard

### Opción 3: AWS Amplify

```bash
# Instalar Amplify CLI
npm install -g @aws-amplify/cli

# Inicializar
cd factum-app
amplify init

# Configurar hosting
amplify add hosting

# Desplegar
amplify publish
```

### Opción 4: S3 + CloudFront (Hosting estático)

```bash
# Build de producción
cd factum-app
npm run build

# Crear bucket S3 para hosting
aws s3 mb s3://factum-app-frontend --region us-east-1

# Configurar como sitio web estático
aws s3 website s3://factum-app-frontend \
    --index-document index.html \
    --error-document index.html

# Subir archivos
aws s3 sync dist/ s3://factum-app-frontend --acl public-read

# Crear distribución CloudFront (opcional, para HTTPS)
```

## 🔒 Configuración de Producción

### Actualizar CORS en API Gateway

Una vez que tengas tu dominio de producción, actualiza CORS:

1. Ir a **API Gateway** → Tu API → **Resources**
2. Para cada recurso, click **Actions** → **Enable CORS**
3. En **Access-Control-Allow-Origin**, cambiar de `*` a tu dominio:
   ```
   https://tu-dominio.com
   ```

### Actualizar CORS en S3

Actualizar la configuración CORS del bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["PUT", "POST"],
        "AllowedOrigins": [
            "https://tu-dominio.com",
            "http://localhost:5173"
        ],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

### Variables de Entorno de Producción

Crear `.env.production`:

```env
VITE_API_GATEWAY_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
VITE_AWS_REGION=us-east-1
VITE_S3_BUCKET_NAME=factum-content-moderation
```

## 📊 Monitoreo Post-Despliegue

### CloudWatch Dashboards

Crear un dashboard personalizado:

```bash
aws cloudwatch put-dashboard \
    --dashboard-name FactumAI-Monitoring \
    --dashboard-body file://dashboard.json
```

### Alertas

Configurar alarmas para:

```bash
# Lambda errors
aws cloudwatch put-metric-alarm \
    --alarm-name factum-lambda-errors \
    --alarm-description "Lambda function errors" \
    --metric-name Errors \
    --namespace AWS/Lambda \
    --statistic Sum \
    --period 300 \
    --threshold 5 \
    --comparison-operator GreaterThanThreshold

# API Gateway 5xx errors
aws cloudwatch put-metric-alarm \
    --alarm-name factum-api-5xx-errors \
    --metric-name 5XXError \
    --namespace AWS/ApiGateway \
    --statistic Sum \
    --period 300 \
    --threshold 10 \
    --comparison-operator GreaterThanThreshold
```

## 🧪 Testing en Producción

### Test de extremo a extremo:

```javascript
// test-production.js
const axios = require('axios');

const API_URL = 'https://tu-api.execute-api.us-east-1.amazonaws.com/prod';

async function testProduction() {
  try {
    // 1. Get presigned URL
    const urlResponse = await axios.post(`${API_URL}/presigned-url`, {
      fileName: 'test.jpg',
      fileType: 'image/jpeg'
    });
    
    console.log('✅ Presigned URL generated:', urlResponse.data);

    // 2. Upload would happen here from frontend
    
    // 3. Test moderation
    const moderationResponse = await axios.post(`${API_URL}/moderate`, {
      imageKey: 'uploads/test-image.jpg'
    });
    
    console.log('✅ Moderation result:', moderationResponse.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testProduction();
```

## 🔄 CI/CD (Opcional)

### GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-lambda:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy Lambda 1
        run: |
          cd lambda/get-presigned-url
          npm install --production
          zip -r function.zip .
          aws lambda update-function-code \
            --function-name factum-get-presigned-url \
            --zip-file fileb://function.zip
      
      - name: Deploy Lambda 2
        run: |
          cd lambda/moderate-image
          npm install --production
          zip -r function.zip .
          aws lambda update-function-code \
            --function-name factum-moderate-image \
            --zip-file fileb://function.zip

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install and Build
        run: |
          cd factum-app
          npm install
          npm run build
        env:
          VITE_API_GATEWAY_URL: ${{ secrets.VITE_API_GATEWAY_URL }}
          VITE_AWS_REGION: ${{ secrets.VITE_AWS_REGION }}
          VITE_S3_BUCKET_NAME: ${{ secrets.VITE_S3_BUCKET_NAME }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: factum-app
```

## 📋 Checklist de Despliegue

- [ ] Backend configurado en AWS
  - [ ] Bucket S3 creado y configurado
  - [ ] Lambdas desplegadas y probadas
  - [ ] API Gateway configurado
  - [ ] CORS habilitado
  - [ ] Variables de entorno configuradas
  - [ ] Permisos IAM verificados
  
- [ ] Frontend desplegado
  - [ ] Build de producción funciona
  - [ ] Variables de entorno configuradas
  - [ ] Dominio configurado (opcional)
  - [ ] HTTPS habilitado
  
- [ ] Testing
  - [ ] Test de carga de imagen
  - [ ] Test de moderación
  - [ ] Test en múltiples navegadores
  - [ ] Test desde diferentes dispositivos
  
- [ ] Monitoreo
  - [ ] CloudWatch Logs configurados
  - [ ] Alarmas configuradas
  - [ ] Dashboard creado

## 🆘 Soporte

Si encuentras problemas durante el despliegue:

1. Revisa los logs de CloudWatch
2. Verifica la configuración de variables de entorno
3. Confirma que todos los servicios de AWS estén en la misma región
4. Revisa la documentación de AWS para tu servicio específico

---

¡Listo! Tu aplicación está en producción 🎉
