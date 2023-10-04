# 2023_2_yablonka
Фронтенд-репозиторий проекта Trello команды Яблонька

## Деплой

TDB

## API

TBD

## Авторы

* [**Глеб Макаренко**](https://github.com/Glibusss) - *Фронтенд*
* [**Даниил Капитанов**](https://github.com/SmileyTheSmile) - *Бекенд*
* [**Владислав Фоменко**](https://github.com/wolpy01) - *Фронтенд*
* [**Никита Архаров**](https://github.com/bqback) - *Бекенд*

## Менторы
- [Ларкин Егор](https://github.com/WhoIsYgim) - *Бекенд*

- [Александр Салтыков](https://github.com/johnSamilin) - *Фронтенд*

- Анастасия Теренюк - *UX*

## Ссылка на backend

[https://github.com/go-park-mail-ru/2023_2_yablonka](https://github.com/go-park-mail-ru/2023_2_yablonka)


## Правила форматирования

Используется линтер Prettier, camelCase для объявлений.

Prettier - расширение для VSCode. Рекомендуется работать в нём

## Компиляция шаблонов

В папке tools запустить precompiler.bash. 

Важно! Он работает ТОЛЬКО на Linux и macOS

## Развёртывание проекта

Необходимо: Node.js v20.8.0
Под неё express v4.18.2, handlebars v4.7.8

Рекомендуется также установить nodemon как Dev dependency, чтобы пользоваться Hot Reload
Для установки express, handlebars - команда npm i(или install) express handlebars
Для установки nodemon - npm i -D nodemon

Сервер релизный запускается по команде npm start

Отладочный - на nodemon с помощью npm run debug

Клонирование репозитория:
Чтобы склонировать репозиторий, нужно написать в терминале команду
git clone https://github.com/frontend-park-mail-ru/2023_2_yablonka.git

## Полезные ссылки

[Notion](https://believed-college-f64.notion.site/f7d304324e35400b92ba7260dd39ef72)
[Trello](https://trello.com/b/69bYb5vB/la-tabula)

## Организация веток

Для каждой задачи выделяется отдельная ветка(отпочковывается в зависимости от контекста задачи).
Название: переходим на карточку в Trello и в url смотрим название задачи(пример: 15-создание-авторизации) - это название ветки. 
Чтобы переключиться на ветку с названием ветки(например, br) нужно написать в терминале git checkout br
