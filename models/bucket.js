angular.module('system').factory('BucketModel', [function () {

  function BucketModel() {
    return {
      lines : []
    }
  }

  return BucketModel;

}]);