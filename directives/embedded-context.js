angular.module('system').directive('embeddedContext', [function () {
  return {
    // template: '<a href="" rel="embedded" data-kind="{{ field.type }}" data-id="{{ $index }}"></a>',
    template: '<a href="" rel="embedded" data-kind="{{ type }}" data-id="{{ $index }}"></a>',
    replace: true,
    scope: {
      field: '='
    },
    restrict: 'E',
  };
}])