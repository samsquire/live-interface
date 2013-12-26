angular.module('system').controller('contextController', ['$scope', '$rootScope', 'model', '$state', 'metadata', 'shelfRepository', 'ActiveDocument',
  function ($scope, $rootScope, model, $state, metadata, shelfRepository, ActiveDocument) {

  $scope.activeField = model;
  // this is anything that is a data attribute
  // passed in by the context
  $scope.metadata = metadata;
  
  $scope.code = false;
  $scope.transposed = false;

  if ($scope.metadata.kind === "subdocument") {
    $scope.documentModel = $scope.feedIds[$scope.metadata.instanceName];
    // $scope.documentId = 
    // $scope.itemIndex = $scope.nameToIndex[$scope.metadata.instanceName];
  }

  $scope.swap = function (fred) {


  function mark(parent) {
      var me;
      if (!parent.children) return;
      for (var i = 0; i < parent.children.length; i++) {
        me = parent.children[i];
        me.parent = parent;
        mark(me);
      }
    }

    function undefineds(item) {
        return item !== undefined;
    }

    function add(addition, to) {
      to.children.push(addition);
      addition.parent = to;
    }


    function addChildren(addition, to) {
      to.children.push.apply(to.children, addition.children);
      addition.children.forEach(function (child) {
        remove(child);
        child.parent = to;
      });
    }

    function collapse(node) {
      var children = node.children[0].children;
      node.children = children;
    }

    function deleteEmptyParents(node) {
      var myParent = node.parent;
      if (node.children && node.children.length == 0) {
        remove(node);
        deleteEmptyParents(myParent);
      }
    }

    function replace(node, replacement) {
      var index = node.parent.children[node.parent.children.indexOf(node)];
      node.parent.children[index] = replacement;
    }

    function remove(node) {
        delete node.parent.children[node.parent.children.indexOf(node)];
        node.parent.children = node.parent.children.filter(undefineds);
        // recursively delete empty parents
        if (node.parent.children.length === 0) {
          remove(node.parent);
        }
        return node;     
    }

    function parents(node) {
        if (!node.parent) return [];
        return [node.parent].concat(parents(node.parent));
    }

    

    function find(exactName, node) {
        if (!node.children || node.children.length === 0) return [];
        var result = [];
        
        if (node.name === exactName) {
          result.push(node);
          return result.concat.apply(result, node.children.map(function recur(item) {
            return find(exactName, item);
          }));
        }
        return node.children.map(function recur(item) {
          return find(exactName, item);
        });
    }

    function merge(anotherFred, fred) {

    }

    function newCell(name) {
      return {name: name, children: []};
    }

  var items = $scope.activeField.parents;
  mark(items);

  var fredParents = parents(fred);
  var root = fredParents[1];
  console.log("root", root.name, "parents", fredParents);
  var exactName = fred.name;
  var frontend = fred.parent;

  // find all existing freds
  var foundFreds = _.flatten(find(exactName, root));

  // create a replacement fred
  var newFred = newCell(exactName);
  var childrenLookup = {};
  var fredChildren = newFred.children;

  var fredParents = foundFreds.map(function (aFred) {
    console.log("Inspecting fred", aFred);
    var myParent = aFred.parent.name;
    var myParents = parents(aFred);


    // clone all parents hierarchy, excluding non-fred stuff
    
    var fredParent;

    if (childrenLookup.hasOwnProperty(myParent)) {
      fredParent = childrenLookup[myParent];
    } else {
      // myParents.pop();
      var parent = myParents.shift();
      childrenLookup[myParent] = fredParent = newCell(parent.name);
      
      // var topParent = myParents.reduce(function (lastParent, aParent) {
      //   if (aParent == root) {
      //     return lastParent;
      //   }
      //   var clonedParent = newCell(aParent.name);
      //   lastParent.parent = clonedParent;

      //   clonedParent.children.push(lastParent);
      //   console.log(lastParent.name, aParent.name);
      //   return clonedParent;
      // }, fredParent);

      var lastParent = fredParent;
      var clonedParent;
      for (var i = 0; i < myParents.length; i++) {
        if (myParents[i] === root) {
          console.log("Skipping");
          break;
        }
        // otherwise clone this parent
        clonedParent = newCell(myParents[i].name);
        // put lastParent in this parent
        lastParent.parent = clonedParent;
        clonedParent.children.push(lastParent);
        console.log(lastParent.name, "inside", clonedParent.name);
        lastParent = clonedParent;
      }

      if (lastParent) {
        lastParent.parent = newFred;
      }

      console.log("new hierarchy", lastParent);

      // fredChildren.push(fredParent);
      fredChildren.push(lastParent);

    }

    var myChildren = fredParent.children;

    // move fred's children into the copied parent
    myChildren.push.apply(myChildren, aFred.children);
    myChildren.forEach(function (child) {
      child.parent = fredParent;
    });

    // delete fred
    remove(aFred);
    fredParent.parent = newFred;
    return fredParent;
  });

  console.log("Newly created fred", newFred);
  newFred.parent = root.parent;
  root.children.unshift(newFred);

    // for all of fred's parents
    // create a copy
    // move fred's children inside the copied parent
    // copy fred
    // put fred in the original parent's place





  }

  $scope.swapNEW = function (fred) {
    function mark(parent) {
      var me;
      if (!parent.children) return;
      for (var i = 0; i < parent.children.length; i++) {
        me = parent.children[i];
        me.parent = parent;
        mark(me);
      }
    }

    function undefineds(item) {
        return item !== undefined;
    }

    function add(addition, to) {
      to.children.push(addition);
      addition.parent = to;
    }


    function addChildren(addition, to) {
      to.children.push.apply(to.children, addition.children);
      addition.children.forEach(function (child) {
        remove(child);
        child.parent = to;
      });
    }

    function collapse(node) {
      var children = node.children[0].children;
      node.children = children;
    }

    function deleteEmptyParents(node) {
      var myParent = node.parent;
      if (node.children && node.children.length == 0) {
        remove(node);
        deleteEmptyParents(myParent);
      }
    }

    function replace(node, replacement) {
      var index = node.parent.children[node.parent.children.indexOf(node)];
      node.parent.children[index] = replacement;
    }

    function remove(node) {
        delete node.parent.children[node.parent.children.indexOf(node)];
        node.parent.children = node.parent.children.filter(undefineds); 
        return node;     
    }

    function parents(node) {
        if (!node.parent) return [];
        return [node.parent].concat(parents(node.parent));
    }

    

    function find(exactName, node) {
        if (!node.children || node.children.length === 0) return [];
        var result = [];
        
        if (node.name === exactName) {
          result.push(node);
          return result.concat.apply(result, node.children.map(function recur(item) {
            return find(exactName, item);
          }));
        }
        return node.children.map(function recur(item) {
          return find(exactName, item);
        });
    }

    function merge(anotherFred, fred) {

    }

    function newCell(name) {
      return {name: name, children: []};
    }



  var items = $scope.activeField.parents;
  mark(items);

  var parents = parents(fred);
  var root = parents[parents.length - 2];
  var exactName = fred.name;
  var frontend = fred.parent;

  
  var newFred;
  root.children.forEach(function (child) {
    var otherFreds = _.flatten(find(exactName, child));

    otherFreds = otherFreds.filter(function (otherFred) {
      return otherFred != fred;
    });

    otherFreds.forEach(function (anotherFred) {
      var newParent = newCell(anotherFred.parent.name);
      if (!newFred) {
        newFred = newCell(fred.name);
      }
      addChildren(anotherFred, newParent);
      deleteEmptyParents(anotherFred, []);

      newFred.children.push(newParent);
      merge(fred);
    });
  });

  
  console.log(newFred);
  replace(fred, newFred);
  
  }

  $scope.swapOLD = function (a, b, p, ai, bi) {

      function mark(parent) {
      var me;
      if (!parent.children) return;
      for (var i = 0; i < parent.children.length; i++) {
        me = parent.children[i];
        me.parent = parent;
        mark(me);
      }
    }
    console.log("marking parents");
    var items = $scope.activeField.parents;
    var children = items.children;

    

    function scan(myName, node) {
      console.log("scanning", node.name);
      if (node.name === myName) {
        return [node]
      } else if (node.children) {
        return node.children.reduce(function (results, child) {

          return results.concat(scan(myName, child));
        }, []);
      } else {
        return [];
      }

    }

    function undefineds(item) {
        return item !== undefined;
    }

    function cloneNonemptyParents(node, cloned) {
      var oldParent = node.parent;
      if (oldParent.children.length > 1) {
        // delete from this node, it no longer needs it
        delete node.parent.children[node.parent.children.indexOf(node)];
        node.parent.children = node.parent.children.filter(undefineds);

        // clone this parent and add ourself to it
        clonedParent = {name: oldParent.name, children: [node]};
        node.parent = clonedParent;
        return clonedParent;
      }
      cloneNonemptyParents(oldParent, cloned);
      return oldParent;
    }

    function remove(node) {
      delete node.parent.children[node.parent.children.indexOf(node)];
      node.parent.children = node.parent.children.filter(undefineds);      
    }

    function collapse(node) {
      var children = node.children[0].children;
      node.children = children;
    }

    function findLonelyParents(node, lonely) {
      var oldParent = node.parent;
      if (oldParent.children.length == 1) {
        lonely.push(oldParent);
        collapse(oldParent);
        findLonelyParents(oldParent, lonely);
      }
      return oldParent;
    }

    function parents(node) {
      if (!node.parent) return [];
      return [node.parent].concat(parents(node.parent));
    }

    var myName = a.name;

    mark(items);

    var parents = parents(a);
    var myRoot = parents[parents.length - 2];
    console.log("my root is", myRoot);

    var equivalents = scan(myName, myRoot);

    var invertedParent = {name: a.parent.name, children: []};

    var newChildren = equivalents.reduce(function (results, current) {
      // remove from existing parent
      var lonely = [];
      var oldParent = findLonelyParents(current, lonely);
      console.log("Inside", current, "Looking at lonely parents", lonely);
      remove(current);
      return results.concat(lonely);
    }, []);

    a.children.forEach(function (child) {
        console.log("inverted child by putting", a.name, "children into new", a.parent.name);  
        console.log(child);
        remove(child);
        invertedParent.children.push(child);
        child.parent = invertedParent;
    });

    var newParent = {name: myName, children: newChildren};


  };

  $scope.toggleCode = function () {
    $scope.code = !$scope.code;
  };

  $scope.show = function (toggle) {
    $scope.open = toggle;
  };

  $scope.transpose = function () {
    $scope.transposed = !$scope.transposed;
  };

  $scope.connect = function (item) {
    $state.transitionTo('home.connect', {
      documentId: $scope.activeDocument._id,
      fieldIndex: metadata.fieldIndex,
      instanceName: metadata.instanceName
    });
  };

  $scope.follow = function (action, index, event) {
    
    var embeddedContext = $(event.target).parents('.content')[0];

    var shelfData = angular.extend({
      action: action,
      documentId: $scope.activeDocument._id
    }, metadata);

    // insert this field into the currently used document
    ActiveDocument.fields.push($scope.activeDocument.fields[metadata.fieldIndex]);

    console.log(shelfData);
    shelfRepository.items.push(shelfData);
    console.log(shelfRepository.items);
  };

  $scope.codemirror = function (options) {
    return angular.extend({
      onLoad: $scope.codemirrorLoaded
    }, options);
  };

 $scope.codemirrorLoaded = function(_editor) {
    // Editor part
    var _doc = _editor.getDoc();

    // Events
    _editor.on("beforeChange", function(){  });
    _editor.on("change", function(){  });

    CodeMirror.autoLoadMode(_editor, _editor.getOption("mode"));

    _editor.focus();

    setTimeout(function () {
      _editor.refresh();
    }, 0);
    
  };


}]);