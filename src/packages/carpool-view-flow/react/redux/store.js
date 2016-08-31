import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import general from './modules/general/reducer.js';

const reducer = combineReducers({
  general,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
