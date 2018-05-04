'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');


app.controller('MetricEditCtrl',  ['$scope', 'BackendServiceMetricEdit', '$q', '$http', '$routeParams', 
    function ($scope, BackendServiceMetricEdit, $q, $http, $routeParams) {
   $scope.$back = function() { 
      window.history.back();
       };
   $scope.metric_id             = $routeParams.metric_id;
   $scope.metric = {};
   $scope.master= {};
   $scope.previous_metric_id    = +$routeParams.metric_id -1;
   $scope.next_metric_id        = +$routeParams.metric_id +1;
   var d = new Date();
   $scope.year = d.getFullYear();

  var initializeGrid = function(){
    if ($scope.metric_id){
        BackendServiceMetricEdit.getMetric($scope.metric_id).then(function(metric){
               $scope.metric.metric_id                           = metric.data[0].metric_id;
               $scope.metric.metric_cd                           = metric.data[0].metric_cd;
               $scope.metric.label                               = metric.data[0].label;
               $scope.metric.definition                          = metric.data[0].definition;  
               $scope.metric.project                             = metric.data[0].project;  
               $scope.metric.area                                = metric.data[0].area;  
               $scope.metric.threshold_green                     = metric.data[0].threshold_green;             
               $scope.metric.threshold_yellow                    = metric.data[0].threshold_yellow;            
               $scope.metric.threshold_red                       = metric.data[0].threshold_red;
               $scope.metric.parent_metric_id                    = metric.data[0].parent_metric_id;
               if (metric.data[0].metric_start_date){
                 $scope.metric.metric_start_date                 = (new Date(metric.data[0].metric_start_date));  
               };
           
               $scope.metric.type                                = metric.data[0].type;            
               $scope.metric.display_type                        = metric.data[0].display_type;
               $scope.metric.calculation_interval                = metric.data[0].calculation_interval;
               $scope.metric.created_by                          = metric.data[0].created_by;
               if (metric.data[0].created){
                 $scope.metric.created                           = new Date(metric.data[0].created); 
               };                        
               $scope.metric.updated_by                          = metric.data[0].updated_by;
               if (metric.data[0].updated){
                 $scope.metric.updated                           = new Date(metric.data[0].updated); 
               }; 
       
               $scope.master= angular.copy($scope.metric);
              });
      };
  };

    if ($scope.metric_id){
        initializeGrid();
    };

    $scope.submit = function(metric) {
       if(metric.metric_id === undefined){

           console.log(metric);
           console.log(metric.label);
           console.log(metric.metric_cd );
           console.log(metric.definition );
           console.log(metric.threshold_green);
           console.log(metric.threshold_yellow );
           console.log(metric.threshold_red);
           console.log(metric.metric_start_date);
           console.log(metric.type);
           console.log(metric.display_type);
           console.log(metric.calculation_interval);
           console.log(metric.updated_by);
           if (!metric.threshold_green )
          {
                console.log('this should not work, mistake');
            }
           if (metric.threshold_green)
          {
                console.log('crazy');
            }

           if (!metric.label )
          {
                console.log('this should not work, mistake on label');
            }
           if (metric.label )
          {
                console.log('crazy again for label');
            }
           if (!metric.label || !metric.metric_cd || !metric.definition || !metric.threshold_green || !metric.threshold_yellow || !metric.threshold_red || !metric.metric_start_date || !metric.type || !metric.display_type || !metric.calculation_interval|| !metric.type || !metric.display_type || !metric.calculation_interval || !metric.updated_by){
                $scope.success = null;
                $scope.error = 'ERROR:  Complete all REQUIRED Fields';   
            } else {
               BackendServiceMetricEdit.createMetric(metric);
               var date = new Date();
               var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
               $scope.error = null;
               $scope.success = 'SAVE SUCCESSFUL:  ' + timeStr;
            };
       } else {
           //check if any changes
           if (JSON.stringify(metric) != JSON.stringify($scope.master)) {
                BackendServiceMetricEdit.updateMetric(metric.metric_id, metric, $scope.master);
                var date = new Date();
                var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                $scope.error = null;
                $scope.success = 'SAVE SUCCESSFUL:  ' + timeStr;
           } else {
                $scope.success = null;
                $scope.error = 'WARNING:  No Changes made to Metric';
           };
           
       };
       $scope.master = angular.copy(metric);
     };
     initializeGrid();
}]).factory('BackendServiceMetricEdit', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/metrics/';

      
        function getMetric(metricid) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + metricid 
            });

            return sendRequest(request);
        }
        function createMetric(body) {
     
            var request = $http({
                method: 'POST',
                data: body,
                url: backendGlobalUrl
            });
     
            return sendRequest(request);
        }

        function updateMetric(metric_id, metric) {
            var request = $http({
                method: 'PUT',
                data: metric,
                url: backendGlobalUrl + metric_id
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
                getMetric    :      getMetric,
                createMetric :      createMetric,
                updateMetric :      updateMetric
            };
    }
]);