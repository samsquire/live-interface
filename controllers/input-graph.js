angular.module('system').controller('InputGraph', ['$q', '$scope', 'page-lines',
  function ($q, $scope, pageLines) {

  $scope.ready = $q.defer();
  $scope.width = '350';
  $scope.height = '50';
  $scope.inputs = pageLines.inputs;
  $scope.circles = [];
  $scope.segments = [];
  $scope.ready.promise.then(function (p) {

      // create the output circle
      var outPoint = new p.Point(320, 25);
          var outCircle = new p.Path.Circle({
            center: outPoint,
            radius: 15,
            strokeColor: 'blue',
            strokeWidth: 3,
            fillColor: 'white'
          });

    var meetPoint = new p.Point(50, 0);
    var opPoint = meetPoint.add([10, 0]);
    var flow = p.Path.Line(meetPoint, opPoint);
    flow.strokeColor = 'green';
    flow.strokeWidth = 3;
    $scope.$watch('inputs', function (newValue) {
      var lasty = 5;
      var pointDistance = 10;
      var midway = (lasty + pointDistance * $scope.inputs.length) / 2;
      meetPoint.y = midway;
      flow.segments[1].point.y = midway;
      flow.segments[0].point.y = midway;

      $scope.inputs.forEach(function (field, index) {
        if ($scope.circles.length <= index) {
          p.activate();
          var circlePoint = new p.Point(20, 20);
          var circle = new p.Path.Circle({
            center: circlePoint,
            radius: 3,
            strokeColor: 'green',
            strokeWidth: 3,
            fillColor: 'white'
          });
          $scope.circles.push(circle);

        }
        
        var circle = $scope.circles[index];
        console.log(circle);
        circle.position.y = lasty;
        
        lasty += pointDistance;

        var a = new paper.Segment(circle.position, null, new p.Point(25, 0));
        var b = new paper.Segment(meetPoint, new p.Point(0, 0), null);
        $scope.segments.push(b);
        $scope.segments[index].point.y = midway;
        var curve = new paper.Path(a, b);
        curve.strokeColor = 'green';
        curve.strokeWidth = 3;

        
        p.view.draw();
      });


    }, true);

    p.view.draw();
    console.log(p);

  });
  

}]);