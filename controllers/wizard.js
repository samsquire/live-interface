angular.module('system').controller('wizard',
  ['$scope', '$rootScope', '$state', 'shelfRepository',
  function ($scope, $rootScope, $state, shelfRepository) {

  $scope.$parent.choosing = $state.current.data.choosing;
  $scope.$parent.createWizard = true
  $scope.$on('$destroy', function () {
    $scope.$parent.choosing = true;
    $scope.$parent.createWizard = false
  });

 $scope.activeStep = 0;

 $scope.name = "";
 $scope.type = "";

 $scope.steps = ["name", "type"];

 $scope.nextStep = function (event) {
    console.log("form submit");
    console.log("on step", $scope.steps[$scope.activeStep]);
    var value = $scope[$scope.steps[$scope.activeStep]];
    console.log("Current value:", value);
    if (value !== "") {
      $scope.activeStep = $scope.activeStep + 1;
    } else {
      return;
    }

    if ($scope.activeStep === $scope.steps.length) {
      
      console.log($scope);
      shelfRepository.objects.push({
        type: $scope.type,
        name: $scope.name,
      });
      $scope.$parent.choosing = true;
      $state.transitionTo("home");
      $rootScope.$emit("embed-field", {
        type: "subdocument"
      });
    }
  }
}]);