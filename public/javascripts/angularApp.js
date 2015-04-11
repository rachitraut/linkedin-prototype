angular.module('MyApp', ['ui.router'])

.controller('userRegController', ['$scope', userRegistration])

.controller('userLoginController', ['$scope', 'userservice', userLogin])

.factory('userservice', ['$http', '$state', userServiceHandler])


function userServiceHandler($http)
{
    var serviceObj = { };
    
    function logUserIn(existingUser)
    {
        console.log("In logUserIn " + existingUser);
        
        return $http.post('/login/user', existingUser)
        .success(function(response){
        
                console.log("In POST success");
        })
        .error(function(response){
                console.log("In POST error");
        });
    }
    
    return{
        
        dataObj: serviceObj,
        logUserIn: logUserIn
    }
}



function userLogin($scope, userservice)
{
    var service = userservice;

    /*========= HANDLE MULTIPLE VIEWS HERE ========*/
    $scope.goLogin = true;
    $scope.goReg = false;
    $scope.goComReg = false;
    $scope.goCompanyLogin = false;
    
    $scope.goLogIn = function()
    {   
        $scope.goComReg = false;
        $scope.goLogin = !$scope.goLogin;  
        $scope.goReg = false;
    }
    
    $scope.goRegister = function()
    {   
        $scope.goReg = !$scope.goReg;   
        $scope.goLogin = false;
    }
    
    $scope.goCompanyReg = function()
    {
        $scope.goCompanyLogin = false;
        $scope.goComReg = !$scope.goComReg;
    }
    
    $scope.goCompanyLogIn = function()
    {
         $scope.goComReg = false;
         $scope.goCompanyLogin != $scope.goCompanyLogin;
    }
    
    $scope.switchToCompany = function()
    {
        $scope.goComReg = false;
        $scope.goLogin = false;
        $scope.goReg = false;
        $scope.goCompanyLogin = true;
    }
    
    $scope.switchToUser = function()
    {
        $scope.goComReg = false;
        $scope.goLogin = true;
        $scope.goReg = false;
        $scope.goCompanyLogin = false;
    }
    
    /*===========================================*/
    
    $scope.logMeIn = function()
    {
        console.log("Initial scope: " + $scope.existingUser);
        //call service to log user in
        service.logUserIn($scope.existingUser);       
        console.log("After POST in controller : " + service.dataObj);

    }
}


function userRegistration($scope)
{
}