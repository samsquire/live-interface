angular.module('system').factory('RelationModel', [function () {

  function Property() {
    return {
      type: '',
      description: ''
    }
  }

  function RelationModel() {
    return {
      subject: Property(),
      predicate: Property(),
      object: Property(),
      type: 'relation'
    };
  }

  return RelationModel;

}]);