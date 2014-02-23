angular.module('system').factory('page-lines', function () {

  function Lines() {
    var self = this;
    self.connections = [];
    // self.inputs = [{}, {}, {}, {}];
    self.inputs = [];
    self.cancelled = false;

    self.finishLine = function (field) {
      console.log(field, 'added');
      self.connections[self.connections.length - 1].strokeColor = 'green';
      self.inputs.push(field);
    };

    self.finish = function () {
      self.connections[self.connections.length - 1].remove();
      self.cancelled = true;
    };

    self.activate = function () {
      self.addLine();
      self.cancelled = false;
    };

    self.addLine = function () {
      var start = new paper.Point(20, 0);
      var end = start.add([0, 960]);

      var line = new paper.Path.Line(start, end);
      line.strokeColor = 'black';
      line.strokeWidth = 5;
      self.connections.push(line);
    };
  }

  return new Lines();

});