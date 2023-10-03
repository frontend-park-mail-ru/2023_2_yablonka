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
    };

    #renderGuestWorspace(usersDesks) {
        const guestWorkspace = document.getElementById("guest");

        if (usersDesks.length == 0) {
            const buttonCreateWorkspace = new ButtonCreateWorkspace(
                guestWorkspace
            );
            buttonCreateWorkspace.render();
            return;
        }

        const contentBoardsList = new ContentBoardsList(guestList);
        contentBoardsList.render();

        const guestBoards = guestWorkspace.childNodes[0];

        const uniqOwnersId = new Map();
        let userWorkspaceNumber = 0;

        for (let desk of usersDesks.user_guest_boards) {
            if (!uniqOwnersId.has(desk.owner_id)) {
                uniqOwnersId.set(desk.owner_id, usersNumbers);
                ++userWorkspaceNumber;

                const boardsListItem = new BoardsListItem(guestBoards);
                boardsListItem.render();

                const workspaceCardDesctiption = new WorkspaceCardDesctiption(
                    guestBoards.childNodes[uniqOwnersId.get(desk.owner_id)],
                    {
                        data: {
                            userWorkspaceInform: {
                                name: desk.board_name.email,
                            },
                        },
                    }
                );
                workspaceCardDesctiption.render();
            }
            const boardTitleLogo = new BoardTitleLogo(
                guestBoards.childNodes[uniqOwnersId.get(desk.owner_id)],
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

    #renderOwnerWorkspace(usersDesks) {
        const yourWorkspace = document.getElementById("your");

        if (usersDesks.length == 0) {
            const buttonCreateWorkspace = new ButtonCreateWorkspace(
                yourWorkspace
            );
            buttonCreateWorkspace.render();
            return;
        }
        const contentBoardsList = new ContentBoardsList(yourWorkspace);
        contentBoardsList.render();

        const yourBoards = yourWorkspace.childNodes[0];

        const boardsListItem = new BoardsListItem(yourBoards);
        boardsListItem.render();

        for (let desk of usersDesks.user_guest_boards) {
            const boardTitleLogo = new BoardTitleLogo(
                yourBoards.childNodes[0],
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

        this.#renderOwnerWorkspace(userInformationJSON.user_owned_boards);
        this.#renderGuestWorspace(userInformationJSON.user_guest_boards);
    }
}
