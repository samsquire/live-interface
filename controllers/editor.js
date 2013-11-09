angular.module('system').controller('editor', ['$scope', '$state', '$rootScope', 'feed',
  '$templateCache', '$http', '$compile', 'keybinding', 'ListModel', 'ActiveDocument',
  function ($scope, $state, $rootScope, feed, $templateCache, $http, $compile, keybinding,
    ListModel, ActiveDocument) {

  $scope.open = false;
  $scope.body = "";

  var list = ListModel();

  $scope.activeDocument = ActiveDocument;

  $scope.activeDocument.fields.push(list);
  list.items.push({text: "hello"});
  list.items.push({text: "world"});
  $scope.activeDocument.instances.push(0);

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
    var contents = $($.parseHTML($scope.body));
    var elements = $('<div>').append(contents);
    contents.remove('.embedded-context');
    var html = elements.html();
    console.log('Saving', html);

    feed.save({
      contents: html,
      fields: $scope.activeDocument.fields,
      instances: $scope.activeDocument.instances
    }, $scope.saved);
    $scope.body = "";
  };

  $scope.saved = function (err, response) {
    console.log('saved', err, response);
  };

  $scope.insert = function (event, kind) {
    $scope[kind]();
  };

  $rootScope.$on('embed-field', function (event, field) {
    console.log('Embedding', field);
    $scope[$scope.activeDocument.fields[field].type](field);
  });

  $scope.insertNode = function (newNode) {
    var node = $scope.selection.anchorNode;
    var parents = $(node).parents().filter(function () {
      return $(this).hasClass('post-body');
    });
    if (node.nodeType !== 3) {
      console.log("Not a text node. Ensuring flattened structure.", node.parentNode);
      // node = $(node).parentsUntil('.post-body')[0];
      var oneDeep = $(node).parentsUntil('.post-body');
      if (oneDeep.length) {
        node = oneDeep[0];
      }

      

      if (node.childNodes.length == 1 && node.childNodes[0].tagName == "BR") {
        // force a text node to the beginning
        var first = document.createTextNode("");
        node.insertBefore(first, node.childNodes[0]);
        node = first;
        
      } else {
        console.log("Inserting before the selected node");
       node = node.previousSibling;
      }

    }

    
    if (parents.length === 1) {
      console.log(node.textContent.length);
      if (node.textContent.length === $scope.selection.anchorOffset) {
        console.log("Insert at end of line");
        var firstParent = $(node).parentsUntil('.post-body')[0];
        $(firstParent).after(newNode);
      } else {
        $(node).unwrap();
        var remaining = node.splitText($scope.selection.anchorOffset);
        $(node).after(newNode);
        $(node).wrap("<div>");
        $(remaining).wrap("<div>");
        console.log("Text split at", $scope.selection.anchorOffset);
      }
    } else {
      $('.post-body').append(newNode);
      console.log('selection not inside text area');
    }
    if (newNode.nodeType === 3) {
      $scope.focusNode = newNode;
    } 
    $(newNode).before('<div>&nbsp;</div>');
    $(newNode).after($('<div>&nbsp;</div>'));
  };


  $scope.listController = function (data) {
    var listScope = $scope.$new();
    listScope.activeField = data;
    listScope.$watch('activeField.items', function (newVal) {
      console.log(newVal, 'and parent scope is now', $scope.activeDocument.fields);

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

  $scope.createEmbedded = function(type, model, instance) {
    var element = $("<a>");
    element.attr("rel", "embedded");
    element.attr("data-kind", type);
    element.attr("data-id", model);
    element.attr("href", instance);
    return element[0];
  };

  $scope.list = function (modelIndex) {
    var model;
    if (modelIndex === undefined) {
      console.log("Creating empty model.");
      model = ListModel();
      model.items.push({text: "Hello World!"})
      $scope.activeDocument.fields.push(model);
    } else {
      console.log("Using pre-existing model.");
      model = $scope.activeDocument.fields[modelIndex];
    }
    var instance = $scope.activeDocument.instances.length;
    var element = $scope.createEmbedded('list', $scope.activeDocument.fields.length - 1, instance);
    $scope.activeDocument.instances.push(instance);

    $scope.insertNode(element);

    $compile(element)($scope);
    $scope.open = true;
  };

  $scope.table = function () {

    // $scope.insertNode(element);
  };


  $rootScope.$on('caret', function (event, newSelection) {
    $scope.selection = selection = newSelection;
    
  });
  $rootScope.$on('insertion', $scope.insert);
  $rootScope.$on('autocomplete-closed', function () {
    $scope.active = true;
  });
  $rootScope.$on('toggle-editor-expand', function () {
    $scope.open = !$scope.open;
  });

}]);