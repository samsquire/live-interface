var EmbedController = function EmbedController ($scope, $state, $rootScope, ActiveDocument) {
  $scope.open = true;
  $scope.activeDocument = ActiveDocument;

  $rootScope.$emit('disable-autocomplete');
  $rootScope.$emit('close-autocomplete');

  $rootScope.$on('escape-pressed', function () {
    $state.transitionTo('home');
    $rootScope.$emit('enable-autocomplete');
  });


  $scope.embed = function (field) {
    var embed = {
      index: field,
      type: $scope.activeDocument.fields[field].type
    };
    $rootScope.$emit('embed-field', embed);
  };

};

angular.module('system').controller('embed', ['$scope', '$state', '$rootScope', 'ActiveDocument',
EmbedController]);