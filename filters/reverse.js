angular.module('system').filter('reverse', function () {
  return function (data) {
    return data.reverse();
  };
});