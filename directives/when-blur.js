angular.module('system').directive('whenBlur', function() {
  return {
    link: function($scope, $element, $attrs, $ctrl) {
      // view -> model
      $element.on('blur', function() {
        $scope.$apply(function() {
          $scope.$eval($attrs.whenBlur);
        });
      });

    }
  };
});