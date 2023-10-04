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
import { BoardsLogo } from "/components/deskComponents/boards-logo/boards-logo.js";
import { AJAX } from "/components/core/ajax/ajax.js";

export class YourDesks {
    #root;
    constructor(rootElement) {
        this.#root = rootElement;
    }

    yourDesksConfig = {
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

        const contentBoardsList = new ContentBoardsList(guestWorkspace);
        contentBoardsList.render();

        const guestBoards = guestWorkspace.childNodes[0];

        const uniqOwnersId = new Map();
        let userWorkspaceNumber = 0;

        for (let desk of usersDesks) {
            if (!uniqOwnersId.has(desk.owner_id)) {
                uniqOwnersId.set(desk.owner_id, userWorkspaceNumber);
                ++userWorkspaceNumber;

                const boardsListItem = new BoardsListItem(guestBoards);
                boardsListItem.render();

                const boardsImages = guestBoards.childNodes[0];

                const workspaceCardDesctiption = new WorkspaceCardDesctiption(
                    boardsImages,
                    {
                        user: {
                            name: desk.owner_email,
                        },
                    }
                );
                workspaceCardDesctiption.render();

                const boardsLogo = new BoardsLogo(boardsImages);
                boardsLogo.render();
            }
            const guestProjects = guestBoards.childNodes[uniqOwnersId.get(desk.owner_id)];
            const boardTitleLogo = new BoardTitleLogo(
                guestProjects.childNodes[guestProjects.childNodes.length - 1],
                {
                    userDeskInform: {
                        name: desk.board_info.board_name,
                        image: desk.board_info.thumbnail_url,
                    },
                }
            );
            boardTitleLogo.render();
        }
    }

    #renderOwnerWorkspace(usersDesks) {
        const yourWorkspace = document.getElementById("yours");

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

        const boardsImages = yourBoards.childNodes[0];

        const boardsLogo = new BoardsLogo(boardsImages);
        boardsLogo.render();

        for (let desk of usersDesks) {
            const boardTitleLogo = new BoardTitleLogo(
                boardsImages.childNodes[boardsImages.childNodes.length - 1],
                {
                    userDeskInform: {
                        name: desk.board_name,
                        image: desk.thumbnail_url,
                    },
                }
            );
            boardTitleLogo.render();
        }
    }

    async renderPage(user) {
        this.#root.innerHTML = "";
        this.#root.style.backgroundColor = "";
        document.title = "Tabula: Ваши Доски";

        history.pushState(null, null, "desks");

        const desksInformation = await AJAX(
            "http://localhost:8080/api/v1/user/boards/",
            "GET"
        )
            .then((res) => res.json())
            .catch((err) => null);

        const header = new Header(this.#root, {
            user: { avatar: user.thumbnail_url },
        });
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
        console.log(desksInformation.body.boards.user_owned_boards);

        this.#renderOwnerWorkspace(
            desksInformation.body.boards.user_owned_boards
        );
        this.#renderGuestWorspace(
            desksInformation.body.boards.user_guest_boards
        );
    }
}
