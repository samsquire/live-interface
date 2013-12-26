angular.module('system').factory('contextTemplates',
  ['$http', '$templateCache', function ($http, $templateCache) {

  function importTemplate(url) {
    $http.get(url).then(function (templateData) {
      console.log("Imported template for", url);
      $templateCache.put(url, templateData.data);
    });
  };
   

  importTemplate('views/list.html');
  importTemplate('views/table.html');
  importTemplate('views/code.html');
  importTemplate('views/data.html');
  importTemplate('views/jsonlist.html');
  importTemplate('views/subdocument.html');
}]);

angular.module('system').directive('a', ['$timeout', '$compile', '$templateCache', 'contextTemplates', '$controller',
  function ($timeout, $compile, $templateCache, contextTemplates, $controller) {
  return {
    restrict: 'E',
    transclude: false,
    replace: false,
    link: function ($scope, $element, $attrs) {

      var kind = $element.attr('rel'),
        model, contextTemplateUrl, templateHtml, contextScope, contextScope, embeddedContent, metadata;

      if (kind !== "embedded") {
        return false;
      }

      
      metadata = {
        fieldIndex: parseInt($element.attr('data-id'), 10),
        kind: $element.attr('data-kind'),
        instanceName: $element.attr('href')
      };
      // console.log("Active Document is", $scope.activeDocument);
      model = $scope.activeDocument.fields[metadata.fieldIndex];
//      console.log('Encountered context', model);

      contextTemplateUrl = 'views/' + metadata.kind + '.html';
      templateHtml = $templateCache.get(contextTemplateUrl);
      
      contextScope = $scope.$new();
      controller = $controller('contextController', {
        $scope: contextScope,
        model: model,
        metadata: metadata
      });

      embeddedContent = $compile(templateHtml)(contextScope);
      
    
      $timeout(function () {
        // wait for all the other bindings in the template have finished
        $element.after(embeddedContent);
        /*
        // console.log("DONE context insertion", embeddedContent.html());
        var focusNodes = embeddedContent.find('.focus');



        if (focusNodes.length > 0) {
          $(focusNodes).focus();
        }
        */
      });
    
      

      // console.log(contextTemplateUrl);
      // console.log('Got template HTML', templateHtml);
    }
  };
}]);