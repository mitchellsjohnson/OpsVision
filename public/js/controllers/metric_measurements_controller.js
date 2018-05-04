'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');




app.controller('MetricMeasurementsCtrl',  ['$scope', 'BackendServiceMetricMeasurements', '$q', '$http', '$routeParams', 
    function ($scope, BackendServiceMetricMeasurements, $q, $http, $routeParams) {
   $scope.$back = function() { 
      window.history.back();
       };  
   $scope.metric_id             = $routeParams.metric_id;
   $scope.previous_metric_id    = +$routeParams.metric_id -1;
   $scope.next_metric_id        = +$routeParams.metric_id +1;
   $scope.year                  = $routeParams.year;
   $scope.prevYear              = +$routeParams.year -1;
   $scope.nextYear              = +$routeParams.year + 1;
   $scope.metric_measurements = {};
   $scope.master= {};

  var initializeGrid = function(){
    BackendServiceMetricMeasurements.getMeasurements($scope.metric_id, $scope.year).then(function(measurements){
                 for (var i = 0; i < measurements.data.length; i++) { 
                      $scope.metric_measurements.year                                = measurements.data[i].year;
                      $scope.metric_measurements.metric_id                           = measurements.data[i].metric_id;
                      $scope.metric_measurements.metric_cd                           = measurements.data[i].metric_cd;
                      $scope.metric_measurements.label                               = measurements.data[i].label;
                      $scope.metric_measurements.updated_by                          = measurements.data[i].mtd_updated_by;
                      if (measurements.data[i].mtd_updated){
                        $scope.metric_measurements.updated                           = new Date(measurements.data[i].mtd_updated); 
                      }; 
                      if (measurements.data[i].mtd_month === 1){
                          $scope.metric_measurements.jan_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.jan_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.jan_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.jan_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                      if (measurements.data[i].mtd_month === 2){
                          $scope.metric_measurements.feb_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.feb_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.feb_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.feb_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                      if (measurements.data[i].mtd_month === 3){
                          $scope.metric_measurements.mar_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.mar_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.mar_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.mar_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                      if (measurements.data[i].mtd_month === 4){
                          $scope.metric_measurements.apr_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.apr_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.apr_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.apr_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                      if (measurements.data[i].mtd_month === 5){
                          $scope.metric_measurements.may_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.may_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.may_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.may_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                      if (measurements.data[i].mtd_month === 6){
                          $scope.metric_measurements.jun_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.jun_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.jun_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.jun_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                      if (measurements.data[i].mtd_month === 7){
                          $scope.metric_measurements.jul_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.jul_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.jul_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.jul_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                      if (measurements.data[i].mtd_month === 8){
                          $scope.metric_measurements.aug_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.aug_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.aug_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.aug_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                      if (measurements.data[i].mtd_month === 9){
                          $scope.metric_measurements.sep_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.sep_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.sep_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.sep_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                      if (measurements.data[i].mtd_month === 10){
                          $scope.metric_measurements.oct_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.oct_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.oct_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.oct_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                      if (measurements.data[i].mtd_month === 11){
                          $scope.metric_measurements.nov_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.nov_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.nov_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.nov_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                      if (measurements.data[i].mtd_month === 12){
                          $scope.metric_measurements.dec_mtd_id                      = measurements.data[i].mtd_id;    
                          $scope.metric_measurements.dec_mtd_value                   = measurements.data[i].mtd_value;   
                          $scope.metric_measurements.dec_mtd_measurement             = measurements.data[i].mtd_measurement;   
                          $scope.metric_measurements.dec_mtd_discussion_point_id     = measurements.data[i].mtd_discussion_point_id;                     
                      };
                          $scope.metric_measurements.ytd_id                      = measurements.data[i].ytd_id;    
                          $scope.metric_measurements.ytd_value                   = measurements.data[i].ytd_value;   
                          $scope.metric_measurements.ytd_measurement             = measurements.data[i].ytd_measurement;   
                };

                $scope.master= angular.copy($scope.metric_measurements);             
                                                                       
          });
          
  };

    if ($scope.metric_id){
        initializeGrid();
    };



    var saveMtdData = function(metric_id, id, value, master_value, measurement, master_measurement, year, month, updated_by){
        var measurements = {};
            measurements.metric_id           = metric_id;
            measurements.id                 = id;
            measurements.value              = value;
            measurements.month              = month;
            measurements.year               = year;
            measurements.measurement        = measurement;
            measurements.updated_by         = updated_by;
        
        if (id && (value != master_value ||  measurement != master_measurement)){
                BackendServiceMetricMeasurements.updateMtdMeasurement(measurements.id, measurements);      
                return 'success'; 
        } else if (!id && (value != master_value ||  measurement != master_measurement)) {
                BackendServiceMetricMeasurements.createMtdMeasurement(measurements);    
                return 'success';
        } else{
                return 'warning';
        };
    };

    var saveYtdData = function(metric_id, id, value, master_value, measurement, master_measurement, year, updated_by){
        var measurements = {};
            measurements.metric_id           = metric_id;
            measurements.id                 = id;
            measurements.value              = value;
            measurements.measurement        = measurement;
            measurements.year               = year;
            measurements.updated_by         = updated_by;
        
        if (id && (value != master_value ||  measurement != master_measurement)){
                BackendServiceMetricMeasurements.updateYtdMeasurement(measurements.id, measurements);      
                return 'success'; 
        } else if (!id && (value != master_value ||  measurement != master_measurement)) {
                BackendServiceMetricMeasurements.createYtdMeasurement(measurements);    
                return 'success';
        } else{
                return 'warning';
        };
    };



    $scope.submit = function(metric_measurements) {

            var success = 'false';
    //process mtd data          
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.jan_mtd_id, metric_measurements.jan_mtd_value, $scope.master.jan_mtd_value, metric_measurements.jan_mtd_measurement, $scope.master.jan_mtd_measurement, metric_measurements.year, 1, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';                                                                                                                                                         
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.feb_mtd_id, metric_measurements.feb_mtd_value, $scope.master.feb_mtd_value, metric_measurements.feb_mtd_measurement, $scope.master.feb_mtd_measurement, metric_measurements.year, 2, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';                                                                                                                                                         
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.mar_mtd_id, metric_measurements.mar_mtd_value, $scope.master.mar_mtd_value, metric_measurements.mar_mtd_measurement, $scope.master.mar_mtd_measurement, metric_measurements.year, 3, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';                                                                                                                                                          
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.apr_mtd_id, metric_measurements.apr_mtd_value, $scope.master.apr_mtd_value, metric_measurements.apr_mtd_measurement, $scope.master.apr_mtd_measurement, metric_measurements.year, 4, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';                                                                                                                                                          
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.may_mtd_id, metric_measurements.may_mtd_value, $scope.master.may_mtd_value, metric_measurements.may_mtd_measurement, $scope.master.may_mtd_measurement, metric_measurements.year, 5, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';                                                                                                                                                          
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.jun_mtd_id, metric_measurements.jun_mtd_value, $scope.master.jun_mtd_value, metric_measurements.jun_mtd_measurement, $scope.master.jun_mtd_measurement, metric_measurements.year, 6, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';                                                                                                                                                          
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.jul_mtd_id, metric_measurements.jul_mtd_value, $scope.master.jul_mtd_value, metric_measurements.jul_mtd_measurement, $scope.master.jul_mtd_measurement, metric_measurements.year, 7, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';                                                                                                                                                        
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.aug_mtd_id, metric_measurements.aug_mtd_value, $scope.master.aug_mtd_value, metric_measurements.aug_mtd_measurement, $scope.master.aug_mtd_measurement, metric_measurements.year, 8, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';                                                                                                                                                         
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.sep_mtd_id, metric_measurements.sep_mtd_value, $scope.master.sep_mtd_value, metric_measurements.sep_mtd_measurement, $scope.master.sep_mtd_measurement, metric_measurements.year, 9, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';                                                                                                                                                          
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.oct_mtd_id, metric_measurements.oct_mtd_value, $scope.master.oct_mtd_value, metric_measurements.oct_mtd_measurement, $scope.master.oct_mtd_measurement, metric_measurements.year, 10, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';                                                                                                                                                                                        
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.nov_mtd_id, metric_measurements.nov_mtd_value, $scope.master.nov_mtd_value, metric_measurements.nov_mtd_measurement, $scope.master.nov_mtd_measurement, metric_measurements.year, 11, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';                                                                                                                                                                                        
            var result = saveMtdData(metric_measurements.metric_id, metric_measurements.dec_mtd_id, metric_measurements.dec_mtd_value, $scope.master.dec_mtd_value, metric_measurements.dec_mtd_measurement, $scope.master.dec_mtd_measurement, metric_measurements.year, 12, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';   
    //process ytd
            var result = saveYtdData(metric_measurements.metric_id, metric_measurements.ytd_id, metric_measurements.ytd_value, $scope.master.ytd_value, metric_measurements.ytd_measurement, $scope.master.ytd_measurement, metric_measurements.year, metric_measurements.metric_updated_by);
            if (result === 'success') success = 'true';   

            if (success === 'true'){
               var date = new Date();
               var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
               $scope.error = null;
               $scope.success = 'SAVE SUCCESSFUL:  ' + timeStr;
            }else{
                $scope.success = null;
                $scope.error = 'WARNING:  No Changes made to Metric';
            };
       
       $scope.master = angular.copy(metric_measurements);
     };
     initializeGrid();
}]).factory('BackendServiceMetricMeasurements', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/metric_measurements/';

      
        function getMeasurements(metric_id, year) {
            var request = $http({
                method: 'GET',
                url: '/api/metric_measurements/' + metric_id + '/' + year
            });

            return sendRequest(request);
        }
        function createMtdMeasurement(measurement) {
     
            var request = $http({
                method: 'POST',
                data: measurement,
                url: '/api/metric_mtd_measurements/'
            });
     
            return sendRequest(request);
        }

        function createYtdMeasurement(measurement) {
     
            var request = $http({
                method: 'POST',
                data: measurement,
                url: '/api/metric_ytd_measurements/'
            });
     
            return sendRequest(request);
        }

        function updateMtdMeasurement(id, measurement) {
            var request = $http({
                method: 'PUT',
                data: measurement,
                url: '/api/metric_mtd_measurements/' + id
            });
     
            return sendRequest(request);
        }


        function updateYtdMeasurement(id, measurement) {
            var request = $http({
                method: 'PUT',
                data: measurement,
                url: '/api/metric_ytd_measurements/' + id
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
                getMeasurements            :      getMeasurements,
                createMtdMeasurement       :      createMtdMeasurement,
                createYtdMeasurement       :      createYtdMeasurement,
                updateMtdMeasurement       :      updateMtdMeasurement,
                updateYtdMeasurement       :      updateYtdMeasurement,
            };
    }
]);