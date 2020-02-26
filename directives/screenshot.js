angular.module('system').directive('screenshot', [function () {
  return {
    restrict: 'A',

    link: function ($scope, $element, $attrs) {

      var metadata = $scope.$eval($attrs.of);
      console.log(metadata);
      var embeddedSelector = "[data-document-id=" + metadata.documentId + "] a[rel=embedded][data-id=" + metadata.fieldIndex + "][href=" + metadata.instanceName + "]";
      console.log(embeddedSelector);
      var embeddedContext = $(embeddedSelector).next().find('.content');

      console.log(embeddedContext);
      html2canvas(embeddedContext[0], {
        onrendered: function(canvas) {
          $element.append(canvas);
          // var shelfItem = $(canvas).wrap('<span>');
          // shelfItem.parent().append(action.text + " " + $scope.activeField.type);
          // shelfItem.addClass("shelfItem");
          // $(".shelf").append(shelfItem.parent());
        }
      });
    }
  }
}]);