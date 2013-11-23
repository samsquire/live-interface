angular.module('system').controller('contextController', ['$scope', '$rootScope', 'model', '$state', 'metadata', 'shelfRepository', 'ActiveDocument',
  function ($scope, $rootScope, model, $state, metadata, shelfRepository, ActiveDocument) {

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

  $scope.follow = function (action, index, event) {
    
    var embeddedContext = $(event.target).parents('.content')[0];

    var shelfData = angular.extend({
      action: action,
      documentId: $scope.activeDocument._id
    }, metadata);

    // insert this field into the currently used document
    ActiveDocument.fields.push($scope.activeDocument.fields[metadata.fieldIndex]);

    console.log(shelfData);
    shelfRepository.items.push(shelfData);
    console.log(shelfRepository.items);
  };

  $scope.codemirror = function (options) {
    return angular.extend({
      onLoad: $scope.codemirrorLoaded
    }, options);
  };

 $scope.codemirrorLoaded = function(_editor) {
    // Editor part
    var _doc = _editor.getDoc();

    // Events
    _editor.on("beforeChange", function(){  });
    _editor.on("change", function(){  });

    CodeMirror.autoLoadMode(_editor, _editor.getOption("mode"));

    _editor.focus();

    setTimeout(function () {
      _editor.refresh();
    }, 0);
    
  };


}]);