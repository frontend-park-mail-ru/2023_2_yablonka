(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
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
})();