const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/**
 * Создает путь к файлу
 * @param {string} page - название страницы
 * @returns {string} - адрес(в файлах) страницы
 */
const createPath = (page) => path.resolve(__dirname, '../static/html', `${page}.html`);

router.use(express.static(path.resolve(__dirname, '../static/css')));
router.use(express.static(path.resolve(__dirname, '../static/img')));
router.use(express.static(path.resolve(__dirname, '../static/svg')));
router.use(express.static(path.resolve(__dirname, '../js')));

/**
 * Проверяет, можно ли переходить по такому адресу
 * @param {string} view - название страницы
 * @returns {boolean} - true, если разрешено, false, если нет
 */

function findView(view) {
    const views = ['signup', 'signin', 'desks'];

    for (let i = 0; i, views.length; ++i) {
        if (views[i] == view) return true;
    }

    return false;
}

router.get('*', (req, res) => {
    const filePath = createPath('index');
    if (!fs.existsSync(filePath)) {
        res.status(500).send('500. Internal server Error');
        return;
    }

    res.sendFile(filePath);
});

router.get('/:view?', (req, res) => {
    const view = req.params.view;
    let filePath;

    if (view == '/' || !view) {
        filePath = createPath('index');
    } else if (findView(view)) {
        filePath = createPath('index');
    }

    if (!fs.existsSync(filePath)) {
        res.status(500).send('500. Internal server Error');
        return;
    }

    res.sendFile(filePath);
});

module.exports = router;
