angular.module('system').directive('autoannotate', ["$q", function ($q) {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {

      var delay = $attrs.autoannotateDelay;
      var recipient = $scope.$eval($attrs.autoannotate);

      var preprocess = function (event) {
        var edited = $(window.getSelection().anchorNode).parent();
        var start = edited.index();

        if (!dirtyTest(edited.text())) { return; }

        function dirtyTest(text) {
          return /[\=\.\{\"\'\$\-\{\<\>\}\(\)]/.test(text);
        }

        var elements = $element.children();
        console.log($element, elements);

        function isEmpty(element) {
          var $wrapped = $(element);
          var text = $wrapped.text()
          return text.length == 0 || !(dirtyTest(text) || $wrapped.hasClass("embedded-context"));
        }

        var before, beforebefore;
        // find hole above
        var i;
        
        for (i = start; i > 0; i--) {
          before = elements[i - 1];
          beforebefore = elements[i - 2];
          if (isEmpty(before) && isEmpty(beforebefore)) {
            break;
          }
        }
        
        console.log("Section Start", i, elements[i]);
        for (j = start; i < elements.length; j++) {
          after = elements[j + 1];
          afterafter = elements[j + 2];
          if (isEmpty(after) && isEmpty(afterafter)) {
            break;
          }
        }
        console.log("Section End", j, elements[j]);

        var section = elements.slice(i, j + 1);
        var text = section.not(".embedded-context,[rel=embedded]").map(function () {
          return $(this).html();
        }).toArray().join("\n");
        console.log("Section text", text);

        var determined = $q.defer();

        determined.promise.then(function (language) {
          console.log("Determined language to be", language);
          var colors = {
            'Ruby': '#F58EBE',
            'Php': '#B48AF2',
            'Python': '#8AF29A',
            'Java': '#F2DA8A',
            'Gcc': 'gray',
            'Javascript': 'green'
          };
          section.css({'background-color': colors[language] });
        });

        recipient(text, determined);
        // find a hole above
        // find a hole below
        // mark the elements in-between as being part of this block
        // attempt to classify the block
        
        // if the elements above the hole or below the hole have the same
        // id as this block, then we are splitting the block

        

        // recipient();
      };

      var handler = _.debounce(preprocess, delay);

      

      $element.on('keyup', function (event) {
        if (event.which === 32) {

        }
      });

      $element.parent().on('keyup', 'div', handler);

    }
  }
}]);