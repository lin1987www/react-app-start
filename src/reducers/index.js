import todos, {addTodo, toggleTodo} from './todos';
import visibilityFilter, {setVisibilityFilter, VisibilityFilters} from './visibilityFilter';
import {combineReducers} from 'redux';

export {
    addTodo,
    toggleTodo,
    setVisibilityFilter,
    VisibilityFilters
};

export default combineReducers({todos, visibilityFilter});