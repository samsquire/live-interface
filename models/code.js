angular.module('system').factory('CodeModel', [function () {
  
  function CodeModel() {
    return {
      type: 'code',
      source: "",
      actions: [
        {'text': 'Reply', icon: 'mail reply'},
        {'text': 'Question', icon: 'question'},
        {'text': 'Dislike', icon: 'thumbs down'},
        {'text': 'Like', icon: 'thumbs up'},
        {'text': 'Go', icon: 'browser'}
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