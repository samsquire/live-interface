angular.module('system').factory('SubdocumentModel', [function () {

  function Subdocument() {
    return {
      ref: "",
      type: "subdocument"
    };
  }
  return Subdocument;

}])