(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['board-title__logo.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n<a class=\"board-title__logo\" style=\"background-image: url('"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"image") : depth0), depth0))
    + "');\" href=\"#\">\n    <div>\n        <span>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "</span>\n    </div>\n</a>";
},"useData":true});
})();