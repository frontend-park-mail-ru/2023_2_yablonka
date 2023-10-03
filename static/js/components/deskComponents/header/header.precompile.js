(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<header class=\"header\">\n    <div class=\"header__logo\">\n        <a class=\"logo-href\" href=\"#\">\n            <div class=\"logo-wrapper\">\n                <img\n                    class=\"logo-wrapper__logo\"\n                    src=\"../svg/logo.svg\"\n                    alt=\"This place for logo\"\n                />\n                <span class=\"logo-wrapper__tabula\">Tabula</span>\n            </div>\n        </a>\n    </div>\n    <div class=\"header__menu\">\n        <div class=\"menu__menu-list\">\n            <span class=\"projects__title\">Проекты</span>\n            <img class=\"chevron-down\" src=\"../svg/chevron-down.svg\" alt=\"\" />\n        </div>\n        <div class=\"menu__menu-list\">\n            <span class=\"favourites__title\">Избранное</span>\n            <img class=\"chevron-down\" src=\"../svg/chevron-down.svg\" alt=\"\" />\n        </div>\n        <div class=\"menu__menu-list\">\n            <span class=\"templates__title\">Шаблоны</span>\n            <img class=\"chevron-down\" src=\"../svg/chevron-down.svg\" alt=\"\" />\n        </div>\n        <button class=\"create-button\">Создать</button>\n    </div>\n    <div class=\"filler\"></div>\n    <div class=\"header__search\">\n        <div class=\"input-wrapper\">\n            <img src=\"../svg/search.svg\" alt=\"\" /><input\n                type=\"text\"\n                placeholder=\"Найти...\"\n            />\n        </div>\n        <div class=\"bell-wrapper\">\n            <img src=\"../svg/bell-notification.svg\" alt=\"\" />\n        </div>\n        <div class=\"avatar-wrapper\">\n            <img src=\""
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"avatar") : depth0), depth0))
    + "\" alt=\"\" />\n        </div>\n    </div>\n</header>";
},"useData":true});
})();