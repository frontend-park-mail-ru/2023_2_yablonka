(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sidebar.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<nav class=\"sidebar\">\n    <div>\n        <ul class=\"sidebar__menu\">\n            <li class=\"menu-item selected\">\n                <a href=\"\"><img src=\"../svg/board.svg\" alt=\"\" /><span\n                    >Доски</span>\n                </a>\n            </li>\n            <li class=\"menu-item\">\n                <a href=\"\">\n                    <img src=\"../svg/files.svg\" alt=\"\" /><span>Шаблоны</span>\n                </a>\n            </li>\n            <li class=\"menu-item\">\n                <a href=\"\">\n                    <img src=\"../svg/clipboard-pulse.svg\" alt=\"\" /><span>Главная\n                        страница</span>\n                </a>\n            </li>\n        </ul>\n    </div>\n    <div class=\"create-workspace\">\n        <ul>\n            <div class=\"create-workspace__title\">\n                <span>Рабочие пространства</span>\n            </div>\n            <button class=\"create-workspace__button\">\n                <img src=\"../svg/plus.svg\" alt=\"\" /><span>Создайте рабочее\n                    пространство</span>\n            </button>\n        </ul>\n    </div>\n</nav>";
},"useData":true});
})();