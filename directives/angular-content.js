angular.module('system').directive('angularContent', ['$timeout', '$compile', function ($timeout, $compile) {
  return {
    transclude: false,
    replace: false,
    link: function ($scope, $element, $attrs) {
      
      var data = $attrs.angularContent;
      var model;
      if ($attrs.documentIndex) {
        var documentIndex = $scope.$eval($attrs.documentIndex);
        model = $scope.items[documentIndex];
      } else {
        model = $scope.$eval($attrs.documentModel);
      }

      // console.log("linking run angular", documentIndex);
      
      
      var subDocumentScope = $scope.$new();
      subDocumentScope.activeDocument = model;
      
      var template = $("<span>");
      template.append($.parseHTML($scope.$eval(data)));
      $element.append(template.contents());

      loadContexts(subDocumentScope);

      function loadContexts(subDocumentScope) {
        var freshContexts = $element.find("[rel=embedded]").not(".ng-scope");
        freshContexts.each(function (i, embed) {
            $compile(embed)(subDocumentScope, function (rendered) {
              // $timeout(function () {
                $(embed).replaceWith(rendered);
              // });
          });
        });

      }

      // $scope.$watch(data, function (template) {
      //   // var template = $scope.$eval(data);
      //   var newContent = $.trim(template);
      //   var dom = angular.element("<span>" + newContent + "</span>");

      //   $timeout(function () {
      //       $compile(dom)(subDocumentScope, function (rendered) {
      //         replacement.replaceWith(rendered);
      //         replacement = rendered;
      //       });
      //   });
      // });


      $scope.$watch(data, function (newTemplate) {
        if ($attrs.incremental === "false") {
          var created = $("<span>");
          created.append($.parseHTML(newTemplate));
          $element.empty();
          $element.append(created.contents());

        }
        loadContexts(subDocumentScope);

      });
  }
}
}]);