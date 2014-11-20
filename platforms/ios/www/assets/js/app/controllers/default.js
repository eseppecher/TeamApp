// Déclaration de la variable des données
var db;
var id_last;


// Main controller ////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('mainController', function($scope, localStorageService, $location, $webSql)
{

    // Titre de la page par défaut
    $scope.title = 'Homepage';
    
    // Opening db
    db = $webSql.openDatabase('crewdb', '1.0', 'Test DB', 2*1024*1024);
                 
    // Fonction pour importer les données
    $scope.importData = function() {
        // WEB SQL filling database
        // Reading from html files with json architecture
        var dataLines = [];
        $.ajax({    url: 'datas/html/input.html',
                    type:'get',
                    async:false,
                    success: function(html,$scope) {dataLines = angular.fromJson(String(html));}  });
        // Deleting tables making room for new data and dat architecture
        db.dropTable("lines");
        // Creating a "lines" table in DB
        db.createTable('lines', {
                        "id"         : { "type": "INTEGER"   },
                        "topo"       : { "type": "TEXT"      },
                        "name"       : { "type": "TEXT"      },
                        "grade"      : { "type": "TEXT"      },
                        "rate"       : { "type": "INTEGER"   },
                        "description": { "type": "TEXT"      },
                        "latitude"   : { "type": "TEXT"      },
                        "longitude"  : { "type": "TEXT"      },
                        "accuracy"   : { "type": "INTEGER"   },
                        "sector"     : { "type": "TEXT"      },
                        "picture"    : { "type": "TEXT"      }});     
        // Filling tables with data from input.html
        for (var i=0; i<dataLines.length; i++) {
            // Mise en mémoire de l'identifiant du dernier bloc
            if (i == dataLines.length-1 ) {
                id_last = dataLines[i].id;
                alert(id_last);
            }
            db.insert('lines', {
                        "id"         : dataLines[i].id,
                        "topo"       : dataLines[i].topo,
                        "name"       : dataLines[i].name,
                        "grade"      : dataLines[i].grade,
                        "rate"       : dataLines[i].rate,
                        "description": dataLines[i].description,
                        "latitude"   : dataLines[i].latitude,
                        "longitude"  : dataLines[i].longitude,
                        "accuracy"   : dataLines[i].accuracy,
                        "sector"     : dataLines[i].sector,
                        "picture"    : dataLines[i].picture
                        }).then(function(results) { console.log(results.insertId); });
        }        
        alert('data imported from "input.html"');                     
    };
    
    // Fonction pour exporter les données            
    $scope.exportData = function() {        
        $scope.lines = [];
        db.selectAll("lines").then(function(results) {               
            for(i=0; i < results.rows.length; i++){
                document.write(results.rows.item(i).id          + ";");
                document.write(results.rows.item(i).name        + ";");
                document.write(results.rows.item(i).grade       + ";");
                document.write(results.rows.item(i).sector      + ";");
                document.write(results.rows.item(i).rate        + ";");
                document.write(results.rows.item(i).description + ";");
                document.write(results.rows.item(i).picture     + ";");
                document.write(results.rows.item(i).latitude    + ";");
                document.write(results.rows.item(i).longitude   + ";");
                document.write(results.rows.item(i).accuracy    + "<br>");
            }
        }); 
    }
    
    // Functions to move in the html pages (for buttons)
         
    $scope.home = function() {          // Page d'acceuil
        $location.path('/home');
    }
    
    $scope.list = function() {          // Page de la liste des blocs
        $location.path('/list');
    };
    
    $scope.add_route = function() {     // Page d'ajout d'un nouveau bloc
        $location.path('/add');
    };
    
    $scope.delete = function(lineId) {  // Page de suppression d'un bloc
        $location.path('/delete'+lineId);
    };
    
    $scope.detail = function(lineId) {  // Page des détails d'un bloc 
        $location.path('/detail'+lineId);
    };
	
	$scope.edit = function(lineId) {    // Page d'édition d'un bloc 
        $location.path('/edit'+lineId);
    };
    
	
});



// List controller ////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('ListCtrl', function($scope, $location, $webSql)
{

    $scope.lines = [];
    
    db.selectAll("lines").then(function(results) {
        for(i=0; i < results.rows.length; i++) {
                $scope.lines.push(results.rows.item(i));
        }
    });
 
});



// Data controller ////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('DataCtrl', function($scope, $routeParams, $location, $webSql)
{

    // Identifiant du bloc à éditer
    id = parseInt($routeParams.lineId);
    
    // Liste des données du bloc à éditer      
    $scope.line = {};
    
    // Récupération des données du bloc dans la liste 
    db.select("lines", {"id":{"value":id}}).then(
        function(results) {
            $scope.line         = results.rows.item(0);
            $scope.name         = results.rows.item(0).name;
            $scope.grade        = results.rows.item(0).grade;
            $scope.sector       = results.rows.item(0).sector;
            $scope.rate         = results.rows.item(0).rate;
            $scope.description  = results.rows.item(0).description;
        }
    );
    
    // Fonction : enregistrer les données
    $scope.update = function(name, sector, grade, rate, description) {
        db.update("lines", {"name"       : name       }, {'id': id});
        db.update("lines", {"sector"     : sector     }, {'id': id});
        db.update("lines", {"grade"      : grade      }, {'id': id});
        db.update("lines", {"rate"       : rate       }, {'id': id});
        db.update("lines", {"description": description}, {'id': id});
        $location.path('/list');
    };
    
    // Fonction : supprimer un bloc
    $scope.delete_route = function() {
        db.del('lines', {"id": id});
        $location.path('/list');
    }
                 
    $scope.shoot = function (){ // Lancement de l'appareil photo
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
    }
                 
                 
    onSuccess = function (imageURI) { // Succès de la prise de photo
        alert(imageURI);
        alert("success, relocating");
        $location.path('/list');
        //$location.path('/image'+imageURI);
    }
                 
    onFail = function (message) { // Echec de la prise de photo
        alert('Failed because: ' + message);
    }
                          
});

// Image controller ////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('ImageCtrl', function($scope, $routeParams, $location, $webSql)
{
    alert("getting in image CTRL");
    // Identifiant du bloc à éditer
    imageURI = parseInt($routeParams.imagURI);
    $scope.imageLocation = imageURI;
                 
    // Fonction : enregistrer l'adresse de l'image dans la base de données
    $scope.update = function(name, sector, grade, rate, description) {
        db.update("lines", {"name"       : name       }, {'id': id});
        db.update("lines", {"sector"     : sector     }, {'id': id});
        db.update("lines", {"grade"      : grade      }, {'id': id});
        db.update("lines", {"rate"       : rate       }, {'id': id});
        db.update("lines", {"description": description}, {'id': id});
        $location.path('/list');
    };
                 
    var image = document.getElementById('myImage');
    image.src = imageURI;
                 
                 
});                 



// Add controller ////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('AddCtrl', function($scope, $location, $webSql)
{
	$scope.save = function(name, sector, grade, rate, description) {
	    id_last = id_last + 1;
	    db.insert('lines', {
                        "id"         : id_last,
                        "topo"       : "",
                        "name"       : name,
                        "grade"      : grade,
                        "rate"       : rate,
                        "description": description,
                        "latitude"   : "",
                        "longitude"  : "",
                        "accuracy"   : 1000,
                        "sector"     : sector,
                        "picture"    : ""
                        });
		$location.path('/detail'+id_last);                    
	}	
});


// Delete controller ////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('DeleteCtrl', function($scope, $routeParams, $location, $webSql)
{


});






// Gps controller ////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('GpsCtrl', function($scope, $routeParams, $location, $webSql)
{

    // Fonction : aquisition des données gps             
    $scope.pingGps = function(){
        gpsTriger();
    };
    
        // Fonction : enregistrer les données
    $scope.updateGPS = function() {
        db.update("lines", {"latitude" : CurrentLatitude }, {'id': id });
        db.update("lines", {"longitude": CurrentLongitude}, {'id': id });
        db.update("lines", {"accuracy" : CurrentAccuracy }, {'id': id });
        gpsoff == true;
    }
});
