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
      }
      
      if (event.keyCode == 13) {
        if ($(event.target).is(':focus')) {
          $(event.target).click();
        }
      }

      return true;
    });
  }

  };
}]);

angular.module('system').directive('directionalFocus', [function () {
return {
  link: function ($scope, $element, $attrs) {
    var validElement = $attrs.directionalFocus;

    $element.bind('keydown', function (event) {
      
        var nextList, newItemIndex;
        var $focused = $(':focus');
        var currentListIndex = $focused.index();
        var ol = $focused.closest(validElement);
        

        switch (event.keyCode) {
          case 39: // right
            nextList = ol.next(validElement);
            newItemIndex = currentListIndex;
            break;
          case 37: // left
            nextList = ol.prev(validElement);
            newItemIndex = currentListIndex;
            break;
          case 38: // up
            nextList = ol;
            newItemIndex = currentListIndex - 1;
            break;
          case 40: // or down
            nextList = ol;
            newItemIndex = currentListIndex + 1;
            break;
          case 13:
            // event.preventDefault();
            return true;
            break;
          default:
            event.preventDefault();
            return true;
        };
        event.preventDefault();
        var potentialListItems = nextList.find('li');
        
        if (potentialListItems.length === 0) {
          // we cannt move any further in this direction
          return;
        }

        if (newItemIndex < 0) {
          // we've tried to move past the top so loop back
          newItemIndex = potentialListItems.length - 1;
        }

        if (newItemIndex > potentialListItems.length - 1) {
          // we've tried to move past the bottom so loop back
          newItemIndex = 0;
        }

        if (potentialListItems.length < newItemIndex) {
          // move to next most reasonable position
          newItemIndex = potentialListItems.length - 1;
        }
        potentialListItems.get(newItemIndex).focus();
        return true;
    });
  }

  };
}]);