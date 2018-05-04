'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');




app.controller('MetricMetaDataCtrl',  ['$scope', 'BackendServiceMetricMetaData', '$q', '$http', '$routeParams', 
    function ($scope, BackendServiceMetricMetaData, $q, $http, $routeParams) {
   $scope.$back = function() { 
      window.history.back();
       };  
   $scope.metric_id             = $routeParams.metric_id;
   $scope.previous_metric_id    = +$routeParams.metric_id -1;
   $scope.next_metric_id        = +$routeParams.metric_id +1;
   $scope.metric = {};
   $scope.master= {};
   var d = new Date();
   $scope.year = d.getFullYear();

   var initializeGrid = function(){
        BackendServiceMetricMetaData.getMetricMetaData($scope.metric_id).then(function(metric){
               $scope.metric.metric_id                           = metric.data[0].metric_id;
               $scope.metric.metric_cd                           = metric.data[0].metric_cd;
               $scope.metric.label                               = metric.data[0].label;
               $scope.metric.initiative_meta_data_id             = metric.data[0].initiative_meta_data_id;
               $scope.metric.short_note                          = metric.data[0].short_note;
               $scope.metric.long_note                           = metric.data[0].long_note;
               $scope.metric.value_proposition                   = metric.data[0].value_proposition;
               if (metric.data[0].plan_start){
                 $scope.metric.plan_start                        = new Date(metric.data[0].plan_start); 
                 
               }; 
               if (metric.data[0].plan_finish){
                 $scope.metric.plan_finish                       = new Date(metric.data[0].plan_finish); 
                 
               }; 
               if (metric.data[0].actual_start){
                 $scope.metric.actual_start                      = new Date(metric.data[0].actual_start); 
                 
               };                                                 
               if (metric.data[0].actual_finish){                 
                 $scope.metric.actual_finish                     = new Date(metric.data[0].actual_finish); 
                 
               };      
               if (metric.data[0].target_finish){                 
                 $scope.metric.target_finish                     = new Date(metric.data[0].target_finish); 
                 
               };                                             
               $scope.metric.strategic_priority                  = metric.data[0].strategic_priority;
               $scope.metric.updated_by                          = metric.data[0].updated_by;
               $scope.metric.technology_lead                     = metric.data[0].technology_lead;
               $scope.metric.product_lead                        = metric.data[0].product_lead;
               if (metric.data[0].updated){                       
                 $scope.metric.updated                           = new Date(metric.data[0].updated); 
                 
 
               }; 
       
               $scope.master= angular.copy($scope.metric);
              });
      };
    $scope.submit = function(metric) {
       if(!metric.initiative_meta_data_id ){
           if (!metric.plan_start || !metric.plan_finish || !metric.strategic_priority || !metric.updated_by){
                $scope.success = null;
                $scope.error = 'WARNING:  Complete all REQUIRED Fields';   
            } else {
               BackendServiceMetricMetaData.createMetricMetaData(metric);
               var date = new Date();
               var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
               $scope.error = null;
               $scope.success = 'SAVE SUCCESSFUL:  ' + timeStr;
              initializeGrid();
            };
       } else {
           //check if any changes
           if (JSON.stringify(metric) != JSON.stringify($scope.master)) {
                BackendServiceMetricMetaData.updateMetricMetaData(metric.initiative_meta_data_id, metric, $scope.master);
                var date = new Date();
                var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                $scope.error = null;
                $scope.success = 'SAVE SUCCESSFUL:  ' + timeStr;
                initializeGrid();
           } else {
                $scope.success = null;
                $scope.error = 'WARNING:  No Changes made to Metric Meta Data';
           }
           
       }
       $scope.master = angular.copy(metric);
     };
     initializeGrid();
}]).factory('BackendServiceMetricMetaData', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/metric_meta_data/';

      
        function getMetricMetaData(metric_id) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + metric_id 
            });

            return sendRequest(request);
        }
        function createMetricMetaData(body) {
     
            var request = $http({
                method: 'POST',
                data: body,
                url: backendGlobalUrl
            });
     
            return sendRequest(request);
        }

        function updateMetricMetaData(initiative_meta_data_id, metric) {
            var request = $http({
                method: 'PUT',
                data: metric,
                url: backendGlobalUrl + initiative_meta_data_id
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
                getMetricMetaData    :      getMetricMetaData,
                createMetricMetaData :      createMetricMetaData,
                updateMetricMetaData :      updateMetricMetaData
            };
    }
]);