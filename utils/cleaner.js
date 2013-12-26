angular.module('system').service('cleaner', function () {
  this.filter = function (text) {
    var contents = $($.parseHTML(text));
    var elements = $('<div>').append(contents);
    var removed = elements.find(".embedded-context").remove();
    console.log(elements.find(".ng-scope").removeClass("ng-scope"));
    console.log();
    console.log("Removed", elements.html());
    console.log();
    return elements;
  }
});