angular.module('system').controller('create-relation',
  ['$scope', '$rootScope', '$state',
  function ($scope, $rootScope, $state) {

    $scope.$parent.choosing = false;
    $scope.$parent.createRelation = true;

    $scope.$on('$destroy', function () {
      $scope.$parent.choosing = true;      
      $scope.$parent.createRelation = false;
    });

    $scope.subject = "";
    $scope.predicate = "";
    $scope.object = "";


    $scope.createRelation = function () {

      $rootScope.$emit('embed', {
        kind: 'relation',
        subject: $scope.subject,
        predicate: $scope.predicate,
        object: $scope.object
      });
      $state.transitionTo('home');
    };
}]);