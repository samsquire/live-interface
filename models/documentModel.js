angular.module('system').factory('DocumentModel', function () {

  function Document() {
    var self = this;
    self.contents = "";
    self.fields = [];
    self.instances = [];
    self._id = new Date().getTime();
  }

return Document;
});