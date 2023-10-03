import { Header } from "../components/deskComponents/header/header.js";
import { Main } from "../components/deskComponents/main/main.js";
import { Sidebar } from "../components/deskComponents/sidebar/sidebar.js";
import { AllBoards } from "../components/deskComponents/all-boards/all-boards.js";
import { ContentHeaderName } from "../components/deskComponents/content__header-name/content__header-name.js";
import { ButtonCreateWorkspace } from "../components/deskComponents/button__create-workspace/button__create-workspace.js";
import { ContentBoardsList } from "../components/deskComponents/content__boards-list/content__boards-list.js";
import { BoardsListItem } from "../components/deskComponents/boards-list-item/boards-list-item.js";
import { WorkspaceCardDesctiption } from "../components/deskComponents/workspace-card__desctiption/workspace-card__desctiption.js";
import { BoardTitleLogo } from "../components/deskComponents/board-title__logo/board-title__logo.js";
import { AJAX } from "../components/core/ajax/ajax.js";

export class YourDesks {
    #root;

    constructor(rootElement) {
        this.#root = rootElement;
    }

    yourDesksConfig = {
        headerMenu: {
            headerMenu: {
                picture: "../img/avatar.jpg",
            },
        },
        content: {
            content: {},
        },
        sidebar: {
            sidebar: {},
        },
        allBoards: {
            allBoards: {},
        },
        contentHeader: {
            yours: {
                title: "ВАШИ РАБОЧИЕ ПРОСТРАНСТВА",
                id: "yours",
            },
            guest: {
                title: "ГОСТЕВЫЕ РАБОЧИЕ ПРОСТРАНСТВА",
                id: "guest",
            },
        },
        emptyWorkspaces: {
            emptyWorkspaces: {},
        },
        boardGuestList: {
            boardGuestList: {},
        },
        workspaceElements: {
            workspaceElement: {},
        },
        guestWorkspaces: {
            username: {
                username: "Smiley",
            },
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

        // const user=ajax('/auth/verify', {}, 'GET');

        history.pushState(null, null, "desks");

        const header = new Header(this.#root, this.yourDesksConfig.headerMenu);
        header.render();

        const main = new Main(this.#root, this.yourDesksConfig.content);
        main.render();

        const container = document.querySelector(".sticky-container");
        const sidebar = new Sidebar(container, this.yourDesksConfig.sidebar);
        sidebar.render();

        const allBoards = new AllBoards(
            container,
            this.yourDesksConfig.allBoards
        );
        allBoards.render();

        const contentContainer = document.querySelector(".content-container");

        const contentHeader = new ContentHeaderName(
            contentContainer,
            this.yourDesksConfig.contentHeader
        );
        contentHeader.render();

        const yourWorkspaces = document.querySelectorAll(
            ".content__description"
        );

        const buttonCreateWorkspace = new ButtonCreateWorkspace(
            yourWorkspaces[0],
            this.yourDesksConfig.emptyWorkspaces
        );
        buttonCreateWorkspace.render();

        const guestList = document.getElementById("guest");

        const contentBoardsList = new ContentBoardsList(
            guestList,
            this.yourDesksConfig.boardGuestList
        );
        contentBoardsList.render();

        const boardsList = document.querySelectorAll(".content__boards-list");

        const boardsListItem = new BoardsListItem(
            boardsList[boardsList.length - 1],
            this.yourDesksConfig.guestWorkspaces
        );
        boardsListItem.render();

        const workspaceCardDesctiption =
            guestList.querySelectorAll(".item__workspace");
        workspaceCardDesctiption.forEach((element) => {
            const guestNicknames = new WorkspaceCardDesctiption(
                element,
                this.yourDesksConfig.guestWorkspaces
            );
            guestNicknames.render();
        });

        workspaceCardDesctiption.forEach((element) => {
            const guestNicknames = new BoardTitleLogo(
                element,
                this.yourDesksConfig.desksList
            );
            guestNicknames.render();
        });
    }
}
