angular.module('system').factory('BucketModel', [function () {

  function BucketModel() {
    return {
      lines : [],
      headings: []
    }
  }

  return BucketModel;

}]);