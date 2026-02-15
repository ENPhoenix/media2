import { formatCoordinates } from './coordinates.js';

/**
 * Класс для управления Timeline
 */
export class Timeline {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.posts = [];
  }

  /**
   * Добавляет текстовый пост
   * @param {string} text - текст сообщения
   * @param {Object} coords - объект с latitude и longitude
   */
  addTextPost(text, coords) {
    const post = {
      id: Date.now(),
      type: 'text',
      content: text,
      coords: coords,
      timestamp: new Date(),
    };
    
    this.posts.unshift(post);
    this.renderPost(post);
  }

  /**
   * Добавляет аудио пост
   * @param {string} audioUrl - URL аудио записи
   * @param {Object} coords - объект с latitude и longitude
   */
  addAudioPost(audioUrl, coords) {
    const post = {
      id: Date.now(),
      type: 'audio',
      content: audioUrl,
      coords: coords,
      timestamp: new Date(),
    };
    
    this.posts.unshift(post);
    this.renderPost(post);
  }

  /**
   * Рендерит пост в DOM
   * @param {Object} post - объект поста
   */
  renderPost(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.dataset.id = post.id;

    let contentHtml = '';
    
    if (post.type === 'text') {
      contentHtml = `<div class="post-content">${this.escapeHtml(post.content)}</div>`;
    } else if (post.type === 'audio') {
      contentHtml = `
        <div class="post-content">
          <audio controls src="${post.content}"></audio>
        </div>
      `;
    }

    const coordsHtml = `
      <div class="post-coords">
        ${formatCoordinates(post.coords.latitude, post.coords.longitude)}
      </div>
    `;

    postElement.innerHTML = contentHtml + coordsHtml;
    
    // Добавляем в начало контейнера
    this.container.insertBefore(postElement, this.container.firstChild);
  }

  /**
   * Экранирует HTML спецсимволы
   * @param {string} text 
   * @returns {string}
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Очищает все посты
   */
  clear() {
    this.posts = [];
    this.container.innerHTML = '';
  }
}
