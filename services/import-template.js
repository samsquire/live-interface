angular.module('system').factory('importTemplate',
  ['$http', '$templateCache', function ($http, $templateCache) {

return function importTemplate(url) {
    $http.get(url).then(function (templateData) {
      console.log("Imported template for", url);
      $templateCache.put(url, templateData.data);
    });
  };
  
}])