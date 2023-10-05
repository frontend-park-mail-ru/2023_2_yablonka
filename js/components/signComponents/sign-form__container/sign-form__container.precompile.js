(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
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
})();