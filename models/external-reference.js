angular.module('sytem').factory('ExternalReference', function () {
  function ExternalReference() {
    return {
      type: 'external'
    }
  };

  return ExternalReference;
})