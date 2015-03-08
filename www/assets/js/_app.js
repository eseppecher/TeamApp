
// trying to add a module to simplify use of camera trough angular structure
var myAppModule = angular.module('myCamera', []);

myAppModule.factory('Camera', ['$q', function($q) {
                          
    return {
        getPicture: function(options) {
            var q = $q.defer();
                          
            navigator.camera.getPicture(function(result) {
                    // Do any magic you need
                    q.resolve(result);
            }, function(err) {
                    q.reject(err);
            }, options);
                          
            return q.promise;
                          
        }
    }
}]);





//app declaration called in html through ngApp
var myApp = angular.module('myApp', [
          'ngRoute',
           'myCamera',
          'ngResource',
          'LocalStorageModule',
          'ngSanitize',
          'angular-websql',
          'ui.sortable',
          'parse-angular'
          ]);




myApp.config(['localStorageServiceProvider', function(localStorageServiceProvider){
	  localStorageServiceProvider.setPrefix('bonoway');
	  // localStorageServiceProvider.setStorageCookieDomain('example.com');
	  // localStorageServiceProvider.setStorageType('sessionStorage');
	}]);


