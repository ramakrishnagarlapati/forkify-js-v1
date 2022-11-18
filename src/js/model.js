import { API_URL, RES_PER_PAGE, API_KEY } from './config';
import { getJSON, sendJSON, ajaxRequest } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};
export const loadRecipe = async id => {
  try {
    const data = await ajaxRequest(`${API_URL}${id}?key=${API_KEY}`);

    let { recipe } = data.data;
    state.recipe = recipe;
    if (
      state.bookmarks.some(bookmarkReceipe => bookmarkReceipe.id === recipe.id)
    ) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async query => {
  try {
    const data = await ajaxRequest(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.query = query;
    state.search.results = data.data.recipes;
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * 10; //0
  const end = page * RES_PER_PAGE; //9 but returns 10, because slice ignore the end item
  return state.search.results.slice(start, end); //0 to 9
};

export const updateServings = newServings => {
  console.log(state.recipe.ingredients);
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQt=oldQt*newServings/oldServings
  });

  state.recipe.servings = newServings;
};
const persistBookmark = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = receipe => {
  //add bookmark
  state.bookmarks.push(receipe);
  //mark current receipe as bookmarked
  if (receipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmark();
};
export const deleteBookmark = id => {
  //delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //mark current recipe not bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmark();
};
//init function
const init = () => {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecpie = async newRecpieData => {
  try {
    const ingredients = Object.entries(newRecpieData)
      .filter(ing => ing[0].startsWith('ingredient') && ing[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(item => item.trim());
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : 'null', unit, description };
      });
    const receipe = {
      title: newRecpieData.title,
      source_url: newRecpieData.sourceUrl,
      image_url: newRecpieData.image,
      publisher: newRecpieData.publisher,
      cooking_time: +newRecpieData.cookingTime,
      servings: +newRecpieData.servings,
      ingredients,
      ...(newRecpieData.id && { key: newRecpieData.id }),
    };
    const data = await ajaxRequest(`${API_URL}?key=${API_KEY}`, receipe);
    state.recipe = data.data.recipe;
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

// const clearBookmarks = () => {
//   localStorage.clear();
// };
// clearBookmarks();
