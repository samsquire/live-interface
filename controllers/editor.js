var EditorController = function EditorController ($scope, $state, $stateParams, $rootScope, feed,
    $templateCache, $http, $compile, keybinding,
    ListModel, CodeModel, RelationModel, ActiveDocument, DependencyTreeGenerator, BucketModel, socket,
    DocumentModel, SubdocumentModel, cleaner) {

  $scope.open = false;
  $.extend($scope, $state.current.data);

  if ($state.current.data.preopened) {
    $scope.open = true;
  }

  $scope.feedIds = feed.ids;

  if ($stateParams.documentId) {
    var doc = $scope.feedIds[$stateParams.documentId];
    console.log("Editing", $stateParams.documentId, "Copying", doc, "into activeDocument");
    $.extend(true, ActiveDocument, doc);
  }
  $scope.activeDocument = ActiveDocument;
  

  // $scope.activeDocument.fields.push(list);
  // list.items.push({text: "hello"});
  // list.items.push({text: "world"});
  // $scope.activeDocument.instances.push(0);

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

  $scope.tree = function () {
    var elements = $scope.filteredDocument();
    console.log(DependencyTreeGenerator.tree(elements));
  };

  $scope.filteredDocument = function () {
    return cleaner.filter($scope.activeDocument.contents);
  };

  $scope.scan = function (text, promise) {
    $http.post('http://sampc:4567/identify', text)
    .success(function (data) {
      promise.resolve(data.language);
    });
  };

  $scope.update = function () {
    var elements = $scope.filteredDocument();
    var html = elements.html();
    $scope.activeDocument.contents = html;
    
    feed.update($scope.activeDocument, function () {
      console.log("Updated", $scope.activeDocument);
      $state.transitionTo("home");
    });
  };

  $scope.save = function () {
    var elements = $scope.filteredDocument();
    var html = elements.html();

    feed.save({
      contents: html,
      fields: $scope.activeDocument.fields,
      instances: $scope.activeDocument.instances,
      tree: DependencyTreeGenerator.tree(elements)
    }, $scope.saved);
    $scope.activeDocument.contents = "";
  };

  $scope.subdocument = function (metadata) {
    console.log("Inserting sub document");

    var shelfData, subDocument;

    function insertSubDocument(id) {
      var subdocumentRef = SubdocumentModel();
      subdocumentRef.ref = id;
      var instance = $scope.createInstance();
      ActiveDocument.fields.push(subdocumentRef);
      
      var element = $scope.createContextElement('subdocument', id);

      $scope.insertNode(element);
      // $compile(element)($scope);
      $scope.open = true;
    }

    if (metadata) {
      insertSubDocument(metadata.document._id);
    } else {
      // we need to create the subdocument
      subDocument = new DocumentModel();
      feed.save({
        contents: "",
        fields: subDocument.fields,
        instances: subDocument.instances,
        tree: []
      }, function (err, response) {
        var id = response.id;
        console.log("Waiting for", id);
        feed.waitFor(id, function (savedDoc) {
          console.log("Finished waiting for", response);
          insertSubDocument(id);
        });

      });
    }    
  };

  $scope.saved = function (err, response) {
    console.log('saved', err, response);
  };

  $scope.insert = function (event, kind) {
    $scope[kind]();
  };

  $rootScope.$on('embed', function (event, metadata) {
    console.log('External embed', metadata, 'of kind', metadata.kind);
    $scope[metadata.kind](metadata);
  });

  $rootScope.$on('embed-field', function (event, field) {
    console.log('Embedding', field.index, 'of type', field.type);
    $scope[field.type](field.index);
  });

  $rootScope.$on('embed-external-field', function (event, reference) {
    console.log('External embed of', reference);
    $scope.external(reference);
  });

  $scope.insertNode = function (newNode) {
    var node;
    if ($scope.selection === null || $scope.selection.anchorNode === null) {
      $('.post-body').focus();
      $scope.selection = window.getSelection();
    }
    node = $scope.selection.anchorNode;
    
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
      if (node.textContent.length === $scope.selection.anchorOffset) {
        console.log("Insert at end of line");
        var firstParent = $(node).parentsUntil('.post-body')[0];
        $(firstParent).after(newNode);
      } else if ($scope.selection.anchorOffset === 0) {
        $($(".post-body")[0].lastChild).after(newNode);
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

  $scope.createExternal = function(type, model, documentId) {
    var element = $("<a>");
    element.attr("rel", "external");
    element.attr("data-kind", type);
    element.attr("data-id", model);
    element.attr("href", documentId);
    element.attr("contenteditable", "false");
    return element[0];
  };

  $scope.createEmbedded = function(type, model, instance) {
    var element = $("<a>");
    element.attr("rel", "embedded");
    element.attr("data-kind", type);
    element.attr("data-id", model);
    element.attr("href", instance);
    element.attr("contenteditable", "false");
    return element[0];
  };

  $scope.findModel = function (modelConstructor, modelIndex, defaults) {
    var model;
   if (modelIndex === undefined) {
      console.log("Creating empty model.");
      model = modelConstructor();
      if (defaults) {
        defaults(model);
      }
      $scope.activeDocument.fields.push(model);
    } else {
      console.log("Using pre-existing model.");
      model = $scope.activeDocument.fields[modelIndex];
    }
    return model;
  };

  $scope.createContextElement = function (kind, instance) {
    return $scope.createEmbedded(kind, $scope.activeDocument.fields.length - 1, instance);
  };

  $scope.createInstance = function () {
    var instance = $scope.activeDocument.instances.length;
    $scope.activeDocument.instances.push(instance);
    return instance;
  };

  $scope.list = function (modelIndex) {
    var model = $scope.findModel(ListModel, modelIndex);
    model.items.push({text: "Hello World!"});

    var instance = $scope.createInstance();
    var element = $scope.createContextElement('list', instance);

    $scope.insertNode(element);
    // $compile(element)($scope);
    $scope.open = true;
  };

  $scope.external = function (reference) {
    var externalField = reference.document.fields[reference.fieldIndex];
    var element = $scope.createExternal(externalField.type, reference.fieldIndex, reference.document._id);
    $scope.insertNode(element);
    $scope.open = true; 
    $rootScope.$emit('escape-pressed');
  };

  $scope.relation = function (metadata) {
    var relation = RelationModel();
    console.log(metadata, relation);
    relation.subject.type = "";
    relation.subject.description = metadata.subject;

    relation.predicate.type = "";
    relation.predicate.description = metadata.predicate;
    
    relation.object.type = "";
    relation.object.description = metadata.object;
    ActiveDocument.fields.push(relation);

    var instance = $scope.createInstance();
    var element = $scope.createContextElement('relation', instance);

    $scope.insertNode(element);
    // $compile(element)($scope);
    $scope.open = true;
  };

  $scope.code = function (modelIndex) {
    var model = $scope.findModel(CodeModel, modelIndex, function (model) {
      model.source = "console.log('hi')";
    });

    var instance = $scope.createInstance();
    var element = $scope.createContextElement('code', instance);
    

    $scope.insertNode(element);
    // $compile(element)($scope);
    $scope.open = true;
    model.refresh = true;
  };

  $scope.table = function () {

    // $scope.insertNode(element);
  };

  $rootScope.$on('bucket', function () {

    var model = $scope.findModel(BucketModel);

    var instance = $scope.createInstance();
    var element = $scope.createContextElement('data', instance);

    socket.on('line', function (data) {
      console.log(data);
      var headers = data.lines.shift().split(/\s+/);
      var firstline = data.lines[0].split(/\s+/);
      console.log(firstline);
      if (firstline.length > headers.length) {
        headers = _.range(0, firstline.length);
      }
      console.log(headers);
      model.headings.push.apply(model.headings, headers);

      model.lines.push.apply(model.lines, data.lines.map(function (line) {
        var cells = line.split(/\s+/);
        var row = headers.reduce(function (row, column) {
          row[column] = cells.shift();
          return row;
        }, {});
        return row;
      }));
      $scope.$apply();
      console.log(model.lines);
    });
    
    $scope.insertNode(element);
    // $compile(element)($scope);
    $scope.open = true;
  });

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

}


angular.module('system').controller('editor', ['$scope', '$state', '$stateParams', '$rootScope', 'feed',
  '$templateCache', '$http', '$compile', 'keybinding', 'ListModel', 'CodeModel', 'RelationModel', 'ActiveDocument',
  'DependencyTreeGenerator', 'BucketModel', 'socket', 'DocumentModel', 'SubdocumentModel', 'cleaner',
  EditorController]);

