import { HeaderMenu } from "../components/deskComponents/headerMenu/headerMenu.js";
import { Content } from "../components/deskComponents/content/content.js";
import { Sidebar } from "../components/deskComponents/sidebar/sidebar.js";
import { AllBoards } from "../components/deskComponents/allBoards/allBoards.js";
import { ContentHeader } from "../components/deskComponents/contentHeader/contentHeader.js";
import { EmptyWorkspaces } from "../components/deskComponents/emptyWorkspaces/emptyWorkspaces.js";
import { BoardsList } from "../components/deskComponents/boardsList/boardsList.js";
import { WorkspaceElement } from "../components/deskComponents/workspaceElement/workspaceElement.js";
import { GuestWorkspace } from "../components/deskComponents/guestWorkspace/guestWorkspace.js";
import { Desk } from "../components/deskComponents/desk/desk.js";

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

        const header = new HeaderMenu(
            this.#root,
            this.yourDesksConfig.headerMenu
        );
        header.render();
        const content = new Content(this.#root, this.yourDesksConfig.content);
        content.render();
        const container = document.querySelector(".sticky-container");
        const sidebar = new Sidebar(container, this.yourDesksConfig.sidebar);
        sidebar.render();
        const allBoards = new AllBoards(
            container,
            this.yourDesksConfig.allBoards
        );
        allBoards.render();
        const contentContainer = document.querySelector(".content-container");
        const contentHeader = new ContentHeader(
            contentContainer,
            this.yourDesksConfig.contentHeader
        );
        contentHeader.render();
        const yourWorkspaces = document.querySelectorAll(
            ".content__description"
        );
        const emptyWorkspace = new EmptyWorkspaces(
            yourWorkspaces[0],
            this.yourDesksConfig.emptyWorkspaces
        );
        emptyWorkspace.render();

        const guestList = document.getElementById("guest");

        const boardGuestList = new BoardsList(
            guestList,
            this.yourDesksConfig.boardGuestList
        );
        boardGuestList.render();

        const boardsList = document.querySelectorAll(".content__boards-list");

        const boardsListItems = new WorkspaceElement(
            boardsList[boardsList.length - 1],
            this.yourDesksConfig.guestWorkspaces
        );
        boardsListItems.render();

        const guestWorkspaces = guestList.querySelectorAll(".item__workspace");
        guestWorkspaces.forEach((element) => {
            const guestNicknames = new GuestWorkspace(
                element,
                this.yourDesksConfig.guestWorkspaces
            );
            guestNicknames.render();
        });

        guestWorkspaces.forEach((element) => {
            const guestNicknames = new Desk(
                element,
                this.yourDesksConfig.desksList
            );
            guestNicknames.render();
        });
    }
}
