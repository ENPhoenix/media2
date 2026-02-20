import { parseCoordinates, formatCoordinates } from './coordinates.js';

/**
 * Получает текущую геопозицию пользователя
 * @returns {Promise<Object>} - объект с latitude и longitude
 */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/**
 * Показывает модальное окно для ручного ввода координат
 * @returns {Promise<Object|null>} - объект с координатами или null при отмене
 */
export function showCoordinatesModal() {
  return new Promise((resolve) => {
    const modal = document.getElementById('coordsModal');
    const input = document.getElementById('coordsInput');
    const okBtn = document.getElementById('coordsOk');
    const cancelBtn = document.getElementById('coordsCancel');

    let resolved = false;

    const cleanup = () => {
      modal.classList.remove('active');
      input.value = '';
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
    };

    const onOk = () => {
      if (resolved) return;

      try {
        const coords = parseCoordinates(input.value);
        resolved = true;
        cleanup();
        resolve(coords);
      } catch (error) {
        // Показываем ошибку валидации
        input.style.borderColor = 'red';
        setTimeout(() => {
          input.style.borderColor = '';
        }, 2000);
      }
    };


    const onCancel = () => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(null);
    };

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);

    // Обработка Enter в поле ввода
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        onOk();
      }
    });

    modal.classList.add('active');
    input.focus();
  });
}

/**
 * Получает координаты с fallback на ручной ввод
 * @returns {Promise<Object|null>} - объект с координатами или null
 */
export async function getCoordinatesWithFallback() {
  try {
    return await getCurrentPosition();
  } catch (error) {
    // Если геолокация недоступна, показываем модальное окно
    return await showCoordinatesModal();
  }
}
