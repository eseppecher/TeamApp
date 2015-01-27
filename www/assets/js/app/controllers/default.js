// Déclaration de la variable des données
var db;
var gpsoff=true;


// Main controller ////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('mainController', function($scope, localStorageService, $location, $webSql, Camera)
{

    // Titre de la page par défaut
    $scope.title = 'Homepage';
    
    $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
    };
    
    // Opening db
    db = $webSql.openDatabase('crewdb', '1.0', 'Test DB', 2*1024*1024);
                 
                 
    // Fonction pour importer les données
    $scope.importData = function() { // WEB SQL filling database
                 
        // Reading from html files with json architecture
        var dataSites, dataSectors, dataLines, dataParkings = [];
        $.ajax({ url: 'datas/html/input-sites.html', type:'get', async:false, success: function(html, $scope) { dataSites = angular.fromJson( String(html)); } });
        $.ajax({ url: 'datas/html/input-sectors.html', type:'get', async:false, success: function(html, $scope) { dataSectors = angular.fromJson( String(html)); } });
        $.ajax({ url: 'datas/html/input-lines.html', type:'get', async:false, success: function(html, $scope) { dataLines = angular.fromJson( String(html)); } });
                 
                 
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
                        "image"      : { "type": "TEXT"      },
                        "site"       : { "type": "INTEGER"   },
                        "sector"     : { "type": "INTEGER"   },
                        "rank"     : { "type": "INTEGER"   },
                        "date"     : { "type": "INTEGER"   }
                       
        });
                 
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
                        "site"       : dataLines[i].site,
                        "sector"     : dataLines[i].sector,
                        "image"      : dataLines[i].picture,
                        "rank"       : dataLines[i].rank,
                        "date"       : dataLines[i].date
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
    
    $scope.delete = function(lineId) {  // Page de suppression d'un bloc
        $location.path('/delete'+lineId);
    };
    
    $scope.detail = function(lineId) {  // Page des détails d'un bloc 
        $location.path('/detail'+lineId);
    };
	
	$scope.edit = function(lineId) {    // Page d'édition d'un bloc 
        $location.path('/edit'+lineId);
    };
                 
                 $scope.getPhoto = function() {
                 Camera.getPicture().then(function(imageURI) {
                                        var d = new Date();
                                        var time = d.getTime();
                                        db.update("lines", {"image": imageURI, "date": time}, {'id': id});
                                        
                                        $location.path('/detail'+id);
                                        
                                        
                                        }, function(err) {
                                        console.err(err);
                                        });
                 };
    
                 
	
});



// List controller ////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('HomeCtrl', function($scope, $location, $webSql)
{
    db.selectAll("sites").then(function(results) {
        $scope.sites = [];
        for(i=0; i < results.rows.length; i++){
            $scope.sites.push(results.rows.item(i));
        }
    });
                 
    $scope.detail = function(siteId) {
        $location.path('/site/' + siteId);
    };
                 
});

// DETAIL SITE ////////////////////////////////////////////////////////////////////////////////////////
myApp.controller('SiteDetailCtrl', function($scope, $routeParams, $location, $webSql) {
                 

        id = parseInt($routeParams.siteId);
        var sita;
        $scope.site = {};
        db.select("sites", { "id": { "value": id}}).then(function(results) {
                    $scope.site = results.rows.item(0);
                    sita = results.rows.item(0);
                                                                  
                    /* Get child sector */
                    $scope.sectors = [];
                    db.select("sectors",{"site":{"value":id}}).then(function(results) {
                            for(var i=0; i < results.rows.length; i++){
                                $scope.sectors.push(results.rows.item(i));
                            }
                    }); // sector
        }); // site
                 
                 
        $scope.lineList = function(siteId,sectorId) {
            $location.path('/site/' + siteId + '/sector/' + sectorId);
        };
});

// SECTOR both list or map display/////////////////////////////////////////////////////////////////////
myApp.controller('SectorCtrl', function($scope, $routeParams, $location, $filter, $webSql) {
        id = parseInt($routeParams.siteId);
        idd = parseInt($routeParams.sectorId);
                 
                 $scope.name         = ""; // initializing modal for addition
                 $scope.grade        = "6a"; // initializing modal for addition
                 $scope.rate         = -1; // initializing modal for addition
                 $scope.description  = ""; // initializing modal for addition
                 $scope.sector       = idd; // initializing modal for addition
                 
        var sita;
                 
        $scope.currency = idd;
                 
        $filtering = function(items,x) {
                 $result = [];
                 for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if(item.sector === x) { $result.push(item); }
                }
                 return $result;
        };
                 
        $scope.site = {};
        $scope.lines = [];
        $scope.sectors = [];
        db.select("sites", { "id": { "value": id}}).then(function(results) {
                $scope.site = results.rows.item(0);
                sita = results.rows.item(0);
                                                                  
                /* Get child sector */
                db.select("sectors",{"site":{"value":id}}).then(function(results) {
                        for(var i=0; i < results.rows.length; i++){
                                $scope.sectors.push(results.rows.item(i));
                        }
                                                                                                                  
                                                                                                                  
                        /* Get child line */
                        db.select("lines",{"site":{"value":id}}).then(function(results) {
                                    for(var i=0; i < results.rows.length; i++){
                                            if(results.rows.item(i).sector == idd){
                                                    $scope.lines.push(results.rows.item(i));
                                            }
                                    }
                                                                                                                                                                
                                    
                        });
                });
        });
                 
        $scope.select = function(xid) {
                 if(xid === 0){
                        $scope.current = { "id":0,"name": "Toutes les voies"};
                        $scope.lines = $scope.list;
                 }
                 else{
                        $scope.current = {};
                        db.select("sectors", { "id": { "value": xid}}).then(function(results) { $scope.current = results.rows.item(0);});
                                $scope.lines = $filtering($scope.list,xid);
                        }
        };
                 
                 
                 
        $scope.listing = function(siteId,sectorId) {
                 $location.path('/site/' + siteId + '/sector/' + sectorId);
        };
        $scope.detail = function(lineId) {
                 $location.path('/line/' + lineId);
        };
        $scope.back = function(siteId) {
                 $location.path('/site/' + siteId);
        };
                 
        $scope.addLine = function() {
                 $location.path('/add/' + id + '/sector/' + idd);
        };
            
                 
        // Annuler l'édition et remmetre à jours les ng-model
        $scope.cancelAdd = function() {
                 $scope.name         = ""; // resseting the ng-model
                 $scope.grade        = "6a"; // resseting the ng-model
                 $scope.rate         = -1; // resseting the ng-model
                 $scope.description  = ""; // resseting the ng-model
                 $scope.sector       = idd; // resseting the ng-model
                 
                 $('#addModal').modal('hide');
        };
                 
        $scope.saveAdd = function() {
                 var d = new Date();
                 var time = d.getTime();
                 var abstract = $scope.description;
                 alert($scope.description);
                 
                 db.insert('lines', {
                           "id"         : time,
                           "name"       : $scope.name,
                           "grade"      : $scope.grade,
                           "rate"       : $scope.rate,
                           "description": $scope.description,
                           "latitude"   : "",
                           "longitude"  : "",
                           "accuracy"   : 1000,
                           "sector"     : $scope.sector,
                           "site"     : id,
                           "image"    : "",
                           "date"    : time
                           });
                 

                 
                 $('#addModal').modal('hide');
                 $('body').removeClass('modal-open');
                 $('.modal-backdrop').remove();
                 
                 $location.path('/line/' + time);
        }
                 
                 
        $scope.startOrder = function(){
                $('#orderModal').modal('show');
                 $scope.listTemp = [];
                 $scope.listTemp = $filter('orderBy')($scope.lines, 'rank');
        }
                 
                 
                 
        $scope.saveOrder = function() { // add update date to the lines modified
                 $('#orderModal').modal('hide');
                 
                 //saving the new ranks in the db

                 for(var i=0; i < $scope.listTemp.length; i++){
                        db.update("lines", {"rank" : i+1}, {'id': $scope.listTemp[i].id });
                 
                 }
                 
                 // resseting lines array with the current ranks ; )
                 $scope.lines = [];
                 db.select("lines",{"site":{"value":id}}).then(function(results) {
                        for(var i=0; i < results.rows.length; i++){
                                    if(results.rows.item(i).sector == idd){
                                                $scope.lines.push(results.rows.item(i));
                                    }
                        }
                                                               
                                                               
                });

                 
        }
        
        $scope.cancelOrder = function() {

                 /* Get child line */
                 $scope.lines=[];
                 db.select("lines",{"site":{"value":id}}).then(function(results) {
                            for(var i=0; i < results.rows.length; i++){
                                        if(results.rows.item(i).sector == idd){
                                                    $scope.lines.push(results.rows.item(i));
                                        }
                            }
                $('#orderModal').modal('hide');
                                                               
                });
        }
});



// Data controller ////////////////////////////////////////////////////////////////////////////////////////
myApp.controller('DataCtrl', function($scope, $routeParams, $location, $webSql, Camera)
{
     $scope.localizing = false;
    // Identifiant du bloc à éditer
    id = parseInt($routeParams.lineId);
    
    // Liste des données du bloc à éditer      
    $scope.line = {};
    $scope.sectors = [];
    $scope.edit = {};
    
    // Récupération des données du bloc dans la liste 
    db.select("lines", {"id":{"value":id}}).then(
        function(results) {
            $scope.line         = results.rows.item(0);
            $scope.name         = results.rows.item(0).name; // for edit ng-model
            $scope.grade        = results.rows.item(0).grade; // for edit ng-model
            $scope.rate         = results.rows.item(0).rate; // for edit ng-model
            $scope.description  = results.rows.item(0).drescription; // for edit ng-model
            $scope.sector       = results.rows.item(0).sector; // for edit ng-model
            $scope.site         = results.rows.item(0).site; // for edit ng-model
            $scope.accuracy     = results.rows.item(0).accuracy;
            var siteId = results.rows.item(0).site;
                                    
                                                 db.select("sectors",{"site":{"value":siteId}}).then(function(results) {
                                                                                                 for(var i=0; i < results.rows.length; i++){
                                                                                                 $scope.sectors.push(results.rows.item(i));
                                                                                                 }});
        });
    

                 
                 
    // Enregistrer les données après l'édition
    $scope.updateEdit = function(name, sector, grade, rate, description) {
        var d = new Date();
        var time = d.getTime();
        db.update("lines", {"name"       : name,
                            "grade"      : grade,
                            "rate"       : rate,
                            "description": description,
                            "sector"     : sector,
                            "date": time
                           }, {'id': id});
        $('#editModal').modal('hide');
                 
    };
    
    // Annuler l'édition et remmetre à jours les ng-model
    $scope.cancelEdit = function() {
        $scope.name         = $scope.line.name; // resseting the ng-model
        $scope.grade        = $scope.line.grade; // resseting the ng-model
        $scope.rate         = $scope.line.rate; // resseting the ng-model
        $scope.description  = $scope.line.drescription; // resseting the ng-model
        $scope.sector       = $scope.line.sector; // resseting the ng-model
                 
        $('#editModal').modal('hide');
    };
                 
                 
    // Supprimer un bloc
    $scope.delete_route = function() {
        db.del('lines', {"id": id});
                 $('#deleteModal').modal('hide');
                 $('body').removeClass('modal-open');
                 $('.modal-backdrop').remove();
        $location.path('/site/' + $scope.line.site + '/sector/' + $scope.line.sector);
    }
    
    // Retour à la vue secteur, avec une alert si le GPS tourne
    $scope.backSector = function() {
        if(gpsoff == false){
                 $('#backModal').modal('show');
        }
        else{
                 $location.path('/site/' + $scope.site + '/sector/' + $scope.sector);
        }
    };
    
    // Sauvegarder la postion avec redirection a la vue secteur si requete en cours
    $scope.savePosition = function(redirection){
                 gpsoff = true;
                 
                 db.update("lines", {"latitude" : CurrentLatitude }, {'id': id });
                 db.update("lines", {"longitude": CurrentLongitude}, {'id': id });
                 db.update("lines", {"accuracy" : CurrentAccuracy }, {'id': id });
                 $('#backModal').modal('hide');
                 $('body').removeClass('modal-open');
                 $('.modal-backdrop').remove();
                 if(redirection==true){
                    $scope.backSector();
                 }
                 else{
                    $scope.accuracy = CurrentAccuracy;
                    $scope.localizing = false;
                 }
                 
    };
    
    // Abandon du GPS et retour à la vue secteur
    $scope.forgetPosition = function(){
                 gpsoff = true;
                 $('#backModal').modal('hide');
                 $('body').removeClass('modal-open');
                 $('.modal-backdrop').remove();
                 $scope.backSector();
    };

                 
    //GPS request foncution common of all to not having it stoping while editing
    $scope.pingGps = function(){
        $scope.localizing = true;
        gpsTriger();
    };
                 
                          
});




// Add controller ////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('AddCtrl', function($scope, $location, $routeParams, $webSql)
{
    
    if (i == dataLines.length-1 ) {
            id_last = dataLines[i].id;
                 alert(id_last);
                 }
    alert(id_last);
                 
    siteId = parseInt($routeParams.siteId);
    sectorId = parseInt($routeParams.sectorId);
    
    /* Getting sector for dropdown list form */
    $scope.sectors = [];
                 
    db.select("sectors",{"site":{"value":siteId}}).then(function(results) {    
                                                for(var i=0; i < results.rows.length; i++){
                                                            $scope.sectors.push(results.rows.item(i));
                                                }
    });
                                                                                                                  
                 
                 
	$scope.save = function(name, sector, grade, rate, description) {
                 alert("saving " + name + " " + grade + " " + sector + " at " + siteId );
	    id_last = id_last + 1;
                 alert(id_last);
        var d = new Date();
        var time = d.getTime();
        
	    db.insert('lines', {
                        "id"         : id_last,
                        "name"       : name,
                        "grade"      : "6a",
                        "rate"       : rate,
                        "description": description,
                        "latitude"   : "",
                        "longitude"  : "",
                        "accuracy"   : 1000,
                        "sector"     : sector,
                        "site"     : siteId,
                        "image"    : "",
                        "date"    : time
                        });
                 
		$location.path('/detail'+id_last);
    }
    
        $scope.goBack = function() {
                 $location.path('/site/' + siteId + '/sector/' + sectorId);
        };
	
});
