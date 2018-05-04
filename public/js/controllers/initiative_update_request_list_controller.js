'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');

app.controller('InitiativeUpdateRequestListCtrl',  ['$scope', 'BackendServiceInitiativeUpdateRequestList', '$q', '$http', '$routeParams', '$filter',
    function ($scope, BackendServiceInitiativeUpdateRequestList, $q, $http, $routeParams, $filter) {
  
  $scope.viewModel = {};
  $scope.viewModel.$back = function () {
    window.history.back();
  };
    
 $scope.viewModel.year = $routeParams.year;
 $scope.viewModel.month = $routeParams.month;
 $scope.viewModel.dashboard_id = $routeParams.dashboard_id;

 if ((Number($routeParams.month) - 1) === 0){
    $scope.viewModel.prev_month = 12
    $scope.viewModel.prev_year = Number($routeParams.year) -1;
 } else {
    $scope.viewModel.prev_month = Number($routeParams.month) - 1;
    $scope.viewModel.prev_year = Number($routeParams.year);
 }

 if ((Number($routeParams.month) + 1) === 13){
    $scope.viewModel.next_month = 1
    $scope.viewModel.next_year = Number($routeParams.year) +1;
 } else {
    $scope.viewModel.next_month = Number($routeParams.month) + 1;
    $scope.viewModel.next_year = Number($routeParams.year);
 }


 var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
 ];

 $scope.viewModel.monthName = monthNames[$routeParams.month -1]
   
 BackendServiceInitiativeUpdateRequestList.getInitiativesUpdateRequests($scope.viewModel.dashboard_id, $scope.viewModel.month, $scope.viewModel.year ).then(function(initiativeUpdateRequests){
            $scope.viewModel.rowCollection = initiativeUpdateRequests.data;
            if (initiativeUpdateRequests.data.length > 0) {
                $scope.viewModel.dashboardName = initiativeUpdateRequests.data[0].dashboardName;
            }
 });
 $scope.viewModel.displayedCollection = [].concat($scope.viewModel.rowCollection);
   
}])
.factory('BackendServiceInitiativeUpdateRequestList', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/initiative_update_request/list/';

        function getInitiativesUpdateRequests(dashboard_id, month, year) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + dashboard_id + '/' + month + '/' + year
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
                getInitiativesUpdateRequests : getInitiativesUpdateRequests
            };
    }
]);
