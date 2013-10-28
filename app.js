$('.ui.sidebar')
  .sidebar()
;

$('.demo.sidebar')
  .sidebar('attach events', '.toggle.sidebar')
;
$('.demo.sidebar')
  .removeClass('disabled')
;

angular.module('system', ['ui.router']);


angular.module('system').config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/home");
  //
  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/home",

      views: {
        '': {
          templateUrl: 'views/home.html',
          controller: 'home'
        },
        '@editor': {
          templateUrl: 'views/editor.html',
          controller: 'editor'
        },
        '@dropdown': {
          templateUrl: 'views/autocomplete.html',
          controller: 'autocomplete'
        },
        '@spaces': {
          templateUrl: 'views/spaces.html',
          controller: 'spaces'
        }
      }
    })
    .state('home.embed', {
      url: '/embed',
      templateUrl: 'views/embed.html',
      controller: 'embed'
    })

    
    ;

    });

