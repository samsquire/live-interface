angular.module('system').directive('angularContent', ['$timeout', '$compile', function ($timeout, $compile) {
  return {
    transclude: false,
    replace: false,
    link: function ($scope, $element, $attrs) {
      
      var data = $attrs.angularContent;
      var documentIndex = $scope.$eval($attrs.documentIndex);

      // console.log("linking run angular", documentIndex);
      var model = $scope.items[documentIndex];
      
      var subDocumentScope = $scope.$new();
      subDocumentScope.activeDocument = model;

      var template = $scope.$eval(data);
      var newContent = $.trim(template);
      $compile(newContent)(subDocumentScope, function (rendered) {
        // console.log(rendered);
        $element.append(rendered);
        // console.log("DONE angular content", rendered);
        
        
      });
    }


  };
}]);