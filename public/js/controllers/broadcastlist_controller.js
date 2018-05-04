'use strict';

/* Controllers */


var app= angular.module('opsVisionApp');


app.controller('BroadcastListCtrl',  ['$scope', 'BackendServiceBroadcastList', '$q', '$http',  
	function ($scope, BackendServiceBroadcastList, $q, $http) {
  $scope.viewModel = {};
  $scope.viewModel.$back = function() { 
     window.history.back();
		};
	$scope.viewModel.channels = [];
    BackendServiceBroadcastList.getChannels().then(function(channels){
          $scope.viewModel.channels = channels.data;
      });

}])
.factory('BackendServiceBroadcastList', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/channels/';

        function getChannels() {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl 
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
                getChannels  : getChannels
            };
    }
]);

