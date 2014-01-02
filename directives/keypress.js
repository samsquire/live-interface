angular.module('system').directive('keypress', ['$parse', '$rootScope', function ($parse, $rootScope) {
return {
  link: function ($scope, $element, $attrs) {

    $(document.body).bind('keydown', function (event) {
      // var model = $parse($attrs['keypress']);
      // model($scope, {$event: event});
      
      if (event.keyCode == 27) {

        $rootScope.$emit('caret', $.extend({}, window.getSelection()));
        $rootScope.$emit('escape-pressed');
        $scope.$apply();
        event.preventDefault();
      }
      
      if (event.keyCode == 13) {
        if ($(event.target).is(':focus')) {
          $(event.target).click();
        }
      }

      return true;
    });

    var ondestruction = $scope.$on('$destroy', function () {
      console.log('Unbinding');
      $(document.body).unbind('keydown');
      ondestruction();
    });
  }

  };
}]);

angular.module('system').directive('numberedFocus', [function () {

return {
  link: function ($scope, $element, $attrs) {
    var validOptions = $attrs.numberedFocus;
    
    $element.on('keydown', function (event) {
      if (event.keyCode < 47 || event.keyCode > 57) {
        return true;
      }

      var index = event.keyCode - 48;
      var selected = $element.find(validOptions).get(index - 1)
      selected.focus();
      selected.click();
      event.stopPropagation();
      return true;
    });
  }

  };
}]);

angular.module('system').directive('directionalFocus', [function () {
return {
  link: function ($scope, $element, $attrs) {
    var settings = $scope.$eval($attrs.directionalFocus);
    var validElement = settings.container;
    var validItems = settings.items;

    $element.bind('keydown', function (event) {
      
        var nextList, newItemIndex;
        var $focused = $(':focus');
        var currentListIndex = $focused.index();
        var currentList = $focused.closest(validElement);

        switch (event.keyCode) {
          case 39: // right
            nextList = currentList.next(validElement);
            newItemIndex = currentListIndex;
            break;
          case 37: // left
            nextList = currentList.prev(validElement);
            newItemIndex = currentListIndex;
            break;
          case 38: // up
            nextList = currentList;
            newItemIndex = currentListIndex - 1;
            break;
          case 40: // or down
            nextList = currentList;
            newItemIndex = currentListIndex + 1;
            break;
          case 13:
            return true;
          default:
            // event.preventDefault();
            return true;
        };
        event.preventDefault();
        var potentialListItems = nextList.find(validItems);
        
        if (potentialListItems.length === 0) {
          // we cannt move any further in this direction
          return true;
        }

        if (newItemIndex < 0) {
          // we've tried to move past the top so loop back
          newItemIndex = potentialListItems.length - 1;
        }

        if (currentList == nextList && newItemIndex > potentialListItems.length - 1) {
          // we've tried to move past the bottom so loop back
          newItemIndex = 0;
        }

        if (newItemIndex > potentialListItems.length - 1) {
          // move to next most reasonable position
          newItemIndex = potentialListItems.length - 1;
        }

        
        potentialListItems.get(newItemIndex).focus();
        return true;
    });
  }

  };
}]);