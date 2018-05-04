'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');


app.controller('AdminHomeCtrl',  ['$scope', '$location','$cookies','$cookieStore', '$routeParams',
    function ($scope, $location, $cookies, $cookieStore, $routeParams ) {

    $cookieStore.put('ADMIN', 'TRUE');
    $scope.revertadmin = $routeParams.revertadmin;
    if ($scope.revertadmin === '1') {
            $cookieStore.remove('ADMIN');
    };

    $location.path('/');
  }]);
