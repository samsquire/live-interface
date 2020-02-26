angular.module('system').controller('recursive', ['$rootScope', '$scope', '$http',
  function ($rootScope, $scope, $http) {

    console.log("questions");
    $scope.answers = {};
    $scope.questions = [
      {"question": "Product", "answer": "", "answers": []}
    ];

    $scope.create = function () {
      $scope.questions.push({"question": "", "answer": "", "answers": []});
    }

    $scope.rescan = function () {
      var empty = false;
      var empties = [];

      $scope.questions.reduce(function (answers, question) {
            var parsed = $.parseHTML(question.answer);

            if (question.question === "" && question.answers.length === 0) {
              console.log(question);
              if (empty) {
                empties.push($scope.questions.indexOf(question));
              } else {
                empty = true;
              }
            }

            if (parsed === null) {
              return answers;
            }

            answers[question.question] = question;
            
            parsedText = parsed.reduce(function (collect, element) {
              var text = $(element).text();
              if (text.length > 0) {
                collect.push(text);
              }
              return collect;
            }, []);

            
            deletions = _.partial(_.without, question.answers);
            var deleted = deletions.apply(null, parsedText);
            question.answers = _.partial(_.without, question.answers).apply(null, deleted);
            // console.log(parsedText, "vs", question.answers, deleted);

            found = parsedText.reduce(function (answers, newQuery) {
              console.log(newQuery);
              if (newQuery.length == 0) { return answers; }
              
              if (!answers.hasOwnProperty(newQuery)) {
                answers[newQuery] = {"question": newQuery, "answer": "", answers: []}
                $scope.questions.push(answers[newQuery]);
                question.answers.push(newQuery);
              } else {
                if (question.answers.indexOf(newQuery) == -1) {
                  question.answers.push(newQuery);
                }
              }
              return answers;
            }, $scope.answers);
          

            return answers;
        }, $scope.answers);

      empties.forEach(function (index) {
        $scope.questions.splice(index, 1);
      })

      $scope.$apply();
      var data = JSON.stringify($scope.questions);
      console.log(data);
      $http.post('http://127.0.0.1:4442/rd', data).success(function (response) {
        $scope.diagram = response;
      });
    }

}]);