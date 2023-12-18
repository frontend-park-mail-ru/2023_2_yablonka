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

export const actionAddUserBoard = (user) => ({
    type: 'addUserBoard',
    value: user,
});

export const actionRemoveUserBoard = (user) => ({
    type: 'removeUserBoard',
    value: user,
});

export const actionCreateChecklist = (newChecklist) => ({
    type: 'createChecklist',
    value: newChecklist,
});

export const actionUpdateChecklist = (newChecklist) => ({
    type: 'updateChecklist',
    value: newChecklist,
});

export const actionDeleteChecklist = (checklist) => ({
    type: 'deleteChecklist',
    value: checklist,
});

export const actionCreateChecklistItem = (newChecklistItem) => ({
    type: 'createChecklistItem',
    value: newChecklistItem,
});

export const actionUpdateChecklistItem = (newChecklistItem) => ({
    type: 'updateChecklistItem',
    value: newChecklistItem,
});

export const actionDeleteChecklistItem = (checklistItem) => ({
    type: 'deleteChecklistItem',
    value: checklistItem,
});

export const actionAddUserCard = (data) => ({
    type: 'addUserCard',
    value: data,
});

export const actionRemoveUserCard = (data) => ({
    type: 'removeUserCard',
    value: data,
});

export const actionReorderList = (data) => ({
    type: 'reorderList',
    value: data,
});

export const actionReorderLists = (data) => ({
    type: 'reorderLists',
    value: data
});

export const actionReorderChecklist = (data)=>({
    type:'reorderChecklist',
    value:data
})

export const actionAttachFile = (data)=>({
    type:'attachFile',
    value:data
})

export const actionGetFiles = (data)=>({
    type:'getFiles',
    value:data
})