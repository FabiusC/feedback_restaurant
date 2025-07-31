# API de Feedback de Restaurante

Una API RESTful construida con TypeScript y Node.js para gestionar el sistema de feedback y reviews de un restaurante, siguiendo una arquitectura de capas bien definida.

## 🏗️ Arquitectura

La aplicación sigue una arquitectura de capas basada en el diagrama UML proporcionado:

### Capas de la Arquitectura

1. **Domain Entities** - Entidades del dominio de negocio

   - `Employee` - Empleado del restaurante
   - `Review` - Review/feedback de un cliente
   - `Report` - Reporte de análisis

2. **Data Transfer Objects (DTOs)** - Objetos de transferencia de datos

   - `ReviewDTO` - Para transferir datos de reviews
   - `EmployeeStatsDTO` - Para estadísticas de empleados

3. **Data Access Layer** - Capa de acceso a datos

   - `EmployeeRepository` - Operaciones CRUD para empleados
   - `ReviewRepository` - Operaciones CRUD para reviews
   - `DatabaseConnection` - Conexión a PostgreSQL

4. **Service Layer** - Capa de servicios de negocio
   - `FeedbackService` - Lógica de negocio para feedback
   - `AnalyticsService` - Lógica de negocio para análisis

## 🚀 Características

- ✅ Arquitectura de capas bien definida
- ✅ TypeScript para tipado estático
- ✅ PostgreSQL como base de datos
- ✅ Validación de datos
- ✅ Manejo de errores robusto
- ✅ Logging de requests
- ✅ Documentación automática de API
- ✅ Health checks
- ✅ CORS habilitado
- ✅ Seguridad con Helmet

## 📋 User Stories Implementadas

### Funcionalidades de Calificación

- ✅ Rate Speed Service from 1 to 5 stars
- ✅ Rate the level of Satisfaction with Food from 1 to 5 stars
- ✅ Select Employee to Rate (opcional)
- ✅ Rate Employee Attitude from 1 to 5 stars (cuando se selecciona empleado)

### Funcionalidades de Comentarios

- ✅ Leave a comment about our service (máximo 500 caracteres)
- ✅ Read Customer Comments
- ✅ Sort or filter comments by date
- ✅ Sort or filter reviews by date

### Funcionalidades de Análisis

- ✅ View Average Ratings per Category
- ✅ Press "Submit" Button

### Validaciones de Negocio

- ✅ Si se selecciona un empleado, se debe calificar al empleado
- ✅ Si no se selecciona empleado, no se puede calificar al empleado
- ✅ Comentarios públicos no pueden estar vacíos
- ✅ Límite de 500 caracteres en comentarios

## 📋 Prerrequisitos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd reviews-api
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp env.example .env
   ```

   Editar el archivo `.env` con tus configuraciones:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=feedback_restaurant
   DB_USER=postgres
   DB_PASSWORD=server
   PORT=3000
   NODE_ENV=development
   ```

4. **Crear la base de datos**

   ```sql
   CREATE DATABASE feedback_restaurant;
   ```

5. **Compilar TypeScript**

   ```bash
   npm run build
   ```

6. **Ejecutar la aplicación**

   ```bash
   # Desarrollo
   npm run dev

   # Producción
   npm start
   ```

## 📚 Endpoints de la API

### Health Check

- `GET /health` - Verificar estado del servidor

### Feedback

- `POST /api/feedback/reviews` - Enviar una nueva review
- `GET /api/feedback/reviews/public` - Obtener reviews públicas
- `GET /api/feedback/reviews/:id` - Obtener una review específica
- `PUT /api/feedback/reviews/:id/approve` - Aprobar una review
- `PUT /api/feedback/reviews/:id/reject` - Rechazar una review
- `DELETE /api/feedback/reviews/:id` - Eliminar una review

### Analytics

- `GET /api/analytics/ratings` - Obtener promedios de calificaciones
- `GET /api/analytics/employees/:id/performance` - Rendimiento de un empleado
- `GET /api/analytics/employees/performance` - Rendimiento de todos los empleados
- `GET /api/analytics/employees/top-performers` - Mejores empleados
- `GET /api/analytics/reports/monthly` - Generar reporte mensual
- `POST /api/analytics/reports/custom` - Generar reporte personalizado
- `GET /api/analytics/trends` - Obtener tendencias de rendimiento

## 📝 Ejemplos de Uso

### Enviar una Review

```bash
curl -X POST http://localhost:3000/api/feedback/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "ratespeedservice": 4,
    "ratesatisfactionfood": 5,
    "idemployee": 1,
    "rateemployee": 4,
    "comment": "Excelente servicio y comida deliciosa",
    "ispublic": true
  }'
```

**Nota:** También se aceptan los nombres de campos anteriores para compatibilidad:

```bash
curl -X POST http://localhost:3000/api/feedback/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "speedRating": 4,
    "foodRating": 5,
    "idEmployeeSelected": 1,
    "employeeRating": 4,
    "comment": "Excelente servicio y comida deliciosa",
    "isPublic": true
  }'
```

### Obtener Reviews Públicas

```bash
curl http://localhost:3000/api/feedback/reviews/public?sortBy=rating
```

### Obtener Promedios de Calificaciones

```bash
curl http://localhost:3000/api/analytics/ratings
```

### Generar Reporte Mensual

```bash
curl http://localhost:3000/api/analytics/reports/monthly
```

## 🧪 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo con hot reload
- `npm run build` - Compilar TypeScript
- `npm start` - Ejecutar en modo producción
- `npm test` - Ejecutar tests
- `npm run lint` - Verificar código con ESLint
- `npm run lint:fix` - Corregir errores de ESLint automáticamente

## 🗄️ Estructura de la Base de Datos

### Tabla: employee

- `idemployee` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(35) NOT NULL)
- `email` (VARCHAR(255) CHECK regex)
- `isactive` (BOOLEAN DEFAULT true)
- `createdat` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

### Tabla: review

- `idreview` (SERIAL PRIMARY KEY)
- `idemployee` (INTEGER REFERENCES employee(idemployee) ON DELETE SET NULL)
- `date` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
- `ratespeedservice` (SMALLINT NOT NULL CHECK 1-5)
- `ratesatisfactionfood` (SMALLINT NOT NULL CHECK 1-5)
- `rateemployee` (SMALLINT CHECK 1-5)
- `comment` (VARCHAR(500))
- `ispublic` (BOOLEAN DEFAULT false)

**Restricciones:**

- Si `idemployee` es NULL, `rateemployee` debe ser NULL
- Si `idemployee` no es NULL, `rateemployee` debe tener un valor entre 1-5

## 🔧 Configuración de Desarrollo

### Variables de Entorno

- `DB_HOST` - Host de PostgreSQL
- `DB_PORT` - Puerto de PostgreSQL
- `DB_NAME` - Nombre de la base de datos
- `DB_USER` - Usuario de PostgreSQL
- `DB_PASSWORD` - Contraseña de PostgreSQL
- `PORT` - Puerto del servidor
- `NODE_ENV` - Entorno (development/production)

### Estructura del Proyecto

```
src/
├── controllers/          # Controladores HTTP
├── data/                # Capa de acceso a datos
│   ├── database/        # Configuración de base de datos
│   └── repositories/    # Repositorios
├── domain/              # Entidades del dominio
│   └── entities/        # Entidades de negocio
├── dto/                 # Data Transfer Objects
├── routes/              # Definición de rutas
├── services/            # Capa de servicios
└── index.ts            # Punto de entrada
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
