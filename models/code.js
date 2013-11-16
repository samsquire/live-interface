angular.module('system').factory('CodeModel', [function () {
  
  function CodeModel() {
    return {
      type: 'code',
      source: "",
      actions: [
        {'text': 'Execute', icon: 'play', rel: 'execute'}
      ],
      refresh: false,
      editorOptions: {
        lineWrapping : true,
        theme: 'lesser-dark',
        lineNumbers: true,
        mode: 'javascript',
        matchBrackets: true
      }

    };
  };

  return CodeModel;

}]);