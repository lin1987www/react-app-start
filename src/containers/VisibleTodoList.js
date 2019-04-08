import {connect} from 'react-redux';
import TodoList from '../components/TodoList.jsx';
import {toggleTodo, VisibilityFilters} from '../reducers';

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case VisibilityFilters.SHOW_ACTIVE:
            return todos.filter(todo => !todo.completed);
        case VisibilityFilters.SHOW_COMPLETED:
            return todos.filter(todo => todo.completed);
        case VisibilityFilters.SHOW_ALL:
            return todos;
        default:
            throw new Error('Unknown filter: ' + filter);
    }
};

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state, ownProps) => ({
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch, ownProps) => ({
    toggleTodo: id => dispatch(toggleTodo(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoList);