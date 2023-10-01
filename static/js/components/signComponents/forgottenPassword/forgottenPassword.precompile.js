(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['forgottenPassword.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a class=\"href-forgotten-password\" href=\"#\">\n    "
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"text") : depth0), depth0))
    + "\n</a>";
},"useData":true});
})();