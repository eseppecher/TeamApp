// Routing : for the autocompletion dans la barre de navigation

myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(false);
	
	$routeProvider
	
	    // Page par défault
		.when('/', {
			templateUrl: 'partials/default.html',
			controller	: 'mainController'
		})
		
		// Page d'acceuil
		.when('/home', {
			templateUrl : 'partials/home.html',
            controller	: 'HomeCtrl'
		})
              
        // Chargement des sites à partir du server
        .when('/server', {
            templateUrl : 'partials/server.html',
            controller	: 'ServerCtrl'
        })
              
        // Envoie de site sur le server
        .when('/send', {
            templateUrl : 'partials/send.html',
            controller	: 'SendCtrl'
        })
              

         
        // Page d'un site
        .when('/site/:siteId', {
            templateUrl : 'partials/site/detail.html',
            controller  : 'SiteDetailCtrl'
        })
         
        //SECTOR-list DETAIL with id transfer through URL
        .when('/site/:siteId/sector/:sectorId', {
            templateUrl: 'partials/site/list.html',
              controller: 'SectorCtrl'
        })
        
        // Page du détail d'un bloc : edition, photo, gps, suppression
        .when('/line/:lineId', {
            templateUrl : 'partials/detail.html',
            controller  : 'DataCtrl'
        })
    
        
              
         
              
        //USER management 
              
              .when('/user', {
                    templateUrl : 'partials/user.html',
                    controller	: 'UserCtrl'
                    })
              
              .when('/login', {
                    templateUrl : 'partials/login.html',
                    controller	: 'loginCtrl'
                    })
              
              
              
              
              
              
            

        // Autres cas
        .otherwise({
			redirectTo: '/',
			controller	: 'mainController'
		})
		
}]);
