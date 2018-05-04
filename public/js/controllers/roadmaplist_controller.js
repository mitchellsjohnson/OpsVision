'use strict';

/* Controllers */


var app= angular.module('opsVisionApp');


app.controller('RoadmapListCtrl',  ['$scope', 'BackendServiceRoadmapList', '$q', '$http',  
    function ($scope, BackendServiceRoadmapList, $q, $http) {
  $scope.$back = function() { 
   window.history.back();
    };  
    $scope.roadmaps  = [];
    BackendServiceRoadmapList.getRoadmaps().then(function(roadmaps){
          $scope.roadmaps = roadmaps.data;
      });

}])
.factory('BackendServiceRoadmapList', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/roadmaps/';

        function getRoadmaps() {
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
                getRoadmaps  : getRoadmaps
            };
    }
]);

