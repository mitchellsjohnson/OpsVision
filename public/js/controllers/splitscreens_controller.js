'use strict';

/* Controllers */


var app= angular.module('opsVisionApp');


app.controller('SplitScreensCtrl',  ['$scope', 'BackendServiceSplitScreens', '$q', '$http',  
	function ($scope, BackendServiceSplitScreens, $q, $http) {
  $scope.viewModel = {};
  $scope.viewModel.$back = function() { 
     window.history.back();
		};
        $scope.viewModel.splitScreens = [];
  var initializePage = function () {
     BackendServiceSplitScreens.getSplitScreens().then(function (splitScreens) {
         $scope.viewModel.splitScreens = splitScreens.data;
     });  
   };
  $scope.deleteRow = function (splitscreen_id) {
        BackendServiceSplitScreens.deleteSplitScreen(splitscreen_id).then(function () {
             initializePage();
        });
   };
  initializePage();
}])
.factory('BackendServiceSplitScreens', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/split_screens/';

        function getSplitScreens() {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl 
            });

            return sendRequest(request);
        }
        function deleteSplitScreen(splitscreen_id) {
            
            var request = $http({
                method: 'DELETE',
                url: backendGlobalUrl + splitscreen_id
            });
            
            return sendRequest(request);
        }      
        function sendRequest(config){
        
            var deferred = $q.defer();
        
            config.then(function(response){
                deferred.resolve(response);
            }, function(error){
                deferred.reject(error);
            });
        
            return deferred.promise;
        }
            return {
                getSplitScreens       : getSplitScreens,
                deleteSplitScreen     : deleteSplitScreen
            };
    }
]);

