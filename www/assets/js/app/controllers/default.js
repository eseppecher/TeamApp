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
    $scope.importData = function() { // WEB SQL filling database
                 
        // Reading from html files with json architecture
        var dataSites, dataSectors, dataLines, dataParkings = [];
        $.ajax({ url: 'datas/html/sites.html', type:'get', async:false, success: function(html, $scope) { dataSites = angular.fromJson( String(html)); } });
        $.ajax({ url: 'datas/html/sectors.html', type:'get', async:false, success: function(html, $scope) { dataSectors = angular.fromJson( String(html)); } });
        $.ajax({ url: 'datas/html/lines.html', type:'get', async:false, success: function(html, $scope) { dataLines = angular.fromJson( String(html)); } });
                 
                 
        // Deleting tables making room for new data and dat architecture
        db.dropTable("sites");
        db.dropTable("sectors");
        db.dropTable("lines");
        
        db.createTable('sites', { // Creating a "sites" table in DB
                       "id"         : { "type":"INTEGER"    },
                       "name"       : { "type": "TEXT"      },
                       "description": { "type": "TEXT"      },
                       "tags"       : { "type": "TEXT"      },
                       "couverture" : { "type": "TEXT"      },
                       "latitude"   : { "type": "TEXT"      },
                       "longitude"  : { "type": "TEXT"      },
                       "volume"     : { "type": "INTEGER"   }
                       });
                 
        db.createTable('sectors', { // Creating a "sectors" table in DB
                       "id"         : { "type":"INTEGER"},
                       "name"       : { "type": "TEXT"},
                       "latitude"   : { "type": "TEXT" },
                       "longitude"  : { "type": "TEXT" },
                       "approach"   : { "type": "TEXT" },
                       "volume"     : { "type": "INTEGER" },
                       "site"       : { "type": "INTEGER" }
                       });

        db.createTable('lines', { // Creating a "lines" table in DB
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
                        "image"    : { "type": "TEXT"      }});
                 
        // Filling tables with data from input.html
        for(var i=0; i< dataSites.length; i++){
                 db.insert('sites', {
                           "id"         : dataSites[i].id,
                           "name"       : dataSites[i].name,
                           "description": dataSites[i].description,
                           "tags"       : dataSites[i].tags,
                           "couverture" : dataSites[i].couverture,
                           "latitude"   : dataSites[i].latitude,
                           "longitude"  : dataSites[i].longitude,
                           "volume"     : dataSites[i].volume
                           }).then(function(results) { console.log(results.insertId);
                });
        }
                 
        for(var i=0; i< dataSectors.length; i++){
                 db.insert('sectors', {
                           "id"         : dataSectors[i].id,
                           "name"       : dataSectors[i].name,
                           "latitude"   : dataSectors[i].latitude,
                           "longitude"  : dataSectors[i].longitude,
                           "approach"   : dataSectors[i].approach,
                           "volume"     : dataSectors[i].volume,
                           "site"       : dataSectors[i].site
                           }).then(function(results) { console.log(results.insertId);
                });
        }
                 
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
                        "image"    : ""
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
                document.write(results.rows.item(i).image     + ";");
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

myApp.controller('DataCtrl', function($scope, $routeParams, $location, $webSql, Camera)
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
            $scope.image  = results.rows.item(0).image;
        }
    );
    
    // Fonction : enregistrer les données
    $scope.update = function(name, sector, grade, rate, description) {
        db.update("lines", {"name"       : name       }, {'id': id});
        db.update("lines", {"sector"     : sector     }, {'id': id});
        db.update("lines", {"grade"      : grade      }, {'id': id});
        db.update("lines", {"rate"       : rate       }, {'id': id});
        db.update("lines", {"description": description}, {'id': id});
        db.update("lines", {"image": "imageURI"}, {'id': id});
        $location.path('/list');
    };
    
    // Fonction : supprimer un bloc
    $scope.delete_route = function() {
        db.del('lines', {"id": id});
        $location.path('/list');
    }
                 
              
    // fonction pour prendre une photo, utilisant le module Camera
    $scope.getPhoto = function() {
        Camera.getImage().then(function(imageURI) {
            db.update("lines", {"image": imageURI}, {'id': id});
             
            $location.path('/detail'+id);


        }, function(err) {
            console.err(err);
        });
    };
    
                          
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
                        "image"    : ""
                        });
		$location.path('/detail'+id_last);                    
	}	
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
