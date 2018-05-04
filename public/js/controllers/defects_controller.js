'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');

app.controller('DefectsCtrl',  ['$scope', 'BackendServiceDefects', '$q', '$http', '$routeParams', '$filter', 
    function ($scope, BackendServiceDefects, $q, $http, $routeParams, $filter) {
  
 $scope.viewModel = {};
 $scope.$back = function() { 
   window.history.back();
    };
 $scope.viewModel.rowCollection = [];

 $scope.viewModel.project                 = 'Error';
 $scope.viewModel.area                    = 'Error';
 $scope.viewModel.priority                = 'Error';
 $scope.viewModel.label                   = 'Error';
 $scope.viewModel.metric_value_mtd        = 'Error';
 $scope.viewModel.metric_measurement_mtd  = 'Error';
 $scope.viewModel.metric_value_ytd        = 'Error';
 $scope.viewModel.metric_measurement_ytd  = 'Error';
 $scope.viewModel.display_type            = 'Error';
 $scope.viewModel.bugcount                = 'Error';
 $scope.viewModel.bugcountMetricToday     = 'Error';
 $scope.viewModel.bugcountMetricYest      = 'Error';
 $scope.viewModel.lastUpdatedDt           = 'Error';

 var date = new Date();
 var month = ("0" + (date.getMonth() + 1)).slice(-2);
 var year = date.getFullYear();

 $scope.viewModel.year = year;
 $scope.viewModel.month = month
 $scope.viewModel.dashboardid = $routeParams.dashboardid;
 $scope.viewModel.metricId = $routeParams.metricid;

  BackendServiceDefects.getDefects($routeParams.metricid, $routeParams.viewtype ).then(function(defects){
     for (var i = 0; i < defects.data.length; i++) {
                   $scope.viewModel.rowCollection[i] = defects.data[i];
      }
      $scope.viewModel.bugcount =  defects.data.length;
      BackendServiceDefects.getMetricDetails($routeParams.metricid, month, year).then(function(metricDetails){
            if (metricDetails.data.length===1){
              $scope.viewModel.project                 = metricDetails.data[0].project;
              $scope.viewModel.area                    = metricDetails.data[0].area;
              $scope.viewModel.priority                = metricDetails.data[0].priority;
              $scope.viewModel.label                   = metricDetails.data[0].label;
              $scope.viewModel.metric_value_mtd        = metricDetails.data[0].metric_value_mtd;
              $scope.viewModel.metric_measurement_mtd  = metricDetails.data[0].metric_measurement_mtd;
              $scope.viewModel.metric_value_ytd        = metricDetails.data[0].metric_value_ytd;
              $scope.viewModel.metric_measurement_ytd  = metricDetails.data[0].metric_measurement_ytd;
              $scope.viewModel.display_type            = metricDetails.data[0].display_type;
              $scope.viewModel.lastUpdatedDt           = metricDetails.data[0].LastUpdatedProdDefectDt;
              $scope.viewModel.bugcountMetricToday     = metricDetails.data[0].metricCountToday;
              $scope.viewModel.bugcountMetricYest      = metricDetails.data[0].metricCountYest;
            };
         }); 
  });
   $scope.viewModel.displayedCollection = [].concat($scope.viewModel.rowCollection);


}])
.factory('BackendServiceDefects', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api';

        function getDefects(metricid, viewtype) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + '/defects/' + metricid + '/' + viewtype 
            });

            return sendRequest(request);
        }
        function getMetricDetails(metricid, month, year) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + '/metric_details/' + metricid + '/' + month + '/' + year
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
                getDefects          :      getDefects,
                getMetricDetails    :      getMetricDetails

            };
    }
]);
