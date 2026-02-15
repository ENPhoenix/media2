import './css/style.css';
import { Timeline } from './js/timeline.js';
import { getCoordinatesWithFallback } from './js/geolocation.js';
import { AudioRecorder } from './js/audioRecorder.js';

// Инициализация Timeline
const timeline = new Timeline('timeline');

// Элементы DOM
const textInput = document.getElementById('textInput');
const audioBtn = document.getElementById('audioBtn');
const coordsModal = document.getElementById('coordsModal');
const audioModal = document.getElementById('audioModal');
const audioTimer = document.getElementById('audioTimer');
const audioOk = document.getElementById('audioOk');
const audioCancel = document.getElementById('audioCancel');

// Создаём аудио рекордер
const audioRecorder = new AudioRecorder();

// Обработка ввода текста
textInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter' && textInput.value.trim()) {
    const text = textInput.value.trim();
    const coords = await getCoordinatesWithFallback();
    
    if (coords) {
      timeline.addTextPost(text, coords);
      textInput.value = '';
    }
  }
});

// Обработка кнопки аудио
audioBtn.addEventListener('click', async () => {
  try {
    // Сначала получаем координаты
    const coords = await getCoordinatesWithFallback();
    
    // Если координаты не получены - не начинаем запись
    if (!coords) {
      return;
    }
    
    // Показываем модальное окно записи
    audioModal.classList.add('active');
    
    // Начинаем запись
    await audioRecorder.start();
    
    // Обновление таймера
    audioRecorder.onTimerUpdate = (time) => {
      audioTimer.textContent = time;
    };
    
    // При завершении записи используем уже полученные координаты
    audioRecorder.onRecordingComplete = (audioUrl) => {
      timeline.addAudioPost(audioUrl, coords);
      audioModal.classList.remove('active');
      audioTimer.textContent = '00:00';
    };
    
  } catch (error) {
    alert('Не удалось получить доступ к микрофону. Пожалуйста, проверьте разрешения.');
    audioModal.classList.remove('active');
  }
});

// Кнопка OK для аудио (сохранить)
audioOk.addEventListener('click', () => {
  audioRecorder.stop();
});

// Кнопка Cancel для аудио (отменить)
audioCancel.addEventListener('click', () => {
  audioRecorder.cancel();
  audioModal.classList.remove('active');
  audioTimer.textContent = '00:00';
});
