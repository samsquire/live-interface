angular.module('system').factory('ActiveDocument', [function () {

  function Document() {
    var self = this;
    self.fields = [];
    self.instances = [];
  }

  return new Document();
}]);