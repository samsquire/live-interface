angular.module('system').service('sparql-query',
  ['$templateCache','$compile',
  function SPARQLQuery($templateCache, $compile) {
    var self = this;


  self.queryObject = function (subject, predicate, object) {
    return {a: subject, b: predicate, c: object};
  };

  self.send = function (query, data, callback) {



    var parameters = self.queryObject();

    var template = $templateCache.get(query);
    console.log(template);
    
    var rendered = _.template(template)(data);
    
      console.log(rendered);


        $.ajax("http://sampc:3030/tdb/sparql", {
          type: "POST",
          data: {query: rendered},
          headers:
          {
            Accept: "application/sparql-results+json"
          }
        }).then(function (data) {
          // console.log(data.results.bindings);
          
            if (data.results.length === 0) {
              // console.log("No results");
             return; 
            }

          var results = data.results.bindings.reduce(
            
            function (pullout, current) {
              if (current.a)
              pullout.a.push(current.a.value);
              if (current.b)
              pullout.b.push(current.b.value);
              if (current.c)
              pullout.c.push(current.c.value);
              return pullout;
            }, {a: [], b: [], c: []} );
          
          // console.log(results.a);
          // console.log(results.b);
          // console.log(results.c);
          results.raw = data;
          callback(results);
        },
                function (error) {
                console.log(error);  
                });
    



}

}]);