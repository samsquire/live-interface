angular.module('system').directive('follow', function () {
  return function (scope, element, attrs) {
    $(element).on('click keydown selectionchange', function (event) {
      
      var sel = window.getSelection();
      
      if (sel.rangeCount === 0) {
        return true;
      }
      var rects = sel.getRangeAt(0).getClientRects();
      var pos;
      obj = sel;

      if (rects.length === 0) {
        pos = $(sel.focusNode).offset();
      } else {  
        pos = rects[0];
      }
      
      
      var dropdown = $(attrs.follow);

      pos = _.pick(pos, ['left', 'top']);
      if (rects.length) {
        // range.getClientRects is meant to consider the scroll position unless
        // i'm actually undoing it
        pos.top += $(document.body).scrollTop();
      }
      
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