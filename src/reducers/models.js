const OPEN_MODEL = 'OPEN_MODEL';
export const openModel = (id) => ({
    type: OPEN_MODEL,
    id: id
});

const CLOSE_MODEL = 'CLOSE_MODEL';
export const closeModel = (id) => ({
    type: CLOSE_MODEL,
    id
});

const models = (models = [], action) => {
    const newState = models.slice();
    switch (action.type) {
        case OPEN_MODEL:
            if (newState.indexOf(action.id) === -1) {
                newState.push(action.id);
            }
            break;
        case  CLOSE_MODEL:
            if (newState[models.length - 1] === action.id) {
                newState.pop();
            }
            break;
        default:
            break;
    }
    return newState;
};
