/**
 * Класс для записи аудио
 */
export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.startTime = null;
    this.timerInterval = null;
    this.onTimerUpdate = null;
    this.onRecordingComplete = null;
    this.onError = null;
  }

  /**
   * Начинает запись аудио
   */
  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (this.onRecordingComplete) {
          this.onRecordingComplete(audioUrl, audioBlob);
        }
        
        this.cleanup();
      };

      this.mediaRecorder.start();
      this.startTime = Date.now();
      
      // Запускаем таймер
      this.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        if (this.onTimerUpdate) {
          this.onTimerUpdate(this.formatTime(elapsed));
        }
      }, 1000);

    } catch (error) {
      if (this.onError) {
        this.onError(error);
      }
      throw error;
    }
  }

  /**
   * Останавливает запись
   */
  stop() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.cleanup();
  }

  /**
   * Отменяет запись без сохранения
   */
  cancel() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.audioChunks = [];
    this.cleanup();
  }

  /**
   * Очищает ресурсы
   */
  cleanup() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  /**
   * Форматирует время в формат MM:SS
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }
}
