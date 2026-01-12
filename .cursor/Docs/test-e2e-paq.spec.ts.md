# Documentación: test-e2e-paq.spec.ts

## Descripción

Este archivo contiene tests end-to-end (E2E) para la aplicación de reclutamiento. Incluye dos tests principales:

1. **Test 1: Añadir nuevo candidato** - Verifica el flujo completo de creación de un candidato
2. **Test 2: Proceso de posiciones y movimiento de cartillas** - Verifica el flujo de gestión de posiciones y movimiento de candidatos entre columnas

## Ubicación

- **Archivo**: `tests/e2e/test-e2e-paq.spec.ts`
- **Carpeta**: `tests/e2e/`

## Características

### Configuración

- **Modo debug**: Los tests se ejecutan con `headless: false` para visualizar el navegador
- **Slow motion**: Acciones ralentizadas con `slowMo: 500ms` para mejor visualización
- **Capturas de pantalla**: Se toman automáticamente en cada paso importante
- **Trazas**: Configuradas para capturar en caso de fallo
- **Reporte**: Se genera un archivo de texto con el registro de cada acción

### Datos de prueba

- **Lista de candidatos**: 20 candidatos predefinidos con datos aleatorios
- **Selección aleatoria**: Cada test selecciona un candidato aleatorio de la lista

### Helpers y Page Objects

El archivo utiliza el patrón Page Object Model para mejorar la mantenibilidad:

- **DashboardPage**: Interacciones con la página principal
- **AddCandidatePage**: Interacciones con el formulario de candidato
- **PositionsPage**: Interacciones con la página de posiciones
- **PositionDetailsPage**: Interacciones con los detalles de posición

### Funciones helper

- `writeToReport()`: Escribe mensajes en el archivo de reporte
- `getRandomCandidate()`: Obtiene un candidato aleatorio de la lista
- `takeScreenshot()`: Toma capturas de pantalla en puntos clave

## Ejecución

### Modo debug (recomendado)

```bash
npm run test:debug tests/e2e/test-e2e-paq.spec.ts
```

### Modo UI (interfaz gráfica)

```bash
npm run test:ui
```

Luego selecciona el archivo `test-e2e-paq.spec.ts` desde la interfaz.

### Modo normal

```bash
npm test tests/e2e/test-e2e-paq.spec.ts
```

## Archivos generados

### Reporte de texto

- **Ubicación**: `tests/e2e/test-report-paq.txt`
- **Contenido**: Registro detallado de todas las acciones ejecutadas durante los tests

### Capturas de pantalla

- **Ubicación**: `test-results/screenshots/`
- **Formato**: `{nombre}-{timestamp}.png`
- **Contenido**: Capturas en cada paso importante del test

### Trazas

- **Ubicación**: `test-results/`
- **Formato**: Archivos `.zip` con trazas completas
- **Visualización**: Usar `npm run test:report` para ver el reporte HTML

## Requisitos previos

1. **Servidor frontend**: Debe estar ejecutándose en `http://localhost:3000`
2. **Servidor backend**: Debe estar ejecutándose en `http://localhost:3010`
3. **Base de datos**: Debe estar configurada y accesible

## Estructura de los tests

### Test 1: Añadir nuevo candidato

1. Navega a `http://localhost:3000/`
2. Presiona el botón "Añadir nuevo candidato"
3. Espera a que aparezca el botón "Enviar"
4. Completa los campos con datos aleatorios
5. Presiona el botón "Enviar"
6. Verifica el mensaje de éxito/error
7. Vuelve a la pantalla inicial
8. Verifica que el botón "Añadir nuevo candidato" está visible

### Test 2: Proceso de posiciones

1. Navega a `http://localhost:3000/`
2. Presiona el botón "Ir a posiciones"
3. Espera a que aparezca el elemento "busca por titulo"
4. Selecciona una cartilla aleatoria
5. Presiona "Ver Proceso"
6. Verifica las columnas y candidatos
7. Mueve un candidato a la columna siguiente
8. Vuelve a posiciones
9. Verifica que el candidato quedó en la columna correcta

## Selectores utilizados

El test utiliza selectores estables basados en:
- **Roles accesibles**: `getByRole('button', { name: /.../ })`
- **Labels**: `getByLabel('...')`
- **Textos visibles**: `getByText('...')`
- **Selectores CSS**: Para elementos específicos cuando es necesario

## Troubleshooting

### El test falla al encontrar elementos

- Verifica que el servidor frontend esté ejecutándose
- Revisa que los selectores coincidan con la estructura actual del DOM
- Usa las capturas de pantalla para ver el estado en el momento del fallo

### El drag and drop no funciona

- Verifica que `react-beautiful-dnd` esté correctamente configurado
- Aumenta el tiempo de espera después del drag and drop
- Revisa las coordenadas del elemento destino

### El reporte no se genera

- Verifica los permisos de escritura en la carpeta `tests/e2e/`
- Revisa que el archivo no esté bloqueado por otro proceso

## Mejoras futuras

- [ ] Agregar más datos de prueba
- [ ] Implementar retry automático para acciones críticas
- [ ] Mejorar la detección de columnas y candidatos
- [ ] Agregar validaciones adicionales
- [ ] Implementar tests de regresión visual



