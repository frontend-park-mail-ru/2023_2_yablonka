(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['all-boards.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"all-boards\">\n    <div class=\"all-boards__content\">\n        <div class=\"content-container\">\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['board-title__logo.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a class=\"board-title__logo\" style=\"background-image: url('"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"image") : depth0), depth0))
    + "');\" id=\"#\">\n    <div>\n        <span>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "</span>\n    </div>\n</a>";
},"useData":true});
templates['boards-list-item.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"boards-list-item\">\n    <div class=\"item__workspace\">\n    </div>\n</li>";
},"useData":true});
templates['boards-logo.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"boards-logo\"></div>";
},"useData":true});
templates['button__create-workspace.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<button class=\"button__create-workspace\" type=\"button\">\n    &nbsp;Создать рабочее пространство\n</button>";
},"useData":true});
templates['content__boards-list.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<ul class=\"content__boards-list\"></ul>";
},"useData":true});
templates['content__header-name.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h3 class=\"content__header-name\">"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"title") : depth0), depth0))
    + "</h3>\n<div id=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"id") : depth0), depth0))
    + "\" class=\"content__description\"></div>";
},"useData":true});
templates['header.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<header class=\"header\">\n    <div class=\"header__logo\">\n        <a class=\"logo-href\" href=\"/\">\n            <div class=\"logo-wrapper\">\n                <img\n                    class=\"logo-wrapper__logo\"\n                    src=\"logo.svg\"\n                    alt=\"This place for logo\"\n                />\n                <span class=\"logo-wrapper__tabula\">Tabula</span>\n            </div>\n        </a>\n    </div>\n    <div class=\"header__menu\">\n        <div class=\"menu__menu-list\">\n            <span class=\"projects__title\">Проекты</span>\n            <img class=\"chevron-down\" src=\"chevron-down.svg\" alt=\"\" />\n        </div>\n        <div class=\"menu__menu-list\">\n            <span class=\"favourites__title\">Избранное</span>\n            <img class=\"chevron-down\" src=\"chevron-down.svg\" alt=\"\" />\n        </div>\n        <div class=\"menu__menu-list\">\n            <span class=\"templates__title\">Шаблоны</span>\n            <img class=\"chevron-down\" src=\"chevron-down.svg\" alt=\"\" />\n        </div>\n        <button class=\"create-button\">Создать</button>\n    </div>\n    <div class=\"filler\"></div>\n    <div class=\"header__search\">\n        <div class=\"input-wrapper\">\n            <img src=\"search.svg\" alt=\"\" /><input\n                type=\"text\"\n                placeholder=\"Найти...\"\n            />\n        </div>\n        <div class=\"bell-wrapper\">\n            <img src=\"bell-notification.svg\" alt=\"\" />\n        </div>\n        <div class=\"avatar-wrapper\">\n            <img class=\"avatar\" src=\""
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"avatar") : depth0), depth0))
    + "\" alt=\"Avatar\" />\n        </div>\n        <div class=\"log-out-wrapper\">\n            <img class=\"log-out\" src=\"exit.svg\" alt=\"Выход\" />\n        </div>\n    </div>\n</header>";
},"useData":true});
templates['main.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<main>\n    <div class=\"content\">\n        <div class=\"sticky-container\">\n        </div>\n    </div>\n</main>";
},"useData":true});
templates['sidebar.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<nav class=\"sidebar\">\n    <div>\n        <ul class=\"sidebar__menu\">\n            <li class=\"menu-item selected\">\n                <a disabled><img src=\"board.svg\" alt=\"\" /><span>Доски</span>\n                </a>\n            </li>\n            <li class=\"menu-item\">\n                <a disabled>\n                    <img src=\"files.svg\" alt=\"\" /><span>Шаблоны</span>\n                </a>\n            </li>\n            <li class=\"menu-item\">\n                <a disabled>\n                    <img src=\"clipboard-pulse.svg\" alt=\"\" /><span>Главная\n                        страница</span>\n                </a>\n            </li>\n        </ul>\n    </div>\n    <div class=\"create-workspace\">\n        <ul>\n            <div class=\"create-workspace__title\">\n                <span>Рабочие пространства</span>\n            </div>\n            <button class=\"create-workspace__button\">\n                <img src=\"plus.svg\" alt=\"\" /><span>Создайте рабочее пространство</span>\n            </button>\n        </ul>\n    </div>\n</nav>";
},"useData":true});
templates['workspace-card__desctiption.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"workspace-card__desctiption\">\n    <img src=\"people.svg\" alt=\"\" /><span\n        class=\"workspace-owner__username\"\n    >"
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + " Workspace</span>\n</div>";
},"useData":true});
templates['workspace-message.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"workspace-message\">"
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"message") : depth0), depth0))
    + "</span>";
},"useData":true});
templates['button-sign.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<input\n    type=\"submit\"\n    class=\"button-sign\"\n    value=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"text") : depth0), depth0))
    + "\"\n    id=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"id") : depth0), depth0))
    + "\"\n/>";
},"useData":true});
templates['error-message.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"error-message\"></div>";
},"useData":true});
templates['href-forgotten-password.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a class=\"href-forgotten-password\" id=\"\">\n    "
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"text") : depth0), depth0))
    + "\n</a>";
},"useData":true});
templates['href-sign.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a class=\"href-sign\" id=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"url") : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"text") : depth0), depth0))
    + "</a>";
},"useData":true});
templates['page__image.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<img class=\"page__image page__image_"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"side") : depth0), depth0))
    + "\" src=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"picture") : depth0), depth0))
    + ".svg\" />";
},"useData":true});
templates['sign-form__container.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"sign-form__container\">\n    <img src=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"icon") : depth0), depth0))
    + ".svg\" />\n    <input\n        type=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"type") : depth0), depth0))
    + "\"\n        input-type=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"inputType") : depth0), depth0))
    + "\"\n        class=\"sign-form__input\"\n        placeholder=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"placeholder") : depth0), depth0))
    + "\"\n    />\n</div>";
},"useData":true});
templates['sign-form.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<form class=\"sign-form sign-form_centered\" action=\"/\" method=\"post\" enctype=\"application/x-www-form-urlencoded\"></form>";
},"useData":true});
templates['sign-location__header-title.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h2 class=\"sign-location__header-title\">"
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"title") : depth0), depth0))
    + "</h2>";
},"useData":true});
templates['sign-location__header.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h1 class=\"sign-location__header\">\n    <img src=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"logo") : depth0), depth0))
    + ".svg\" />\n    <span class=\"sign-location__name\">"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"title") : depth0), depth0))
    + "</span>\n</h1>";
},"useData":true});
templates['sign-location.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"sign-location\"></div>\n";
},"useData":true});
})();