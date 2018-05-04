'use strict';

/* Controllers */


var app= angular.module('opsVisionApp');


app.controller('ResourcePlanListCtrl',  ['$scope', 'BackendServiceResourcePlanList', '$q', '$http',  
    function ($scope, BackendServiceResourcePlanList, $q, $http) {
  $scope.$back = function() { 
   window.history.back();
    };  
    $scope.resourceplans  = [];
    BackendServiceResourcePlanList.getResourcePlans().then(function(resourceplans){
          $scope.resourceplans = resourceplans.data;
      });

}])
.factory('BackendServiceResourcePlanList', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/resourceplans/';

        function getResourcePlans() {
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
                getResourcePlans  : getResourcePlans
            };
    }
]);

