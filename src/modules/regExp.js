export const hrefRegExp = /(^\w+:.+:\d+)|(^\w+:\/\/.+\/)/;

export const navigationPagesHrefRegExp = /^\/[a-zA-Z0-9]+$/;

export const boardHrefRegExp = /^\/workspace_\w+_board_\w+(_card_\w+)?$/;

export const validateObjectNameRegExp = /^[a-zA-Z0-9!?#^:;'"\\*_а-яА-ЯёЁ][a-zA-Z0-9!?#^:;'"\\*_а-яА-ЯёЁ ] +$/;

export const validatePasswordRegExp = /^[a-zA-Z0-9!?#^$&_]{8,}$/;

export const validateEmailRegExp = /^\w+@\w+(\.)(\w+)&/;

export const validateInputTextRegExp = /^\w+$/;
