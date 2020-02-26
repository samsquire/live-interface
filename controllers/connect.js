angular.module('system').controller('connect', ['$rootScope', '$state', '$scope', '$stateParams',
  function ($rootScope, $state, $scope, $stateParams) {

  $scope.open = true;
  $scope.id = $stateParams.documentId;
  $scope.fieldIndex = $stateParams.fieldIndex;
  $scope.instanceName = $stateParams.instanceName;

  $.extend($scope, $state.current.data);

  $scope.close = function () {
    $scope.open = false;
    $state.transitionTo('home');
    $rootScope.$emit('enable-autocomplete');
  }

  $rootScope.$emit('disable-autocomplete');
  $rootScope.$emit('close-autocomplete');

  var escapeListener = $rootScope.$on('escape-pressed', function () {
    $scope.close();
  });

  // $rootScope.$on('')


  var decisionListener = $scope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {
      if ($state.is("home.connect")) {
        $scope.madeDecision = false;
      }
      if ($state.is("home.connect.use")) {
        escapeListener();
        $scope.madeDecision = true;

      }
  });

  $scope.$on('$destroy', function () {
    decisionListener();
  });

  $scope.use = function () {
    $state.transitionTo('home.connect.use', $stateParams);
  };

  $scope.expose = function () {
    $state.transitionTo('home.connect.expose', $stateParams);
  };

}]);