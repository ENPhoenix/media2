/**
 * Парсит строку с координатами в объект { latitude, longitude }
 * Поддерживаемые форматы:
 * - 51.50851, −0.12572 (с пробелом)
 * - 51.50851,−0.12572 (нет пробела)
 * - [51.50851, −0.12572] (есть квадратные скобки)
 * 
 * @param {string} input - строка с координатами
 * @returns {Object} - объект с latitude и longitude
 * @throws {Error} - при неверном формате
 */
export function parseCoordinates(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input: expected string');
  }

  // Убираем квадратные скобки если есть
  let cleaned = input.trim();
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // Заменяем Unicode минус (U+2212) на обычный минус (U+002D)
  cleaned = cleaned.replace(/\u2212/g, '-');

  // Разделяем по запятой
  const parts = cleaned.split(',');
  
  if (parts.length !== 2) {
    throw new Error('Invalid format: expected two coordinates separated by comma');
  }

  // Парсим широту и долготу
  const latitude = parseFloat(parts[0].trim());
  const longitude = parseFloat(parts[1].trim());

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid format: coordinates must be numbers');
  }

  // Проверяем диапазоны
  if (latitude < -90 || latitude > 90) {
    throw new Error('Invalid latitude: must be between -90 and 90');
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error('Invalid longitude: must be between -180 and 180');
  }

  return { latitude, longitude };
}


/**
 * Форматирует координаты для отображения
 * 
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {string} - отформатированная строка
 */
export function formatCoordinates(latitude, longitude) {
  return `[${latitude.toFixed(5)}, ${longitude.toFixed(5)}]`;
}
