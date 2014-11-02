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
		})
		
		// Page de la liste
        .when('/list', {
            templateUrl : 'partials/list.html',
            controller  : 'ListCtrl'
        })
        
        // Page du détail d'un bloc
        .when('/detail:lineId', {
            templateUrl : 'partials/detail.html',
            controller  : 'DataCtrl'
        })
        
        // Page d'édition d'un bloc
        .when('/edit:lineId', {
            templateUrl : 'partials/edit.html',
            controller  : 'DataCtrl'
        })
        
        // Page de suppression d'un bloc
        .when('/delete:lineId', {
            templateUrl : 'partials/delete.html',
            controller  : 'DataCtrl'
        })
        
        // Page d'ajout d'un nouveau bloc
        .when('/image_saving:imageURI', {
            templateUrl : 'partials/image_saving.html',
            controller  : 'ImageCtrl'
        })
        
        // Page d'ajout d'un nouveau bloc
        .when('/add', {
            templateUrl : 'partials/add.html',
            controller  : 'AddCtrl'
        })

        // Autres cas
        .otherwise({
			redirectTo: '/',
			controller	: 'mainController'
		})
		
}]);
