angular.module('system').factory('ListModel', [function () {

  function ListModel() {
    return {
      items: [{text: "&nbsp;"}],
      open: false,
      type: 'list'
    };
  }

  return ListModel;

}]);