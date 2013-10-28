angular.module('system').controller('embed', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
  $scope.open = true;


  $rootScope.$on('escape-pressed', function () {
    $state.transitionTo('home');
    
  });

}]);