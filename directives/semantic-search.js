angular.module('system').directive('semanticSearch', [function () {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      console.log('semantic search');
      $element.on('keyup', function (event) {
        if (event.which === 187) {
          console.log('equals')
          $scope.$eval($attrs.semanticSearch);
          $scope.$apply();
        }
      });
    }
  };
}]);