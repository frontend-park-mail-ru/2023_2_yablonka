export const hrefRegExp = /(^\w+:.+:\d+)|(^\w+:\/\/.+\/)/;

export const navigationPagesHrefRegExp = /^\/[a-zA-Z]+$/;

export const boardHrefRegExp = /^\/workspace\/\d+\/board\/\d+(\/card\/\d+)?$/;

export const validateObjectNameRegExp =
    /^[a-zA-Z0-9$@!?#^:;%'"\\*_а-яА-ЯёЁ][a-zA-Z0-9$@!?#^:;%'"\\*_а-яА-ЯёЁ ]*$/;

export const validateCardComment =
    /^[a-zA-Z0-9$@!?#^:;%'"\\*_а-яА-ЯёЁ][a-zA-Z0-9$@!?#^:;%'"\\*_а-яА-ЯёЁ \n]*$/;

export const validatePasswordRegExp = /^[a-zA-Z0-9$*@!?#^$&:;%_]{8,}$/;

export const validateEmailRegExp = /^\w+@\w+(\.)(\w+)$/;

export const validateInputTextRegExp = /^\w+$/;
