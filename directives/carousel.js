angular.module('system').directive('carousel', function () {

  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {

      var carouselPosition = $attrs.carousel;

      $scope.$watch($attrs.carousel, function (next, prev) {
        var last = 0;
        $element.children().each(function () {
          $(this).css('left', last);
          last += $(this).outerWidth();
        });


        if (next < prev) {
          console.log("prev item in carousel", $element.css('left'));
          var nextWidth = $element.children().eq(next).outerWidth();
          $element.animate({left: parseInt($element.css('left'), 10) + nextWidth + 'px'});
        } else if (next > prev) {
          console.log("next item in carousel", $element.css('left'));
          var nextWidth = $element.children().eq(prev).outerWidth();
          $element.animate({left: parseInt($element.css('left'), 10) - nextWidth + 'px'});
          // $element.children().eq(1).prependTo($element);
        }




      });

    }

  };

});