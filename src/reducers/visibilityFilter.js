export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
};

const TYPE = 'SET_VISIBILITY_FILTER';

// Action Creator
export const setVisibilityFilter = (filter) => {
    return {
        type: TYPE,
        filter
    };
};

// Reducer
const visibilityFilter = (state = VisibilityFilters.SHOW_ALL, action) => {
    switch (action.type) {
        case TYPE:
            return action.filter;
        default:
            return state;
    }
};

export default visibilityFilter;