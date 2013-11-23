angular.module('system').directive('sidebar', function () {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      $element.sidebar() ;
      $element.sidebar('attach events', '.toggle.sidebar') ;
      $element.removeClass('disabled');
    }
  }
});