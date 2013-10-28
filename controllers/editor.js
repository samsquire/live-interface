angular.module('system').controller('editor', ['$scope', '$state', '$rootScope', 'feed', '$templateCache', '$http', '$compile', 'keybinding',
  function ($scope, $state, $rootScope, feed, $templateCache, $http, $compile, keybinding) {
  console.log('editor controller');

  $scope.open = false;
  $scope.body = "";
  $scope.fields = [];
  $scope.list = "";
  $scope.active = true;
  $scope.focusOffset = 0;
  $scope.focusNode = null;

  $scope.selection = null;

  
  keybinding.bind('command+u', 'move-up');
  keybinding.bind('command+d', 'move-down');
  keybinding.bind('command+l', 'move-left');
  keybinding.bind('command+r', 'move-right');
  keybinding.bind('command+[', 'promote');
  keybinding.bind('command+]', 'demote');

  $rootScope.$on('demote', function () {
    console.log('demote');
  });
  $rootScope.$on('promote', function () {
    console.log('promote');
  });
  $rootScope.$on('move-right', function () {
    console.log('move-right');
  });
  $rootScope.$on('move-up', function () {
    console.log('move-up');
  });
  $rootScope.$on('move-down', function () {
    console.log('move-down');
  });
  $rootScope.$on('move-left', function () {
    console.log('move-left');
  });

  $scope.save = function () {
    feed.save({
      name: $scope.body,
      fields: $scope.fields
    }, $scope.saved);
    $scope.body = "";
  };

  $scope.saved = function (err, response) {
    console.log('saved', err, response);
  };

  $scope.insert = function (event, kind) {
    console.log('insertion event of', kind);
    $scope[kind]();
  };

  $scope.insertNode = function (newNode) {
    var node = $scope.selection.anchorNode;
    var parents = $(node).parents().filter(function () {
      return $(this).hasClass('post-body');
    });
    if (node.nodeType !== 3) {
      console.log("I am not a text node");
      if (node.childNodes.length == 1 && node.childNodes[0].tagName == "BR") {
        // force a text node to the beginning
        var first = document.createTextNode("");
        node.insertBefore(first, node.childNodes[0]);
        node = first;
        console.log("created initial text node");
      } else {
       node = node.previousSibling;
      }

    }

    // var newNode = document.createTextNode('hi');
    
    if (parents.length === 1) {
      console.log('will be inserting at', node, $scope.selection);
      node.splitText($scope.selection.anchorOffset);
      $(node).after(newNode);
    } else {
      $('.post-body').append(newNode);
      console.log('selection not inside text area');
    }
    if (newNode.nodeType === 3) {
      $scope.focusNode = newNode;
    } else {
      console.log(newNode);
      var innerFocus = $(newNode).find('.focus')[0];
      console.log('focus this', innerFocus);
      $scope.focusNode = innerFocus;
    }
    $(newNode).before('&nbsp;');
    $(newNode).after($('<div>&nbsp;</div>'));
  };


  function importTemplate(url) {
    $http.get(url).then(function (templateData) {
      console.log(templateData);
      $templateCache.put(url, templateData.data);
    });
  };
   

  importTemplate('views/list.html');
  importTemplate('views/table.html');

  $scope.listController = function (data) {
    var listScope = $scope.$new();
    listScope.activeField = data;
    listScope.$watch('activeField.items', function (newVal) {
      console.log(newVal, 'and parent scope is now', $scope.fields);

    }, true);
    listScope.show = function (toggle) {
      listScope.open = toggle;
    };
    return listScope;
  }

  $scope.tableController = function (data) {
    var tableScope = $scope.$new();
    tableScope.activeField = data;
    
    tableScope.show = function (toggle) {
      tableScope.open = toggle;
    };
    return tableScope;
  }



  $scope.contextCreator = function (controller, templateUrl) {
    $scope.open = true;
    var html = $templateCache.get(templateUrl);
    var element = $compile(html)(controller);
    console.log(element);
    return element;
  };

  $scope.list = function () {
    var data = {};
    data.items = [{text: "&nbsp;"}];
    data.open = false;
    $scope.fields.push(data);
    var controller = $scope.listController($scope.fields[$scope.fields.length-1]);
    $scope.$watch('fields', function (newVal) {
      console.log('parent scope', newVal);
    }, true);
    $scope.insertNode($scope.contextCreator(controller, 'views/list.html'));
  };

  $scope.table = function () {
    var data = {};
    data.fields = ['one', 'two', 'three'];
    data.rows = [[1,2,3], [1,2,3], [1,2,3]];
    data.open = false;
    $scope.fields.push(data);
    var controller = $scope.tableController(data);
    
    $scope.insertNode($scope.contextCreator(controller, 'views/table.html'));
  };


  $rootScope.$on('caret', function (event, newSelection) {
    $scope.selection = selection = newSelection;
    
  });
  $rootScope.$on('insertion', $scope.insert);
  $rootScope.$on('autocomplete-closed', function () {
    console.log('autocomplete closed');
    $scope.active = true;
  });
  $rootScope.$on('toggle-editor-expand', function () {
    $scope.open = !$scope.open;
  });

}]);