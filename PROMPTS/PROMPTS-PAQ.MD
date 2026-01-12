# PROMPTS - Registro de Prompts

Este archivo contiene el registro de todos los prompts ejecutados a partir de la creación de este archivo.

---

## Prompt 1 - 2026-01-11 18:56:08

te pido que generes el archivo test-e2e-paq.spec.ts en la carpeta test\e2e, y el archivo 

en este archivo te pido que generes un test que realice lo siguiente
vaya a la ubicación http://localhost:3000/
presione el botón "Añadir nuevo candidato"
esperar a que aparezca el botón "Enviar"
completa los campos nombre, apellido, correo electrónico, telefono, direccion, con los datos random obtenido de una lista de 20 elementos generado previamente por vos.
no ingreses archivo adjunto, educación ni experiencia laboral
presionar botón "enviar"
si se despliega el mensaje "Candidato añadido con éxito" escribir en el archivo de reporte que el proceso resultó exitoso, sino aclarar el error que hubo.
presionar la flecha del browse para volver a la pantalla inicial.
esperar a que aparezca el botón "Añadir nuevo candidato"
Grabar en el reporte "finalización del test"

Ahora te pido que en el mismo archivo test-e2e-paq.spec.ts generes este nuevo test
vaya a la ubicación http://localhost:3000/
presione el botón "Ir a posiciones"
esperar a que aparezca el elemento "busca por titulo"
de la lista de cartillas que se presentan, elegir uno en forma random.
recuerda qué cartilla elegiste.
presiona de esa cartilla, el botón "Ver Proceso"
Esperar a que aparezca el elemento "Ver Posiciones"
Fijarse si aparece alguna cartilla por lo menos en todas las columnas de la tabla presente
si no aparece ninguna cartilla, presionar "volver a posiciones", y esperar a que aparezca el botón "Busca por titulo"
busca la primer columna que contenga por lo menos una cartilla.
toma una cartilla al azar de esa columna, y muevela a la columna siguiente, si estás en la ultima columna, muevela a la primera
recordar el nombre del candidato y en qué columna quedó
Presionar el botón "Volver a posiciones"
esperar a que aparezca el elemento "busca por titulo"
presiona el botón "Ver Proceso" de la cartilla procesada anteriormente.
Esperar a que aparezca el elemento "Ver Posiciones"
corroborar que el elemento movido quedó en la columna movida anteriormente.
si es así, grabar en el reporte "testeo exitoso", caso contrario, graba "no se dio el resultado esperado"


Tener presente :
que se visualice el browser en todo momento.
ejecutalo en modo debug.
Usa selectores estables (ideal: data-testid, roles accesibles, texto visible).
Reutiliza lógica repetida con helpers y/o Page Objects cuando mejore la claridad.
Mantén pruebas reproducibles (estado controlado, datos consistentes, independencia entre tests).
Configura evidencias útiles para depuración cuando una prueba falle:a) Capturas de pantalla. b)Trazas (trace).

---

## Prompt 2 - 2026-01-11 19:00:00

For the code present, we get this error:
```
Type 'Locator' is not assignable to type 'null'.
```
Fix it, verify, and then give a concise explanation. @tests/e2e/test-e2e-paq.spec.ts:504-507  me solucionas este problema?

---

## Prompt 3 - 2026-01-11 19:05:00

```
Cannot use({ headless }) in a describe group, because it forces a new worker.
Make it top-level in the test file or put in the configuration file.
```
@pwsh (0-31) me solucionas este error por favor?

---

## Prompt 4 - 2026-01-11 19:10:00

y por qué no colocas el headless en el playwright.config.js?

---

## Prompt 5 - 2026-01-11 19:15:00

te pido que en este tercer test, en la url "http://localhost:3000/positions" también fuerces trabajar con la primer posicion. ya he probado el funcionamiento de trabajar con un puesto sin candidatos.

---

## Prompt 6 - 2026-01-11 19:20:00

en la url "http://localhost:3000/positions/1" sigues posicionandote en la primer columna. te pedí que operes directamente con la segunda columna.

# Test Programados

se realizaron dos ejercicios de test, del cual se desprendió un tercero a partir del segundo.

## Test 1 : Ingreso de nuevo candidato

Se probó ingresar a la url principal, seleccionar la tarea de incorporar un nuevo candidatos, cargar los datos de los candidatos seleccionados aleatoriamente de una lista generada previamente.
no se cargaron datos de estudios y tareas anteriores, por el error del formato de fecha, ya que quería hacer un testeo con validacion exitosa.

## Test 2 : Cambio de fase de una selección.

Se probó ingresar a la tarea de cambio de fases de una selección. aleatoriamente el testeo elegía una de las dos postulaciones. así se probó la que no tenía candidatos, y la que sí tenía.

## Test 3 : Cambio de fase de una selección, forzando la postulación con candidatos.

En virtud que la aleatoriedad generaba siempre la opción de la postulación vacía, se forzó que se ejecuté la primera postulación (con datos). así se pudo probar que se pueda cambiar de fase y corroborar el cambio, sin errores.

# Tareas realizadas

se procedió a realizar 5 ejecuciones de test. 
todos los resultados y archivos generados por cada test se encuentran en la carpeta playwright\integration

## TEST 1

Se probó la pantalla de ingresar un nuevo candidato, el cual finaliza con la vuelta a la pantalla inicial. se graba el estado satisfactorio o con error de los procesos, realizando una prueba satisfactoria

## TEST 2

Se probó el cambio de fases con el puesto donde no tiene candidatos, corroborando que se detecta que no existe ninguno, y se vuelve a la pantalla anterior

## TEST 3

Se ejecutó en forma automática tras solicitar hacer un nuevo test donde se fuerce trabajar con la posición que sí contiene candidatos. Ignoro su análisis

## TEST 4

se volvió a ejecutar el tercer testeo, el cual no estaba bien resuelto el requerimiento. También se ignora y se solicitó su corrección.

## TEST 5

Realización de un testeo satisfactorio, con el proceso de fase de intercambio, donde se mueve un candidato de una fase a otra, se retorna a la pantalla de postulaciones, y se retorna a la pantalla de fases, para verificar que el cambio quedó perfectamente grabado.

## TEST 6

Finalmente analicé el error de testing en la segunda tarea, le pedí al IDE que lo corrija y ahora ejecuta efectivamente los pasos, salteando a la fase que no tiene candidatos.

# Comentarios sobre el trabajo

## Análisis de resultados - COmplejidad de la tarea

por falta de capacitación sobre la herramienta playwright, me cuesta mucho entender los resultados y la ubicación de los mismos. observé que generó archivos en distintas carpetas, me faltó configurar mejor el archivo playwright.config.js para centralizarlos mejor. no supe cómo leer el reporte, tanto en md como en html. por suerte, la grabación de screens en los distintos pasos del proceso me ayudó a verificar la efectivad de la tarea y la aparición de errores de programción del testing

## Amigabilidad de la tarea

me costó entender la consigna, en cuanto a la formalización de la tarea (dónde dejar los archivos, cómo generar las instrucciónes para ustedes), por eso procuro escribir todo acá.
pero en cuanto al desarrollo del test, me resultó sencillo generarlos mediante prompts al IDE.

pude debuguear y analizar la segunda tarea para localizar el error que contenía, y poder pedirle a la IDE su resolución. 

## Tareas pendientes

Si bien estudié la herramienta y su codificación, me faltó tiempo para analizar el código generado por la IDE en profundidad, para poder generar mejor las correcciones necesarias.

Me quedó pendiente hacer el test de carga de candidatos con ingreso de estudios y trabajos anteriores, para que de el error de formato de fecha inválida.

