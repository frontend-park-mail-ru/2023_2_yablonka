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
import { WorkspaceMessage } from "/components/deskComponents/workspace-message/workspace-message.js";
import { AJAX } from "/components/core/ajax/ajax.js";
import { loginCheck } from "../components/core/routing/loginCheck.js";

/**
 * Класс для рендера страницы досок
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
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

    /**
     * Рендер досок пользователя
     * @param {Object} usersDesks - данные о досках(не своих), в которых пользователь участвует
     */

    #renderGuestWorspace(usersDesks) {
        const guestWorkspace = document.getElementById("guest");

        if (usersDesks === null) {
            const workspaceMessage = new WorkspaceMessage(guestWorkspace, {
                workspace: {
                    message:
                        "Вы пока что не добавлены ни в одно рабочее пространство.",
                },
            });
            workspaceMessage.render();
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
            const guestProjects =
                guestBoards.childNodes[uniqOwnersId.get(desk.owner_id)];
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

    /**
     * Рендер досок пользователя
     * @param {Object} usersDesks - данные о досках авторизованного пользователя
     */

    #renderOwnerWorkspace(usersDesks) {
        const yourWorkspace = document.getElementById("yours");

        if (usersDesks === null) {
            const workspaceMessage = new WorkspaceMessage(yourWorkspace, {
                workspace: {
                    message:
                        "Вы пока что не создали ни одно рабочее пространство.",
                },
            });
            workspaceMessage.render();
            const buttonCreateWorkspace = new ButtonCreateWorkspace(
                yourWorkspace.childNodes[0]
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

    /**
     * Рендер страницы в DOM
     */

    async renderPage() {
        this.#root.innerHTML = "";
        this.#root.style.backgroundColor = "";
        document.title = "Tabula: Ваши Доски";

        const data = await loginCheck();

        if (!data || "error_response" in data.body) {
            history.pushState(null, null, "signin");
            window.dispatchEvent(new PopStateEvent("popstate"));
            return;
        }

        const desksInformation = await AJAX(
            "http://213.219.215.40:8080/api/v1/user/boards/",
            "GET"
        )
            .then((res) => res.json())
            .catch((err) => null);

        const header = new Header(this.#root, {
            user: { avatar: data.body.user.thumbnail_url },
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

        this.#renderOwnerWorkspace(
            desksInformation.body.boards.user_owned_boards
        );
        this.#renderGuestWorspace(
            desksInformation.body.boards.user_guest_boards
        );

        this.#addEventListeners();
    }

    /**
     * Навешивание обработчиков событий на элементы страницы
     */

    #addEventListeners() {
        document
            .querySelector(".log-out")
            .addEventListener("click", async (e) => {
                const logout = await AJAX(
                    "http://213.219.215.40:8080/api/v1/auth/logout/",
                    "POST",
                    {}
                )
                    .then((res) => res)
                    .catch((err) => null);
                history.pushState(null, null, "signin");
                window.dispatchEvent(new PopStateEvent("popstate"));
            });
    }
}
