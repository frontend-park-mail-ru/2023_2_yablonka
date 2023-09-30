(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['BackgroundImage.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<img\n        class=\"page__image page__image_"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"side") : depth0), depth0))
    + "\"\n        src=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"picture") : depth0), depth0))
    + ".svg\"\n      />";
},"useData":true});
})();