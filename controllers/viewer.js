angular.module('system').controller('viewer', ['$scope', 'demoData',
  function ($scope, demoData) {
    console.log('data from promise', demoData.data);
  angular.extend($scope, demoData.data);
}]);