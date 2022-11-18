import * as model from './model';
import SearchView from './views/searchView';
import recipeView from './views/recipeView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecpieView from './views/addRecpieView';
// https://forkify-api.herokuapp.com/v2

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    //0). Update results view to mark selected result
    resultsView.update(model.getSearchResultsPage());
    //1).updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2).loading a recipe
    await model.loadRecipe(id);
    //3).rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
  // console.log(model.state.recipe);
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();
    //1). get search query
    const query = SearchView.getQuery();
    if (!query) return;

    //").load search results"
    await model.loadSearchResults(query);
    //3). render results
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = pageNum => {
  // console.log(model.state.recipe);
  // 1).render new results
  resultsView.render(model.getSearchResultsPage(pageNum));
  // 2).render new pagination btns
  paginationView.render(model.state.search);
};
const controlServings = newServings => {
  //update the receipe serivings(in state)
  model.updateServings(newServings);
  //update the receipe view
  recipeView.update(model.state.recipe);
};
const controlBookmark = () => {
  //1)add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //2).update recpie view
  recipeView.update(model.state.recipe);
  //3).render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecpie = async newRecpieData => {
  try {
    addRecpieView.renderSpinner();
    //upload new recpie data
    await model.uploadRecpie(newRecpieData);

    //render add recpie
    recipeView.render(model.state.recipe);
    //success message
    addRecpieView.renderMessage();
    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(() => {
      addRecpieView.toggleWindow();
    }, 2000);
  } catch (err) {
    addRecpieView.renderError(err.message);
  }
  //to render the form again
  location.reload();
};

const init = () => {
  SearchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandleRender(controlRecipes);
  recipeView.addHandleUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmark);
  recipeView.renderMessage();
  paginationView.addHandleClick(controlPagination);
  bookmarksView.addHandleRender(bookmarksView.render(model.state.bookmarks));
  addRecpieView.addHandleUpload(controlAddRecpie);
};
init();
console.log('hello from controller.js');
