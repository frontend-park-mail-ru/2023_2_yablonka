/**
 * Действие, означающее получение досок
 */
export const actionGetWorkspaces = () => ({
    type: 'getWorkspaces',
    value: {},
});

export const actionCreateWorkspace = (workspace) => ({
    type: 'createWorkspace',
    value: workspace,
});

export const actionDeleteWorkspace = (workspace) => ({
    type: 'deleteWorkspace',
    value: workspace,
});

export const actionUpdateWorkspace = (newWorkspaceData) => ({
    type: 'updateWorkspace',
    value: newWorkspaceData,
});
