angular.module('system').directive('paper', [function () {

return {
  link: function ($scope, $element, $attrs) {

    var paperScope = new paper.PaperScope();
    var canvas = $element[0];

    canvas.height = $scope.height;
    canvas.width = $scope.width;
    paperScope.setup(canvas);

    $scope.ready.resolve(paperScope);
  }
};
}]);