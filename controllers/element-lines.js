angular.module('system').controller('ElementLines', ['$q', '$rootScope', '$scope', 'page-lines',
  function ($q, $rootScope, $scope, pageLines) {

$scope.width = '960';
$scope.height = '2500';
$scope.visible = false;

$rootScope.$on('toggle-lines', function () {
  console.log('Toggling line');
  $scope.visible = !$scope.visible;
  pageLines.activate();
});

$scope.ready = $q.defer();
  
  // $scope.lines = pageLines.connections;
  $scope.ready.promise.then(function (p) {

    var tool = new p.Tool();

    tool.onMouseMove = function (event) {
      if (!pageLines.cancelled && $scope.visible) {
        var line = pageLines.connections[pageLines.connections.length - 1];
        line.firstSegment.point = event.point;
        p.view.draw();
      }
    };

    $rootScope.$on('stop-dependency', function () {
      console.log('Stopping lines');
      pageLines.finish();
      p.view.draw();
    });



    p.view.draw();
    

  });

}]);