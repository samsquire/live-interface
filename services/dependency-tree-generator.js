angular.module('system').service('DependencyTreeGenerator', [function () {
  
  function DependencyTreeGenerator() {
    var self = this;

    self.tree = function (domTree) {
      var embedded = domTree.find('a[rel=embedded]');
      var items = embedded.toArray().map(function (embeddedDom) {
        var $embeddedDom = $(embeddedDom);

        var item = {};
        item.instance = $embeddedDom.attr('href');
        item.kind = $embeddedDom.attr('data-kind');
        item.id = $embeddedDom.attr('data-id');

        return item;
      });

      console.log("items:", items);
    };


  };

  return new DependencyTreeGenerator();

}]);