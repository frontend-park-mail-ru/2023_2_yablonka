export const actionGetBoard = (boardID) => ({
    type: 'getBoard',
    value: { board_id: boardID },
});

export const actionCreateBoard = (newBoard) => ({
    type: 'createBoard',
    value: newBoard,
});

export const actionUpdateBoard = (newBoard) => ({
    type: 'updateBoard',
    value: newBoard,
});

export const actionDeleteBoard = (id) => ({
    type: 'deleteBoard',
    value: { board_id: id },
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

export const actionCommentCard = (comment) => ({
    type: 'commentCard',
    value: comment,
});
