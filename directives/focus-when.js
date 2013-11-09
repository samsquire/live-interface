angular.module('system').directive('focusWhen', function () {
  return {
    link: function ($scope, $element, $attrs) {
        $scope.$watch($attrs.focusWhen, function (newValue) {
          if (newValue) {
            $(':focus').blur();

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
            $element.focus();
          }
        });
      }
  };
});