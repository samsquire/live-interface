/**
This is an attempt to provide for widget encapsulation. Doesn't quite work unfortunately.
*/

angular.module('system').directive('iframe', function () {
  return {
    restrict: 'A',
    transclude: false,
    replace: true,
    link: function ($scope, $element, $attrs) {
      var iframe = $("<iframe></iframe>");
      iframe.attr('src', 'about:blank');  
      
      iframe.contents().find("html").html($element.html());
      $element.after(iframe);
    }





  }
});