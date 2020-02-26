angular.module('system').directive('savePosition', ['page-lines', function (pageLines) {
  return {
    link: function ($scope, $element, $attrs) {
      $scope.position = {left: 0, top: 0};

      $scope.$watch($attrs.savePosition, function (newValue) {
        $scope.position = $element.offset();
        // console.log('Setting position', $scope.position);
      });

      var listener = $scope.$watch('position', function (newPosition) {
        // console.log("position updated to", newPosition);

        if (!pageLines.cancelled) {
          pageLines.connections.forEach(function (line) {
            line.lastSegment.point.x = newPosition.left + 25;
            line.lastSegment.point.y = newPosition.top + 25;
          });
        }


      });



    }



  };
}]);