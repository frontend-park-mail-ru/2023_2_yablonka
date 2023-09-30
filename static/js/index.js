"use strict";

import { Image } from "./components/backgroundImage/BackgroundImage.js";

const root = document.querySelector(".page");

const signupConfig = {
    images: {
        left: {
            side: "left",
            picture: "undraw_performance_overview",
        },
        right: {
            side: "right",
            picture: "undraw_team_collaboration",
        },
    },
};

const images = new Image(root, config.images);
images.render();
