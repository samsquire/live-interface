angular.module('system').directive('focusWhen', function () {
  return {
    link: function ($scope, $element, $attrs) {
        $scope.$watch($attrs.focusWhen, function (newValue, oldValue) {
          
          if (newValue) {
            var currentlyFocused = $(':focus');
            if ($element !== currentlyFocused) {
              currentlyFocused.blur();
            }

            if ($scope.focusNode) {
              var focusNode = $scope.focusNode;
              
              var offset = focusNode.length - 1;
              
              var range = document.createRange();
              var sel = window.getSelection();
              range.collapse(true);
              range.setStart(focusNode, offset);
              sel.removeAllRanges();
              sel.addRange(range);
              $scope.focusNode = null;
              return;
            }
            if ($scope.range) {
              // var sel = window.getSelection();
              // sel.removeAllRanges();
              // sel.addRange($scope.range);
              var sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange($scope.range);
            } else {
              $element.focus();
            }
          }
        });
      }
  };
});