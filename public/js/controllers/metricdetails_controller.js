    'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');




app.controller('MetricDetailsCtrl',  ['$scope', 'BackendServiceMetricDetails', '$q', '$http', '$routeParams', 
    function ($scope, BackendServiceMetricDetails, $q, $http, $routeParams) {
  
    $scope.dashboardid = $routeParams.dashboardid;
    $scope.channels  = [];

    $scope.metricid = $routeParams.metricid
    $scope.$back = function() { 
       window.history.back();
        };
    $scope.gridOptions = {};
    $scope.metric_value_mtd                        = 'Error';
    $scope.metric_measurement_mtd                  = 'Error';
    $scope.metric_value_ytd                        = 'Error';
    $scope.metric_measurement_ytd                  = 'Error';
    $scope.metric_label                            = 'Error';
    $scope.metric_definition                       = 'Error';
    $scope.metric_value_proposition                = 'Error';
    $scope.threshold_green                         = 'Error';
    $scope.threshold_yellow                        = 'Error';
    $scope.threshold_green                         = 'Error';
    $scope.metric_created_by                       = 'Error';


    var today = new Date();

    if ($scope.calculation_interval === 'MONTHLY')
    {
        //get previous months metric as this is the last calculated metric
        today.setMonth(today.getMonth()-1);
    };
    $scope.year = today.getFullYear();
    $scope.month = today.getMonth() + 1;


    BackendServiceMetricDetails.getMetricDetails($scope.metricid, $scope.month, $scope.year).then(function(metric){
                if (metric.data.length===1){
                  $scope.metric_label               = metric.data[0].label;
                  $scope.metric_definition          = metric.data[0].definition;  
                  $scope.metric_value_proposition   = metric.data[0].value_proposition;  
                  $scope.metric_value_mtd           = metric.data[0].metric_value_mtd;
                  $scope.metric_measurement_mtd     = metric.data[0].metric_measurement_mtd;
                  $scope.metric_value_ytd           = metric.data[0].metric_value_ytd;
                  $scope.metric_measurement_ytd     = metric.data[0].metric_measurement_ytd;
                  $scope.display_type               = metric.data[0].display_type;
                  $scope.metric_created_by          = metric.data[0].created_by;
                  $scope.type                       = metric.data[0].type;
                  if (metric.data[0].type === 'INITIATIVE'){
                      $scope.threshold_green               = 'On Schedule';
                      $scope.threshold_yellow              = 'Schedule at Risk';
                      $scope.threshold_red                 = 'Target Launched Schedule will be Missed'

                  }else{
                      $scope.threshold_green               = metric.data[0].threshold_green;             
                      $scope.threshold_yellow              = metric.data[0].threshold_yellow;            
                      $scope.threshold_red                 = metric.data[0].threshold_red;
                    };
                };
      });

}]).factory('BackendServiceMetricDetails', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/metric_details/';

      
        function getMetricDetails(metricid, month, year) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + metricid + '/' + month + '/' + year
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
                getMetricDetails    :      getMetricDetails

            };
    }
]);