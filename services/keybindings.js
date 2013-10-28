angular.module('system').factory('keybinding', ['$rootScope', function ($rootScope) {
  function Keybindings() {
    var self = this;

    self.bind = function (combination, event) {
        key(combination, function(e) {
          $rootScope.$emit(event);
          e.preventDefault();
          return false;
        });
      };
    };
    return new Keybindings();
}]);