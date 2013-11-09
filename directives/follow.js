angular.module('system').directive('follow', function () {
  return function (scope, element, attrs) {
    element.bind('click keyup keydown', function (event) {
      
      var sel = window.getSelection();
      if (sel.rangeCount === 0) {
        return true;
      }
      var rects = sel.getRangeAt(0).getClientRects();
      if (rects.length === 0) {
        return true;
      }
      var pos = rects[0];
      var dropdown = $(attrs.follow);

      pos = _.pick(pos, ['left', 'top']);
      
      // console.log("Keypress:", $(this).text(), sel, sel.focusNode, $(sel.focusNode.parentElement).position());
      var rightEdge = pos.left + dropdown.width();
      
      var windowWidth = $(window).width() - 20;
      
      if (rightEdge >= windowWidth) {
        console.log("Over the edge,", rightEdge, windowWidth, pos);
        var newLeft = pos.left - (rightEdge - windowWidth);
        pos.left = newLeft;
        
      }
      
      dropdown.css(pos);
      
      
      return true;
    });
  };
});