angular.module('system').controller('sidebar', ['$scope', 'ActiveDocument', function ($scope, ActiveDocument) {
  $scope.structure = ActiveDocument;
  console.log('sidebar');
}]);