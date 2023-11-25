const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/**
 * Создает путь к файлу
 * @param {string} page - название страницы
 * @returns {string} - адрес(в файлах) страницы
 */
const createPath = (page) => path.resolve(__dirname, '../dist', `${page}.html`);

router.use(express.static(path.resolve(__dirname, '../dist')));

router.get('/questionnaire', (req, res) => {
    const filePath = createPath('questionnaire.html');
    if (!fs.existsSync(filePath)) {
        res.status(500).send('500. Internal server Error');
        return;
    }

    res.sendFile(filePath);
});

router.get('*', (req, res) => {
    const filePath = createPath('index');
    if (!fs.existsSync(filePath)) {
        res.status(500).send('500. Internal server Error');
        return;
    }

    res.sendFile(filePath);
});

module.exports = router;
