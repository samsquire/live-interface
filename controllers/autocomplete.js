angular.module('system').run(function () {

  _.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};


});

angular.module('system').controller('autocomplete',
  ['$scope', '$state', '$rootScope', 'bucket', 'sparql-query', 'importTemplate',
  function ($scope, $state, $rootScope, bucketService, sparqlQuery, importTemplate) {
  $scope.open = false;
  $scope.choosing = $state.current.data.choosing;
  console.log("Autocomplete initialized", $scope.open);
  $scope.createRelation = false;


  importTemplate('queries/query.sparql');

  var escapeListener = null;
  $scope.options = [
  [
    {title: 'Embed', type: 'stateChange', action: 'home.embed'},
    {title: 'Create a list', type: 'insertion', kind: 'list'},
    {title: 'Insert code', type: 'insertion', kind: 'code'},
    {title: 'Create a table', type: 'insertion', kind: 'table'},
    {title: 'Create a data bucket', type: 'bucket'},
  ],
  [
    {title: 'Expand', templateUrl: 'views/editor-expand-option.html', type: 'view', kind: 'expand'},
    {title: 'Create something', type: 'stateChange', action: 'home.create'},
    {title: 'Insert relation', type: 'stateChange', action: 'relation'},
    {title: 'Sparql Query', type: 'run', kind: 'sparql'}
  ]];

  $scope.close = function () {
    $scope.open = false;
  };
  
  $scope.run = function (item) {
    $scope[item.kind](item);
  };

  $scope.sparql = function (item) {
    sparqlQuery.send('queries/query.sparql', {
      a: "?a",
      search: "?a <http://samsquire.com/worksFor> ?c.",
      b: "<http://samsquire.com/worksFor>",
      restriction: "?a ?c",
      unknownClass: "?a"
    }, function (results) {
      console.log(results);
    });
  };

  $scope.toggle = function () {
    console.log("toggling autocomplete");
    $scope.open = !$scope.open;
    if (!$scope.open) {
      $rootScope.$emit('autocomplete-closed');
    }
  };

  $scope.stateChange = function (item) {
    console.log($state.current);
    $state.transitionTo(item.action);
    $scope.toggle();
  };

  $scope.execute = function (item) {
    $scope[item.type](item);
    $scope.toggle();
  };

  $scope.insertion = function (item) {
    $rootScope.$emit('insertion', item.kind);
  };

  $scope.bucket = function () {
    $rootScope.$emit('bucket');
  };

  $scope.view = function (item) {
    $scope[item.kind]();
  }

  $scope.createContext = function (item) {
    
  };

  $scope.expand = function () {
    $rootScope.$emit('toggle-editor-expand');
  };

  listen();
  

  function listen() {
    escapeListener = $rootScope.$on('escape-pressed', $scope.toggle);
  }



  var enableListener = $rootScope.$on('enable-autocomplete', function () {
    if (!escapeListener) {
     listen();
    }
  });

  var disableListener = $rootScope.$on('disable-autocomplete', function () {
    if (escapeListener) {
      escapeListener();
      escapeListener = null;
    }
  });

  var closeListener = $rootScope.$on('close-autocomplete', function () {
    $scope.close();
  });


  $scope.$on('$destroy', function () {
    console.log("Destroying listeners.");
    escapeListener();
    closeListener();
    enableListener();
    disableListener();
  });

}]);