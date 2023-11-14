const popeventProcess = (e) => {
    if (e.target.closest('dialog')) {
        e.stopPropagation();
    } else {
        document.querySelectorAll('dialog').forEach((el) => {
            el.close();
        });
    }
};

export const addPopeventProcessListener = () => {
    document.querySelector('.page').addEventListener('click', popeventProcess);
};

export const removePopeventProcessListener = () => {
    document.querySelector('.page').removeEventListener('click', popeventProcess);
};
