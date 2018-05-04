'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');


app.controller('MetaDataScheduleDefCtrl', ['$scope', 'close', function($scope, close) {
  
 $scope.close = function(result) {
 	close(result, 500); // close, but give 500ms for bootstrap to animate
 };

}]);