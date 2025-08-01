# Módulo de Pruebas Unitarias

Este módulo contiene las pruebas unitarias y de integración para la API de Feedback de Restaurante.

## Estructura del Módulo

```
src/__tests__/
├── setup.ts                    # Configuración global de Jest
├── services/                   # Pruebas de servicios
│   ├── FeedbackService.test.ts
│   └── AnalyticsService.test.ts
├── entities/                   # Pruebas de entidades
│   └── Review.test.ts
├── dto/                        # Pruebas de DTOs
│   └── ReviewDTO.test.ts
├── controllers/                # Pruebas de controladores
│   └── FeedbackController.test.ts
├── integration/                # Pruebas de integración
│   └── feedback.test.ts
└── README.md                   # Esta documentación
```

## Configuración

### Jest Configuration
- **Preset**: `ts-jest` para soporte de TypeScript
- **Environment**: `node` para pruebas del lado del servidor
- **Coverage**: Genera reportes de cobertura en formato texto, lcov y HTML
- **Timeout**: 10 segundos por prueba
- **Setup**: Archivo `setup.ts` para configuración global

### Variables de Entorno
Las pruebas utilizan un archivo `.env.test` separado para evitar conflictos con la configuración de desarrollo.

## Tipos de Pruebas

### 1. Pruebas Unitarias

#### Servicios (`services/`)
- **FeedbackService**: Prueba la lógica de negocio para envío de reviews
- **AnalyticsService**: Prueba la lógica de análisis de empleados

#### Entidades (`entities/`)
- **Review**: Prueba la validación y comportamiento de la entidad Review

#### DTOs (`dto/`)
- **ReviewDTO**: Prueba la validación y transformación de datos

#### Controladores (`controllers/`)
- **FeedbackController**: Prueba el manejo de requests HTTP y responses

### 2. Pruebas de Integración (`integration/`)
- **feedback.test.ts**: Prueba el flujo completo de la API usando supertest

## Comandos de Prueba

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar solo pruebas de integración
npm run test:integration

# Ejecutar solo pruebas unitarias
npm run test:unit
```

## Patrones de Prueba

### Estructura AAA (Arrange-Act-Assert)
```typescript
describe('Feature', () => {
  it('should do something', async () => {
    // Arrange - Preparar datos y mocks
    const mockData = { ... };
    jest.spyOn(mockService, 'method').mockResolvedValue(mockData);

    // Act - Ejecutar la acción
    const result = await service.method();

    // Assert - Verificar resultados
    expect(result).toEqual(expectedValue);
    expect(mockService.method).toHaveBeenCalledTimes(1);
  });
});
```

### Mocks
- **Repositorios**: Se mockean para evitar dependencias de base de datos
- **Servicios**: Se mockean en pruebas de controladores
- **Express**: Se mockean Request y Response para pruebas de controladores

### Casos de Prueba Cubiertos

#### FeedbackService
- ✅ Envío exitoso de review
- ✅ Validación de DTO fallida
- ✅ Empleado no encontrado
- ✅ Empleado inactivo
- ✅ Errores de base de datos
- ✅ Review sin empleado

#### AnalyticsService
- ✅ Obtención exitosa de estadísticas
- ✅ Empleado no encontrado
- ✅ Errores de base de datos
- ✅ Estadísticas vacías

#### Review Entity
- ✅ Creación con datos válidos
- ✅ Cálculo de rating promedio
- ✅ Validación de datos
- ✅ Casos edge (valores mínimos/máximos)

#### ReviewDTO
- ✅ Validación completa de campos
- ✅ Manejo de campos opcionales
- ✅ Validación de rangos
- ✅ Validación de longitud de comentarios

#### FeedbackController
- ✅ Respuestas HTTP correctas
- ✅ Manejo de errores
- ✅ Validación de entrada
- ✅ Códigos de estado apropiados

#### Integración
- ✅ Flujo completo de API
- ✅ Manejo de errores HTTP
- ✅ Validación de respuestas JSON
- ✅ Casos de error de red

## Cobertura de Código

El módulo está diseñado para lograr una alta cobertura de código:
- **Líneas**: >90%
- **Funciones**: >95%
- **Ramas**: >85%

## Mejores Prácticas

1. **Aislamiento**: Cada prueba es independiente
2. **Mocks**: Uso extensivo de mocks para dependencias externas
3. **Nombres descriptivos**: Los nombres de las pruebas describen el comportamiento
4. **Organización**: Pruebas organizadas por funcionalidad
5. **Documentación**: Comentarios explicativos en pruebas complejas

## Troubleshooting

### Problemas Comunes

1. **Mocks no funcionan**: Verificar que los mocks estén configurados antes de cada prueba
2. **Timeouts**: Aumentar el timeout en `jest.config.js` si es necesario
3. **Variables de entorno**: Verificar que `.env.test` esté configurado correctamente

### Debugging

```bash
# Ejecutar una prueba específica
npm test -- --testNamePattern="should successfully submit a review"

# Ejecutar con logs detallados
npm test -- --verbose

# Ejecutar una sola prueba con debug
npm test -- --testNamePattern="specific test" --verbose
``` 