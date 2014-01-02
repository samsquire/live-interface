var EmbedController = function EmbedController (
  $scope, $state, $rootScope, ActiveDocument, feed) {
  $scope.open = true;
  $scope.activeDocument = ActiveDocument;
  $scope.items = feed.items;
  $scope.feedIds = feed.ids;

  $rootScope.$emit('disable-autocomplete');
  $rootScope.$emit('close-autocomplete');

  $rootScope.$on('escape-pressed', function () {
    $state.transitionTo('home');
    $rootScope.$emit('enable-autocomplete');
  });

  $scope.embedDocument = function (feedItem) {
    var embed = {
      document: feedItem,
      kind: "subdocument"
    };
    $rootScope.$emit('embed', embed);

  };

  $scope.embed = function (field) {
    var embed = {
      index: field,
      type: $scope.activeDocument.fields[field].type
    };
    $rootScope.$emit('embed-field', embed);
  };

  $scope.close = function () {
    $scope.open = false;
    $state.transitionTo('home');
    $rootScope.$emit('enable-autocomplete');
  }

};

angular.module('system').controller('embed', ['$scope', '$state', '$rootScope',
  'ActiveDocument', 'feed',
EmbedController]);