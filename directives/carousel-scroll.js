angular.module('system').directive('carouselScroll', [function () {

  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      jQuery.data($element, "scroll-finished", true);
      var lastScroll = $element.scrollLeft();

      $element.on('hover', function () {
        $element.focus();
      })

      $element[0].addEventListener('mousewheel', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (jQuery.data($element, "scroll-finished")) {

          var newScroll = $(this).scrollLeft();
          console.log(event, lastScroll, newScroll);

          if (newScroll > lastScroll) {
            $scope.$eval($attrs.carouselScrollLeft);
          } else if (newScroll < lastScroll) {
            $scope.$eval($attrs.carouselScrollRight);
          }
          
          lastScroll = newScroll;
          $scope.$apply();
        }
      });

      $scope.$on('$destroy', function () {
        $element.unbind('scroll');
      });;

    }

  };

}]);