angular.module('system').directive('carousel', ['$timeout', function ($timeout) {

  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {

      var carouselPosition = $attrs.carousel;
      var items = $element.find(".type-carousel").children("li");

      var done = {
            complete: function () {
              console.log("Finished animation");

              $timeout(function () {
                console.log("done");
                jQuery.data($element, "scroll-finished", true);
              }, 400);
            }
          };

      $scope.$watch($attrs.carousel, function (next, prev) {
        jQuery.data($element, "scroll-finished", false);
        var last = 0;
        items.each(function () {
          $(this).css('left', last);
          last += $(this).outerWidth();
        });
        var positions = [];
        if (positions.length === 0) {
          last = 0;
          items.each(function () {
            positions.push(last);
            last += $(this).outerWidth();
          });
        }

        
        if (next < prev) {
          $element.animate({scrollLeft: positions[next] + 'px'}, done);
        } else if (next > prev) {
          $element.animate({scrollLeft: positions[next] + 'px'}, done);
        }




      });

    }

  };

}]);