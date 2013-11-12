angular.module('system').controller('contextController', ['$scope', 'model', '$state', 'metadata',
  function ($scope, model, $state, metadata) {

  $scope.activeField = model;
  $scope.metadata = metadata;
  
  $scope.code = false;
  $scope.transposed = false;

  $scope.toggleCode = function () {
    $scope.code = !$scope.code;
  };

  $scope.show = function (toggle) {
    $scope.open = toggle;
  };

  $scope.transpose = function () {
    $scope.transposed = !$scope.transposed;
  };

  $scope.connect = function (item) {
    $state.transitionTo('home.connect', {
      documentId: $scope.activeDocument._id,
      fieldIndex: metadata.fieldIndex,
      instanceName: metadata.instanceName
    });
  };

  $scope.listenEditor = function () {
    $scope.$watch('activeField.editorOptions', function () {
      console.log('editor config changed');
    }, true);
  };

  $scope.codemirror = function (options) {
    return angular.extend({
      onLoad: $scope.codemirrorLoaded
    }, options);
  };

 $scope.codemirrorLoaded = function(_editor) {
    console.log("CodeMirror loaded");

    // Editor part
    var _doc = _editor.getDoc();

    // Events
    _editor.on("beforeChange", function(){  });
    _editor.on("change", function(){  });

    console.log(_editor.getOption("mode"));
    CodeMirror.autoLoadMode(_editor, _editor.getOption("mode"));
    
    _editor.focus();

    setTimeout(function () {
      _editor.refresh();
    }, 0);
    
  };


}]);