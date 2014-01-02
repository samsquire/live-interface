angular.module('system').directive('carousel-scroll', function () {

  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {


      $element.bind('scroll', function () {
        console.log("scrolling");
      });
      $scope.$on('$destroy', function () {
        $element.unbind('scroll');
      });;

    }

  };

});