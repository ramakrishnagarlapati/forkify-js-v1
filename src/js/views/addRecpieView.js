import icons from 'url:../../img/icons.svg';
import View from './view';
class AddRecpieView extends View {
  _parentEl = document.querySelector('.upload');
  _windowEL = document.querySelector('.add-recipe-window');
  _overlayEl = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnCloseModal = document.querySelector('.btn--close-modal');
  _message = 'Recipe was successfully uploaded :)';
  constructor() {
    super();
    this._addHandleShowWindow();
    this._addHandleHideWindow();
  }
  toggleWindow() {
    this._overlayEl.classList.toggle('hidden');
    this._windowEL.classList.toggle('hidden');
  }
  _addHandleShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandleHideWindow() {
    this._btnCloseModal.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandleUpload(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      const dataArray = [...new FormData(this._parentEl)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }
  _generateMarkup() {}
}
export default new AddRecpieView();
