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

export const actionDeleteWorkspace = (delId) => ({
    type: 'deleteWorkspace',
    value: { workspace_id: parseInt(delId) },
});

export const actionUpdateWorkspace = (newWorkspaceData) => ({
    type: 'updateWorkspace',
    value: newWorkspaceData,
});
