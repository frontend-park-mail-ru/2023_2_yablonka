export const actionToSignUp = () => ({
    type: 'goSignup',
    value: {},
});

export const actionToSignIn = () => ({
    type: 'goSignin',
    value: {},
});

export const actionStart = () => ({
    type: 'start',
    value: {},
});

export const actionSignin = (user) => ({
    type: 'userSignin',
    value: user,
});

export const actionSignup = (user) => ({
    type: 'userSignup',
    value: user,
});

export const actionRedirect = (_path, _pushState, _refresh) => ({
    type: 'redirect',
    value: {
        path: _path,
        pushState: _pushState,
        refresh: _refresh,
    },
});

export const actionLogout = () => ({
    type: 'userLogout',
    value: {},
});
