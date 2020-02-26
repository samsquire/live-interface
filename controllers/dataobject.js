angular.module('system').controller("dataobject", ['$scope', '$rootScope', function ($scope, $rootScope) {

  $scope.keys = [];

  $scope.init = function (field, key) {
    $scope.field = field;
    $scope.key = key;
  };

  if (angular.isObject($scope.field[$scope.key])) {
    $scope.keys = Object.keys($scope.field[$scope.key]).filter(function (item) {
      return item.charAt(0) !== "$";
    });
  } else if (angular.isArray($scope.field[$scope.key])) {
    $scope.keys = $scope.field[$scope.key]; 
  }

  $scope.type = function (item) {
    return item.constructor.name;
  };
}]);