// Action Creator
const ADD_TODO = 'ADD_TODO';
let nextTodoId = 0;
export const addTodo = (text) => ({
    type: ADD_TODO,
    id: nextTodoId++,
    text
});

const TOGGLE_TODO = 'TOGGLE_TODO';
export const toggleTodo = (id) => ({
    type: TOGGLE_TODO,
    id
});

// Reducer
const todos = (state = [], action) => {
    switch (action.type) {
        case ADD_TODO:
            return state.concat({
                id: action.id,
                text: action.text,
                completed: false
            });
        case TOGGLE_TODO:
            return state.map((todo) =>
                todo.id === action.id
                    ? {...todo, completed: !todo.completed}
                    : todo
            );
        default:
            return state;
    }
};

export default todos;