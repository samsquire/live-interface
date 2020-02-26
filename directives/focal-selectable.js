angular.module('system').directive('focalSelectable', [function () {
  return {
    restrict: 'A',

    link: function ($scope, $element, $attrs) {
      console.log("focal point linked");
      $element.bind('click', function (event) {
        console.log("adjusting focal point");
        $($element.prevAll()).toggleClass("leftward");
        $($element.nextAll()).toggleClass("rightward");
        var offset = $($element.nextAll().get(0)).offset().top;
        $($element.nextAll()).each(function () {
          
          if ($(this).css('top') !== "0px") {
            offset = 0
          }
          console.log(offset);
          $(this).css('top', -offset + "px")
        });


        $element.toggleClass("focal-point");
        
        if ($($element).css('top') !== "0px") {
          newTop = 0;
        } else {
          newTop = $($element).offset().top;
        }
        console.log(newTop);
        $element.css('top', -newTop + "px");
        
        var parent = $element.parent();
        parent.attr('contenteditable', parent.attr('contenteditable') === 'true' ? 'false' : 'true' );
      });

    }

  }


}])