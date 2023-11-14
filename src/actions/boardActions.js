export const actionGetBoard = (boardID) => ({
    type: 'getBoard',
    value: { board_id: boardID },
});
