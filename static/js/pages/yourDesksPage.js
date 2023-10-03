import { Header } from "/components/deskComponents/header/header.js";
import { Main } from "/components/deskComponents/main/main.js";
import { Sidebar } from "/components/deskComponents/sidebar/sidebar.js";
import { AllBoards } from "/components/deskComponents/all-boards/all-boards.js";
import { ContentHeaderName } from "/components/deskComponents/content__header-name/content__header-name.js";
import { ButtonCreateWorkspace } from "/components/deskComponents/button__create-workspace/button__create-workspace.js";
import { ContentBoardsList } from "/components/deskComponents/content__boards-list/content__boards-list.js";
import { BoardsListItem } from "/components/deskComponents/boards-list-item/boards-list-item.js";
import { WorkspaceCardDesctiption } from "/components/deskComponents/workspace-card__desctiption/workspace-card__desctiption.js";
import { BoardTitleLogo } from "/components/deskComponents/board-title__logo/board-title__logo.js";
import { AJAX } from "/components/core/ajax/ajax.js";

export class YourDesks {
    #root;
    //Тут в конструктор надо передавать объект ещё, чтобы в конфиг его отправить для дальнейшего рендера
    constructor(rootElement) {
        this.#root = rootElement;
    }

    yourDesksConfig = {
        header: {
            header: {
                picture: "/img/avatar.jpg",
            },
        },
        contentHeaderName: {
            yours: {
                title: "ВАШИ РАБОЧИЕ ПРОСТРАНСТВА",
                id: "yours",
            },
            guest: {
                title: "ГОСТЕВЫЕ РАБОЧИЕ ПРОСТРАНСТВА",
                id: "guest",
            },
        },
        boardGuestList: {
            boardGuestList: {},
        },
        desksList: {
            desk: {
                href: "",
                name: "Smiley",
            },
        },
    };

    renderPage() {
        this.#root.innerHTML = "";
        this.#root.style.backgroundColor = "";
        document.title = "Tabula: Ваши Доски";

        //Тут я просто не понимаю логику досок, допиши, как можешь
        //Тебе надо послать аякс как Никита говорил, распарсить его
        //В случае ошибки рендеришь, что нет рабочих пространств
        //В случае удачи смотришь на тело запроса. если null, то см. пункт выше
        //Если не null, то рендер.
        //Придется немного менять поля в компонентах

        history.pushState(null, null, "desks");

        const userInformation = async function f() {
            return await AJAX(
                "http://localhost:8080/api/v1/user/boards/",
                "POST",
                {}
            );
        };

        let userInformationJSON = JSON.parse(userInformation);

        const header = new Header(this.#root, this.yourDesksConfig.header);
        header.render();

        const main = new Main(this.#root);
        main.render();

        const container = document.querySelector(".sticky-container");
        const sidebar = new Sidebar(container);
        sidebar.render();

        const allBoards = new AllBoards(container);
        allBoards.render();

        const contentContainer = document.querySelector(".content-container");

        const contentHeaderName = new ContentHeaderName(
            contentContainer,
            this.yourDesksConfig.contentHeaderName
        );
        contentHeaderName.render();

        const yourWorkspaces = document.querySelectorAll(
            ".content__description"
        );

        if (userInformationJSON.user_guest_boards.length == 0) {
            const buttonCreateWorkspace = new ButtonCreateWorkspace(
                yourWorkspaces[1]
            );
            buttonCreateWorkspace.render();
        } else {
            const guestList = document.getElementById("guest");

            const contentBoardsList = new ContentBoardsList(guestList);
            contentBoardsList.render();

            const boardsList = document.querySelectorAll(
                ".content__boards-list"
            );

            const uniqOwnersId = new Map();
            let usersNumbers = 0;

            for (let desk of userInformationJSON.user_guest_boards.sort(
                (f, s) => f.owner_id < s.owner_id
            )) {
                if (!uniqOwnersId.has(desk.owner_id)) {
                    uniqOwnersId.set(desk.owner_id, usersNumbers);
                    ++usersNumbers;
                    const boardsListItem = new BoardsListItem(
                        boardsList[boardsList.length - 1]
                    );
                    boardsListItem.render();
                    
                } else {
                    const boardTitleLogo = new BoardTitleLogo(
                        boardsList[boardsList.length - 1].childNodes[
                            uniqOwnersId.get(desk.owner_id)
                        ],
                        {
                            data: {
                                userDeskInform: {
                                    name: desk.board_info.board_name,
                                    image: desk.board_info.thumbnail.url,
                                },
                            },
                        }
                    );
                    boardTitleLogo.render();
                }
            }
        }
    }
}
