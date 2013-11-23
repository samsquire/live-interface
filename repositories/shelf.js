angular.module('system').factory('shelfRepository', [function () {
  
  function ShelfRepository() {
    var self = this;

    self.items = [];
  }

  return new ShelfRepository();

}]);