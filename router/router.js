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

/**
 * Проверяет, можно ли переходить по такому адресу
 * @param {string} view - название страницы
 * @returns {boolean} - true, если разрешено, false, если нет
 */

router.get('*', (req, res) => {
    const filePath = createPath('index');
    if (!fs.existsSync(filePath)) {
        res.status(500).send('500. Internal server Error');
        return;
    }

    res.sendFile(filePath);
});

module.exports = router;
