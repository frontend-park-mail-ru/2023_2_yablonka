export const actionGetBoard = (boardID) => ({
    type: 'getBoard',
    value: { board_id: boardID },
});

export const actionCreateBoard = (newBoard) => ({
    type: 'createBoard',
    value: newBoard,
});

export const actionCreateList = (newList) => ({
    type: 'createList',
    value: newList,
});

export const actionUpdateList = (newList) => ({
    type: 'updateList',
    value: newList,
});

export const actionDeleteList = (list) => ({
    type: 'deleteList',
    value: list,
});

export const actionCreateCard = (newCard) => ({
    type: 'createCard',
    value: newCard,
});

export const actionUpdateCard = (newCard) => ({
    type: 'updateCard',
    value: newCard,
});

export const actionDeleteCard = (card) => ({
    type: 'deleteCard',
    value: card,
});
