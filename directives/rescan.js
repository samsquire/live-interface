angular.module('system').directive('rescan', [function () {
  return {
    restrict: 'A',

    link: function ($scope, $element, $attrs) {
      
      $element.bind('keyup', function (event) {

        if (event.which === 13 || event.which == 61) {
          $scope.$eval($attrs.rescanTarget);
          event.stopPropagation();
          event.stopImmediatePropagation();
          return false;
        }

      });

    }

  }


}])