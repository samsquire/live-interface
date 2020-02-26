angular.module('system').directive('packery', function () {
return function ($scope, $element, $attrs) {

  var packeryConfig = {
    "itemSelector": $attrs.packery,
    "gutter": 10
  };

 $scope.packery = new Packery($element[0], packeryConfig);

  $(document).on('ready', function () {
    $scope.packery.layout();
  });

  };
});

angular.module('system').directive('relayout', function () {
return function ($scope, $element, $attrs) {
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {   
      $scope.packery.reloadItems();
      $scope.packery.layout();
    });
  };
});

angular.module('system').directive('prepended', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
            $scope.packery.prepended($element);
        }
    }
});


var module = angular.module('system').directive('ngRepeatCallback', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});