const popeventProcess = (e) => {
    if (e.target.closest('dialog')) {
        e.stopPropagation();
    } else {
        document.querySelectorAll('dialog').forEach((el) => {
            el.close();
        });
    }
};

export default popeventProcess;
