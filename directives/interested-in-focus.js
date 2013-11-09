angular.module('system').directive('interestedInFocus', function () {
  return {
    link: function ($scope, $element, $attrs) {
        $element.on('focus', function () {
          $scope[$attrs.interestedInFocus] = true;
        });

        $element.on('blur', function () {
          $scope[$attrs.interestedInFocus] = false;
        });


      }
    };
});