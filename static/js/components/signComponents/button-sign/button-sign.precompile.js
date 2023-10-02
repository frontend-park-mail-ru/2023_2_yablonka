(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['button-sign.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<input type=\"submit\" class=\"button-sign\" value=\""
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"text") : depth0), depth0))
    + "\" />";
},"useData":true});
})();