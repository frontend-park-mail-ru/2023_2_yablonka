(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['guestWorkspace.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"workspace-card__desctiption\">\n    <img src=\"../svg/people.svg\" alt=\"\" /><span\n        class=\"workspace-owner__username\"\n    >"
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"username") : depth0), depth0))
    + " Workspace</span>\n</div>";
},"useData":true});
})();