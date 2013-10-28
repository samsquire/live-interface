angular.module('system').directive('contenteditable', function() {
  return {
    require: '?ngModel',
    link: function(scope, elm, attrs, ngModel) {
      if (!ngModel) {
        console.log('exit');
        return;
      }
      // view -> model
      elm.on('blur', function() {
          ngModel.$setViewValue(elm.html());
      });
      
      // model -> view
      ngModel.$render = function() {
        elm.html(ngModel.$viewValue);
      };
 
      // load init value from DOM
      elm.html(ngModel.$viewValue);
    }
  };
});