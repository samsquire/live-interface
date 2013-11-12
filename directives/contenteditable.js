angular.module('system').directive('contenteditable', function() {
  return {
    require: '?ngModel',
    link: function($scope, $element, attrs, ngModel) {
      if (!ngModel) {
        return;
      }
      // view -> model
      $element.on('blur', function () {
          ngModel.$setViewValue($element.html());
      });
      
      $element.on('keydown', function () {
        // can't seem to get this to update the model on each keypress, was hoping
        // this would change the laggy two way bindings
      });

      // Sometimes we want to use the original HTML and other
      // times we want to use what's already in the model.
      if (!$element.html()) {
        $element.html(ngModel.$viewValue);
      } else {
        ngModel.$setViewValue($element.html());
      }

      // model -> view
      ngModel.$render = function() {
        $element.html(ngModel.$viewValue);
      };
    }
  };
});