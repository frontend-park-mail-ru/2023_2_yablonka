export const actionGetBoard = (boardID) => ({
    type: 'getBoard',
    value: { board_id: boardID },
});

export const actionCreateBoard = (newBoard) => ({
    type: 'createBoard',
    value: newBoard,
});
