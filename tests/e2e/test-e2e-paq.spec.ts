import { test, expect, Page, Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Configuración para modo debug y visualización del browser
const testConfig = {
  headless: false,
  slowMo: 500, // Ralentiza las acciones para mejor visualización
};

// Lista de 20 datos random para candidatos
const candidateData = [
  { firstName: 'María', lastName: 'González', email: 'maria.gonzalez@email.com', phone: '600123456', address: 'Calle Mayor 1, Madrid' },
  { firstName: 'Juan', lastName: 'Pérez', email: 'juan.perez@email.com', phone: '600234567', address: 'Avenida Libertad 25, Barcelona' },
  { firstName: 'Ana', lastName: 'Martínez', email: 'ana.martinez@email.com', phone: '600345678', address: 'Plaza España 10, Sevilla' },
  { firstName: 'Carlos', lastName: 'López', email: 'carlos.lopez@email.com', phone: '600456789', address: 'Calle Sol 5, Valencia' },
  { firstName: 'Laura', lastName: 'Sánchez', email: 'laura.sanchez@email.com', phone: '600567890', address: 'Avenida Principal 15, Bilbao' },
  { firstName: 'Pedro', lastName: 'Rodríguez', email: 'pedro.rodriguez@email.com', phone: '600678901', address: 'Calle Nueva 8, Zaragoza' },
  { firstName: 'Carmen', lastName: 'Fernández', email: 'carmen.fernandez@email.com', phone: '600789012', address: 'Plaza Mayor 12, Málaga' },
  { firstName: 'Miguel', lastName: 'García', email: 'miguel.garcia@email.com', phone: '600890123', address: 'Avenida Central 20, Murcia' },
  { firstName: 'Isabel', lastName: 'Torres', email: 'isabel.torres@email.com', phone: '600901234', address: 'Calle Real 3, Palma' },
  { firstName: 'Francisco', lastName: 'Ruiz', email: 'francisco.ruiz@email.com', phone: '601012345', address: 'Avenida del Mar 7, Las Palmas' },
  { firstName: 'Elena', lastName: 'Díaz', email: 'elena.diaz@email.com', phone: '601123456', address: 'Calle del Sol 14, Córdoba' },
  { firstName: 'Antonio', lastName: 'Moreno', email: 'antonio.moreno@email.com', phone: '601234567', address: 'Plaza de la Paz 9, Vigo' },
  { firstName: 'Sofía', lastName: 'Jiménez', email: 'sofia.jimenez@email.com', phone: '601345678', address: 'Avenida de la Constitución 18, Gijón' },
  { firstName: 'Javier', lastName: 'Muñoz', email: 'javier.munoz@email.com', phone: '601456789', address: 'Calle de la Victoria 6, Vitoria' },
  { firstName: 'Patricia', lastName: 'Álvarez', email: 'patricia.alvarez@email.com', phone: '601567890', address: 'Plaza del Ayuntamiento 11, Granada' },
  { firstName: 'Roberto', lastName: 'Romero', email: 'roberto.romero@email.com', phone: '601678901', address: 'Avenida de la República 22, Elche' },
  { firstName: 'Marta', lastName: 'Navarro', email: 'marta.navarro@email.com', phone: '601789012', address: 'Calle de la Iglesia 4, Santa Cruz' },
  { firstName: 'David', lastName: 'Molina', email: 'david.molina@email.com', phone: '601890123', address: 'Avenida de los Reyes 16, Oviedo' },
  { firstName: 'Lucía', lastName: 'Ortega', email: 'lucia.ortega@email.com', phone: '601901234', address: 'Plaza de la Fuente 13, Santander' },
  { firstName: 'Daniel', lastName: 'Delgado', email: 'daniel.delgado@email.com', phone: '602012345', address: 'Calle de la Estación 19, Logroño' },
];

// Helper para escribir en el archivo de reporte
const reportPath = path.join(__dirname, 'test-report-paq.txt');

function writeToReport(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(reportPath, logMessage, 'utf8');
}

// Helper para obtener un candidato aleatorio
function getRandomCandidate() {
  return candidateData[Math.floor(Math.random() * candidateData.length)];
}

// Helper para tomar captura de pantalla
async function takeScreenshot(page: Page, name: string) {
  const screenshotsDir = path.join(__dirname, '../../test-results/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  const screenshotPath = path.join(screenshotsDir, `${name}-${Date.now()}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
}

// Page Object para el Dashboard
class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3000/');
    await this.page.waitForLoadState('networkidle');
  }

  async clickAddCandidate() {
    await this.page.getByRole('button', { name: /añadir nuevo candidato/i }).click();
  }

  async clickGoToPositions() {
    await this.page.getByRole('button', { name: /ir a posiciones/i }).click();
  }

  async waitForAddCandidateButton() {
    await this.page.waitForSelector('button:has-text("Añadir Nuevo Candidato")', { state: 'visible' });
  }
}

// Page Object para el formulario de candidato
class AddCandidatePage {
  constructor(private page: Page) {}

  async waitForSubmitButton() {
    await this.page.waitForSelector('button[type="submit"]', { state: 'visible' });
  }

  async fillCandidateForm(candidate: typeof candidateData[0]) {
    await this.page.getByLabel('Nombre').fill(candidate.firstName);
    await this.page.getByLabel('Apellido').fill(candidate.lastName);
    await this.page.getByLabel('Correo Electrónico').fill(candidate.email);
    await this.page.getByLabel('Teléfono').fill(candidate.phone);
    await this.page.getByLabel('Dirección').fill(candidate.address);
  }

  async submit() {
    await this.page.getByRole('button', { name: /enviar/i }).click();
  }

  async waitForSuccessMessage() {
    return await this.page.waitForSelector('div.alert-success:has-text("Candidato añadido con éxito")', { 
      state: 'visible',
      timeout: 10000 
    }).catch(() => null);
  }

  async getErrorMessage() {
    const errorAlert = await this.page.locator('div.alert-danger').first();
    if (await errorAlert.isVisible()) {
      return await errorAlert.textContent();
    }
    return null;
  }

  async goBack() {
    // Buscar el botón de volver (flecha del navegador o botón de volver)
    const backButton = this.page.locator('button:has-text("Volver"), a:has-text("Volver")').first();
    if (await backButton.isVisible()) {
      await backButton.click();
    } else {
      // Si no hay botón, usar el navegador
      await this.page.goBack();
    }
  }
}

// Page Object para la página de posiciones
class PositionsPage {
  constructor(private page: Page) {}

  async waitForSearchInput() {
    await this.page.waitForSelector('input[placeholder*="Buscar por título"], input[placeholder*="busca por titulo"]', { 
      state: 'visible' 
    });
  }

  async getRandomPositionCard() {
    const cards = await this.page.locator('div.card, article.card').all();
    if (cards.length === 0) {
      throw new Error('No se encontraron cartillas de posiciones');
    }
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
  }

  async getFirstPositionCard() {
    const cards = await this.page.locator('div.card, article.card').all();
    if (cards.length === 0) {
      throw new Error('No se encontraron cartillas de posiciones');
    }
    return cards[0]; // Siempre retorna la primera posición
  }

  async getPositionTitle(card: any) {
    return await card.locator('h5, .card-title, [class*="title"]').first().textContent();
  }

  async clickViewProcess(card: any) {
    await card.getByRole('button', { name: /ver proceso/i }).click();
  }

  async goBackToPositions() {
    await this.page.getByRole('button', { name: /volver a posiciones/i }).click();
  }
}

// Page Object para la página de detalles de posición
class PositionDetailsPage {
  constructor(private page: Page) {}

  async waitForViewPositionsElement() {
    await this.page.waitForSelector('h2:has-text("Ver Posiciones"), h2:has-text("Ver Posiciones"), button:has-text("Volver a Posiciones")', {
      state: 'visible'
    });
  }

  async getColumns() {
    // Buscar las columnas de etapas (StageColumn)
    return await this.page.locator('div[class*="col-md"], div.card:has([class*="card-header"])').all();
  }

  async getColumnWithCandidates() {
    // Buscar todas las columnas que contienen candidatos
    const columns = await this.page.locator('div[class*="col-md"]').all();
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      // Contar solo los candidatos dentro del Card.Body, no el Card principal
      const cardBody = column.locator('.card-body').first();
      const candidates = await cardBody.locator('.card:has(.card-title)').count();
      if (candidates > 0) {
        return { column, index: i };
      }
    }
    return null;
  }

  async getRandomCandidateFromColumn(column: any) {
    // Obtener los candidatos desde el Card.Body de la columna
    const cardBody = column.locator('.card-body').first();
    const candidates = await cardBody.locator('.card:has(.card-title)').all();
    if (candidates.length === 0) {
      throw new Error('No hay candidatos en la columna');
    }
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }

  async getCandidateName(candidateCard: any) {
    return await candidateCard.locator('h5, .card-title, [class*="title"]').first().textContent();
  }

  async moveCandidateToNextColumn(candidateCard: any, currentColumnIndex: number, totalColumns: number) {
    const nextColumnIndex = currentColumnIndex === totalColumns - 1 ? 0 : currentColumnIndex + 1;
    
    // Obtener las coordenadas del candidato y de la columna destino
    const candidateBox = await candidateCard.boundingBox();
    const nextColumn = await this.page.locator(`div[class*="col-md"], div[class*="col"]`).nth(nextColumnIndex);
    const targetBox = await nextColumn.boundingBox();
    
    if (candidateBox && targetBox) {
      // Realizar drag and drop usando las coordenadas
      await candidateCard.hover();
      await this.page.mouse.down();
      // Mover el mouse a la posición de destino
      await this.page.mouse.move(
        targetBox.x + targetBox.width / 2, 
        targetBox.y + targetBox.height / 2,
        { steps: 10 }
      );
      await this.page.mouse.up();
      
      // Esperar a que se complete la animación y la actualización
      await this.page.waitForTimeout(2000);
    }
    
    return nextColumnIndex;
  }

  async verifyCandidateInColumn(candidateName: string, columnIndex: number) {
    const columns = await this.page.locator('div[class*="col-md"]').all();
    if (columnIndex >= columns.length) {
      return false;
    }
    const column = columns[columnIndex];
    const candidateText = await column.textContent();
    return candidateText?.includes(candidateName || '') || false;
  }

  async goBackToPositions() {
    await this.page.getByRole('button', { name: /volver a posiciones/i }).click();
  }
}

test.describe('Tests E2E PAQ', () => {
  test.beforeEach(async ({ page }) => {
    // Limpiar el archivo de reporte al inicio de cada test
    if (fs.existsSync(reportPath)) {
      fs.writeFileSync(reportPath, '', 'utf8');
    }
    // Crear directorio de screenshots si no existe
    const screenshotsDir = path.join(__dirname, '../../test-results/screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('Test 1: Añadir nuevo candidato', async ({ page }) => {
    test.setTimeout(60000);
    
    // Configurar para modo debug y visualización
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const dashboard = new DashboardPage(page);
    const addCandidatePage = new AddCandidatePage(page);
    
    writeToReport('Inicio del test: Añadir nuevo candidato');
    
    // Navegar a la página principal
    await dashboard.goto();
    await takeScreenshot(page, '01-dashboard-inicial');
    
    // Presionar botón "Añadir nuevo candidato"
    await dashboard.clickAddCandidate();
    writeToReport('Botón "Añadir nuevo candidato" presionado');
    await takeScreenshot(page, '02-formulario-candidato');
    
    // Esperar a que aparezca el botón "Enviar"
    await addCandidatePage.waitForSubmitButton();
    writeToReport('Botón "Enviar" visible');
    
    // Obtener datos random de candidato
    const candidate = getRandomCandidate();
    writeToReport(`Datos del candidato seleccionado: ${JSON.stringify(candidate)}`);
    
    // Completar los campos
    await addCandidatePage.fillCandidateForm(candidate);
    await takeScreenshot(page, '03-formulario-completado');
    writeToReport('Campos del formulario completados');
    
    // Presionar botón "enviar"
    await addCandidatePage.submit();
    writeToReport('Botón "Enviar" presionado');
    await takeScreenshot(page, '04-despues-enviar');
    
    // Verificar mensaje de éxito
    const successMessage = await addCandidatePage.waitForSuccessMessage();
    if (successMessage) {
      writeToReport('Proceso exitoso: Candidato añadido con éxito');
      await takeScreenshot(page, '05-mensaje-exito');
    } else {
      const errorMessage = await addCandidatePage.getErrorMessage();
      writeToReport(`Error al añadir candidato: ${errorMessage || 'Error desconocido'}`);
      await takeScreenshot(page, '05-mensaje-error');
    }
    
    // Presionar la flecha del navegador para volver
    await addCandidatePage.goBack();
    writeToReport('Navegación hacia atrás realizada');
    await takeScreenshot(page, '06-despues-volver');
    
    // Esperar a que aparezca el botón "Añadir nuevo candidato"
    await dashboard.waitForAddCandidateButton();
    writeToReport('Botón "Añadir nuevo candidato" visible nuevamente');
    
    // Finalización del test
    writeToReport('Finalización del test');
    await takeScreenshot(page, '07-final-test');
  });

  test('Test 2: Proceso de posiciones y movimiento de cartillas', async ({ page }) => {
    test.setTimeout(120000);
    
    // Configurar para modo debug y visualización
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const dashboard = new DashboardPage(page);
    const positionsPage = new PositionsPage(page);
    const positionDetailsPage = new PositionDetailsPage(page);
    
    writeToReport('Inicio del test: Proceso de posiciones');
    
    // Navegar a la página principal
    await dashboard.goto();
    await takeScreenshot(page, '01-dashboard-inicial');
    
    // Presionar botón "Ir a posiciones"
    await dashboard.clickGoToPositions();
    writeToReport('Botón "Ir a posiciones" presionado');
    await takeScreenshot(page, '02-pagina-posiciones');
    
    // Esperar a que aparezca el elemento "busca por titulo"
    await positionsPage.waitForSearchInput();
    writeToReport('Elemento "busca por titulo" visible');
    
    // Elegir una cartilla al azar
    const randomCard = await positionsPage.getRandomPositionCard();
    const positionTitle = await positionsPage.getPositionTitle(randomCard);
    writeToReport(`Cartilla seleccionada: ${positionTitle}`);
    await takeScreenshot(page, '03-cartilla-seleccionada');
    
    // Presionar "Ver Proceso" de esa cartilla
    await positionsPage.clickViewProcess(randomCard);
    writeToReport(`Botón "Ver Proceso" presionado para: ${positionTitle}`);
    await takeScreenshot(page, '04-detalles-posicion');
    
    // Esperar a que aparezca el elemento "Ver Posiciones"
    await positionDetailsPage.waitForViewPositionsElement();
    writeToReport('Elemento "Ver Posiciones" visible');
    
    // Verificar si hay cartillas en todas las columnas
    const columns = await positionDetailsPage.getColumns();
    writeToReport(`Número de columnas encontradas: ${columns.length}`);
    
    // PASO 1: Verificar si hay al menos un candidato en total (en todas las fases)
    let totalCandidates = 0;
    for (let i = 0; i < columns.length; i++) {
      const cardBody = columns[i].locator('.card-body').first();
      const candidatesCount = await cardBody.locator('.card:has(.card-title)').count();
      writeToReport(`Fase ${i + 1}: ${candidatesCount} candidatos`);
      totalCandidates += candidatesCount;
    }
    
    writeToReport(`Total de candidatos en todas las fases: ${totalCandidates}`);
    
    // Si no hay candidatos, no se puede realizar cambio de fase
    if (totalCandidates === 0) {
      writeToReport('No hay candidatos en ninguna fase, no se puede realizar cambio de fase');
      await takeScreenshot(page, '05-sin-candidatos');
      return;
    }
    
    // PASO 2: Recorrer cada fase, empezando por la primera, hasta encontrar una que contenga candidatos
    writeToReport('Buscando la primera fase que contenga candidatos...');
    let columnWithCandidates: { column: Locator; index: number } | null = null;
    
    for (let i = 0; i < columns.length; i++) {
      const cardBody = columns[i].locator('.card-body').first();
      const candidatesCount = await cardBody.locator('.card:has(.card-title)').count();
      if (candidatesCount > 0) {
        columnWithCandidates = { column: columns[i], index: i };
        writeToReport(`Primera fase con candidatos encontrada: Fase ${i + 1} (índice ${i}) con ${candidatesCount} candidatos`);
        break;
      }
    }
    
    if (!columnWithCandidates) {
      writeToReport('Error: No se encontró ninguna fase con candidatos (aunque el total indicaba que había)');
      await takeScreenshot(page, '05-error-busqueda-fase');
      return;
    }
    
    // Si llegamos aquí, hay candidatos y encontramos una fase con candidatos
    writeToReport('Hay candidatos disponibles, procediendo con el cambio de fase');
    await takeScreenshot(page, '05-fase-con-candidatos-encontrada');
    
    // Tomar una cartilla al azar de la fase encontrada
    const randomCandidate = await positionDetailsPage.getRandomCandidateFromColumn(columnWithCandidates.column);
    const candidateName = await positionDetailsPage.getCandidateName(randomCandidate);
    writeToReport(`Candidato seleccionado para mover: ${candidateName}`);
    await takeScreenshot(page, '06-candidato-seleccionado');
    
    // Mover a la columna siguiente (o primera si es la última)
    const totalColumns = columns.length;
    const newColumnIndex = await positionDetailsPage.moveCandidateToNextColumn(
      randomCandidate,
      columnWithCandidates.index,
      totalColumns
    );
    writeToReport(`Candidato movido de la fase ${columnWithCandidates.index + 1} a la fase ${newColumnIndex + 1}`);
    await takeScreenshot(page, '07-candidato-movido');
    
    // Recordar el nombre del candidato y la columna
    const rememberedCandidateName = candidateName;
    const rememberedColumnIndex = newColumnIndex;
    writeToReport(`Recordado: Candidato "${rememberedCandidateName}" movido a la fase ${rememberedColumnIndex + 1}`);
    
    // Presionar "Volver a posiciones"
    await positionDetailsPage.goBackToPositions();
    writeToReport('Botón "Volver a posiciones" presionado');
    await takeScreenshot(page, '08-vuelta-posiciones');
    
    // Esperar a que aparezca el elemento "busca por titulo"
    await positionsPage.waitForSearchInput();
    
    // Presionar "Ver Proceso" de la cartilla procesada anteriormente
    const positionCards = await page.locator('div.card, article.card').all();
    let targetCard: Locator | null = null;
    for (const card of positionCards) {
      const cardTitle = await card.locator('h5, .card-title, [class*="title"]').first().textContent();
      if (cardTitle === positionTitle) {
        targetCard = card;
        break;
      }
    }
    
    if (targetCard) {
      await positionsPage.clickViewProcess(targetCard);
      writeToReport(`Botón "Ver Proceso" presionado nuevamente para: ${positionTitle}`);
      await takeScreenshot(page, '09-detalles-posicion-2');
      
      // Esperar a que aparezca el elemento "Ver Posiciones"
      await positionDetailsPage.waitForViewPositionsElement();
      
      // Corroborar que el elemento movido quedó en la columna movida anteriormente
      const isInCorrectColumn = await positionDetailsPage.verifyCandidateInColumn(
        rememberedCandidateName || '',
        rememberedColumnIndex
      );
      
      if (isInCorrectColumn) {
        writeToReport('Testeo exitoso: El candidato está en la fase correcta');
        await takeScreenshot(page, '10-verificacion-exitosa');
      } else {
        writeToReport('No se dio el resultado esperado: El candidato no está en la fase esperada');
        await takeScreenshot(page, '10-verificacion-fallida');
      }
    } else {
      writeToReport(`Error: No se pudo encontrar la cartilla "${positionTitle}"`);
    }
    
    writeToReport('Finalización del test de posiciones');
  });

  test('Test 3: Proceso de posiciones trabajando directamente con la segunda columna', async ({ page }) => {
    test.setTimeout(120000);
    
    // Configurar para modo debug y visualización
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const dashboard = new DashboardPage(page);
    const positionsPage = new PositionsPage(page);
    const positionDetailsPage = new PositionDetailsPage(page);
    
    writeToReport('Inicio del test: Proceso de posiciones (segunda columna)');
    
    // Navegar a la página principal
    await dashboard.goto();
    await takeScreenshot(page, 't3-01-dashboard-inicial');
    
    // Presionar botón "Ir a posiciones"
    await dashboard.clickGoToPositions();
    writeToReport('Botón "Ir a posiciones" presionado');
    await takeScreenshot(page, 't3-02-pagina-posiciones');
    
    // Esperar a que aparezca el elemento "busca por titulo"
    await positionsPage.waitForSearchInput();
    writeToReport('Elemento "busca por titulo" visible');
    
    // Elegir siempre la primera posición (forzar primera posición)
    const firstCard = await positionsPage.getFirstPositionCard();
    const positionTitle = await positionsPage.getPositionTitle(firstCard);
    writeToReport(`Primera posición seleccionada (forzada): ${positionTitle}`);
    await takeScreenshot(page, 't3-03-primera-posicion-seleccionada');
    
    // Presionar "Ver Proceso" de la primera posición
    await positionsPage.clickViewProcess(firstCard);
    writeToReport(`Botón "Ver Proceso" presionado para: ${positionTitle}`);
    await takeScreenshot(page, 't3-04-detalles-posicion');
    
    // Esperar a que aparezca el elemento "Ver Posiciones"
    await positionDetailsPage.waitForViewPositionsElement();
    writeToReport('Elemento "Ver Posiciones" visible');
    
    // Obtener todas las columnas directamente usando el selector correcto
    // Las columnas están en div.col-md-3 dentro de un Row
    const columns = await page.locator('div[class*="col-md-3"], div[class*="col-md"]').all();
    writeToReport(`Número de columnas encontradas: ${columns.length}`);
    
    // Verificar que haya al menos 2 columnas
    if (columns.length < 2) {
      writeToReport('Error: No hay suficientes columnas (se requieren al menos 2)');
      await takeScreenshot(page, 't3-error-columnas-insuficientes');
      return;
    }
    
    // Trabajar directamente con la segunda columna (índice 1)
    // IMPORTANTE: Índice 1 = segunda columna (0 es la primera, 1 es la segunda)
    const secondColumnIndex = 1;
    const secondColumn = columns[secondColumnIndex];
    
    // Verificar que tenemos la segunda columna correcta
    const secondColumnHeader = await secondColumn.locator('div[class*="card-header"], .card-header').textContent();
    writeToReport(`Trabajando directamente con la segunda columna (índice ${secondColumnIndex}): "${secondColumnHeader}"`);
    await takeScreenshot(page, 't3-04b-segunda-columna-identificada');
    
    // Verificar si hay candidatos en la segunda columna (solo dentro del Card.Body)
    const secondColumnCardBody = secondColumn.locator('.card-body').first();
    const candidatesInSecondColumn = await secondColumnCardBody.locator('.card:has(.card-title)').count();
    writeToReport(`Candidatos en la segunda columna (índice ${secondColumnIndex}): ${candidatesInSecondColumn}`);
    
    if (candidatesInSecondColumn === 0) {
      writeToReport('La segunda columna no tiene candidatos, no se puede continuar el test');
      await takeScreenshot(page, 't3-error-sin-candidatos');
      return;
    }
    
    // Tomar una cartilla al azar de la segunda columna
    const randomCandidate = await positionDetailsPage.getRandomCandidateFromColumn(secondColumn);
    const candidateName = await positionDetailsPage.getCandidateName(randomCandidate);
    writeToReport(`Candidato seleccionado para mover desde la segunda columna: ${candidateName}`);
    await takeScreenshot(page, 't3-05-candidato-seleccionado');
    
    // Mover a la columna siguiente (tercera columna, índice 2, o primera si es la última)
    const totalColumns = columns.length;
    const nextColumnIndex = secondColumnIndex === totalColumns - 1 ? 0 : secondColumnIndex + 1;
    const nextColumn = columns[nextColumnIndex];
    writeToReport(`Moviendo candidato de columna ${secondColumnIndex + 1} a columna ${nextColumnIndex + 1}`);
    
    // Realizar el drag and drop directamente
    const candidateBox = await randomCandidate.boundingBox();
    const targetBox = await nextColumn.boundingBox();
    
    if (candidateBox && targetBox) {
      // Realizar drag and drop usando las coordenadas
      await randomCandidate.hover();
      await page.mouse.down();
      // Mover el mouse a la posición de destino
      await page.mouse.move(
        targetBox.x + targetBox.width / 2, 
        targetBox.y + targetBox.height / 2,
        { steps: 10 }
      );
      await page.mouse.up();
      
      // Esperar a que se complete la animación y la actualización
      await page.waitForTimeout(2000);
    }
    
    const newColumnIndex = nextColumnIndex;
    writeToReport(`Candidato movido a la columna ${newColumnIndex + 1}`);
    await takeScreenshot(page, 't3-06-candidato-movido');
    
    // Recordar el nombre del candidato y la columna
    const rememberedCandidateName = candidateName;
    const rememberedColumnIndex = newColumnIndex;
    writeToReport(`Recordado: Candidato "${rememberedCandidateName}" en columna ${rememberedColumnIndex + 1}`);
    
    // Presionar "Volver a posiciones"
    await positionDetailsPage.goBackToPositions();
    writeToReport('Botón "Volver a posiciones" presionado');
    await takeScreenshot(page, 't3-07-vuelta-posiciones');
    
    // Esperar a que aparezca el elemento "busca por titulo"
    await positionsPage.waitForSearchInput();
    
    // Presionar "Ver Proceso" de la cartilla procesada anteriormente
    const positionCards = await page.locator('div.card, article.card').all();
    let targetCard: Locator | null = null;
    for (const card of positionCards) {
      const cardTitle = await card.locator('h5, .card-title, [class*="title"]').first().textContent();
      if (cardTitle === positionTitle) {
        targetCard = card;
        break;
      }
    }
    
    if (targetCard) {
      await positionsPage.clickViewProcess(targetCard);
      writeToReport(`Botón "Ver Proceso" presionado nuevamente para: ${positionTitle}`);
      await takeScreenshot(page, 't3-08-detalles-posicion-2');
      
      // Esperar a que aparezca el elemento "Ver Posiciones"
      await positionDetailsPage.waitForViewPositionsElement();
      
      // Corroborar que el elemento movido quedó en la columna movida anteriormente
      const isInCorrectColumn = await positionDetailsPage.verifyCandidateInColumn(
        rememberedCandidateName || '',
        rememberedColumnIndex
      );
      
      if (isInCorrectColumn) {
        writeToReport('Testeo exitoso: El candidato está en la columna correcta');
        await takeScreenshot(page, 't3-09-verificacion-exitosa');
      } else {
        writeToReport('No se dio el resultado esperado: El candidato no está en la columna esperada');
        await takeScreenshot(page, 't3-09-verificacion-fallida');
      }
    } else {
      writeToReport(`Error: No se pudo encontrar la cartilla "${positionTitle}"`);
      await takeScreenshot(page, 't3-error-cartilla-no-encontrada');
    }
    
    writeToReport('Finalización del test de posiciones (segunda columna)');
  });
});

