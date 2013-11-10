angular.module('system').factory('CodeModel', [function () {
  
  function CodeModel() {
    return {
      source: "",
      editorOptions: {
        lineWrapping : true,
        lineNumbers: true,
        mode: 'javascript',
        matchBrackets: true
      }

    };
  };

  return CodeModel;

}]);