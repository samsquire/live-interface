angular.module('system').directive('a', function () {
  return {
    restrict: 'E',
    link: function ($scope, $element, $attrs) {
      console.log($element.attr('rel'));
    }
  };
});