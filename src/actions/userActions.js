/**
 * Действие, означающее переход на страницу регистрации
 */
export const actionToSignUp = () => ({
    type: 'goSignup',
    value: {},
});

/**
 * Действие, означающее переход на страницу логин
 */
export const actionToSignIn = () => ({
    type: 'goSignin',
    value: {},
});

/**
 * Действие, означающее начало работы приложения
 */
export const actionStart = () => ({
    type: 'start',
    value: {},
});

export const actionNavigate = (_path, _state, _pushState) => ({
    type: 'navigate',
    value: {
        path: _path,
        state: _state,
        pushState: _pushState,
    },
});

/**
 * Действие, означающее логин
 * @param {Object} user - данные пользователя
 */
export const actionSignin = (user) => ({
    type: 'userSignin',
    value: user,
});

/**
 * Действие, означающее регистрацию
 * @param {Object} user - данные пользователя
 */
export const actionSignup = (user) => ({
    type: 'userSignup',
    value: user,
});

/**
 * Действие, означающее редирект
 * @param {string} _path - путь
 * @param {boolean} _pushState - нужно ли делать запись в истории
 */
export const actionRedirect = (_path, _pushState) => ({
    type: 'redirect',
    value: {
        path: _path,
        pushState: _pushState,
    },
});

/**
 * Действие, означающее выход из аккаунта
 */
export const actionLogout = () => ({
    type: 'userLogout',
    value: {},
});

/**
 * Действие, означающее изменение профиля пользователя
 * @param {Object} user - данные пользователя
 */
export const actionUpdateProfile = (user) => ({
    type: 'updateProfile',
    value: user,
});

/**
 * Действие, означающее изменение пароля
 * @param {Object} user - данные пользователя
 */
export const actionUpdatePassword = (user) => ({
    type: 'updatePassword',
    value: user,
});

/**
 * Действие, означающее изменение аватарки
 * @param {Object} user - данные пользователя
 */
export const actionUpdateAvatar = (user) => ({
    type: 'updateAvatar',
    value: user,
});

export const actionAnswerQuestion = (answer) => ({
    type: 'answerQuestion',
    value: answer,
});

export const actionGetQuestions = () => ({
    type: 'getQuestions',
    value: {},
});
