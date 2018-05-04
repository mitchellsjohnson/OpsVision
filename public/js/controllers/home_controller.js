'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');


app.controller('HomeCtrl', ['$scope','$cookies','$cookieStore', '$location' ,  
    function ($scope, $cookies, $cookieStore, $location ){

         $scope.$back = function() { 
               window.history.back();
        };
        $scope.viewModel = {};
        var isAdmin = $cookieStore.get('ADMIN');
        if (isAdmin === 'TRUE') {
            $scope.viewModel.isAdmin = 'TRUE'; 
        };
        var d = new Date();
        $scope.viewModel.current_year = d.getFullYear();
        $scope.viewModel.current_month = d.getMonth() +1;
         
  }]);

