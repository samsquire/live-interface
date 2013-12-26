angular.module('system').factory('ActiveDocument', ['DocumentModel', function (DocumentModel) {
  return new DocumentModel();
}]);