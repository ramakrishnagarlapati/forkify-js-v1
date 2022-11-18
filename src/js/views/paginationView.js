import icons from 'url:../../img/icons.svg';
import View from './view';
class paginationView extends View {
  _parentEl = document.querySelector('.pagination');
  addHandleClick(handler) {
    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = parseInt(btn.dataset.goto);
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //page 1, and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return `
        <button data-goto='${
          this._data.page + 1
        }' class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button> 
      `;
    }

    //last page
    if (this._data.page === numPages && numPages > 1) {
      return `
        <button data-goto='${
          this._data.page - 1
        }' class="btn--inline  pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
        </button>
      `;
    }
    //other page
    if (this._data.page < numPages) {
      return `
    <button data-goto='${
      this._data.page - 1
    }' class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this._data.page - 1}</span>
    </button>
    <button data-goto='${
      this._data.page + 1
    }' class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
    </button> 
  `;
    }
    //page 1, and there are no other pages
    //  if(this._data.page===1 && numPages===1){
    //     return `page 1, no others`
    // }
    return `only 1 page`;
  }
}
export default new paginationView();
