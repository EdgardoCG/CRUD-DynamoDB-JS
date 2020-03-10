AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000", //192.168.52.249
    accessKeyId: "JECG",
    secretAccessKey: "JECG"
});

var conexion = new AWS.DynamoDB.DocumentClient();

var miApp = angular.module('awsCrud', []);

miApp.controller('ControlAWS', ['$scope', function ($scope) {
    $scope.mensajePrueba = "Conexión AWS";
    $scope.consultarPersonas = function () {
        var params = {
            TableName: "Personas",
        };
        conexion.scan(params, function (err, data) {
            if (err) {
                alert("Error al consultar");
            } else {
                $scope.$evalAsync(function () {
                    $scope.personas = data.Items;
                })
            }
        })
    }
    $scope.agregar = function () {
        var params = {
            TableName: "Personas",
            Item: $scope.personaX
        }
        conexion.put(params, function (err, data) {
            $scope.$evalAsync(function () {
                if (err) {
                    Swal.fire(
                        'oops',
                        err.message,
                        'error'
                    )

                } else {
                    if (angular.equals({}, data)) {
                        Swal.fire(
                            'Exito',
                            'Registro correcto',
                            'success'
                        )
                        $scope.personas.push($scope.personaX);
                        $scope.personaX = {};
                        $("#nav-home-tab").click();
                    } else {
                        Swal.fire(
                            'Advertencia',
                            'Revisar consola',
                            'warming'
                        )
                        console.log(data)
                    }

                }
            });
        });
    }
    $scope.verPersona = function(persona){
        $scope.personaB = persona;
        $scope.personaM = angular.copy(persona);
        $("#exampleModal").modal('show');
    }

    $scope.cerrarModal = function(){
        $scope.personaM={}
        $("#nav-home-tab").click();
    }
    $scope.modificar = function(){
        var params={
            TableName:"Personas",
            Key:{
                "Curp":$scope.personaM.Curp
            },
            UpdateExpression:"Set nombre=:n,apellidos=:a",
            ExpressionAttributeValues:{
                ":a":$scope.personaM.apellidos,
                ":n":$scope.personaM.nombre
            },
            ReturnValues:"NONE"
        }
        conexion.update(params,function(err,data){
            $scope.$evalAsync(function () {
                if (err) {
                    Swal.fire(
                        'oops',
                        err.message,
                        'error'
                    )

                } else {
                   if (angular.equals({}, data)) {
                        Swal.fire(
                            'Éxito',
                            'Actualizacion correcta',
                            'success'
                        );
                        $scope.consultarPersonas();
                        var indexPersona = $scope.personas.indexOf($scope.personaB);
                        $scope.personas[indexPersona]=$scope.personaM;
                        console.log('se actualizo')
                        $("#exampleModal").modal('hide');
                        $("#nav-home-tab").click();   
                    }else {
                        Swal.fire(
                            'Advertencia',
                            'Revisar consola',
                            'warming'
                        )
                        console.log(data)
                    }

                }
                
            });
        });
         
    }
   
    $scope.eliminar = function(persona){
        var params = {
            TableName:"Personas",
            Key:{
                "Curp":persona.Curp
            },
            ReturnValues:"NONE"
        }
        conexion.delete(params,function(err,data){
            $scope.$evalAsync(function () {
                if (err) {
                    Swal.fire(
                        'oops',
                        err.message,
                        'error'
                    )

                } else {
                    if (angular.equals({}, data)) {
                        Swal.fire(
                            'Eliminado',
                            'Eliminado correctamente',
                            'success'
                        )
                        var indexPersona = $scope.personas.indexOf($scope.persona);
                        $scope.personas.splice(indexPersona,1);
                        $scope.personaX = {};
                        $("#nav-home-tab").click();
                    } else {
                        Swal.fire(
                            'Advertencia',
                            'Revisar consola',
                            'warming'
                        )
                        console.log(data)
                    }

                }
            });
        });

    }
}]);