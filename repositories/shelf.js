angular.module('system').factory('shelfRepository', [function () {
  
  function ShelfRepository() {
    var self = this;

    self.items = [];
    self.objects = [];
  }

  return new ShelfRepository();

}]);