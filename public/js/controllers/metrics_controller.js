'use strict';

/* Controllers */


var app= angular.module('opsVisionApp');

app.controller('MetricsCtrl',  ['$scope', 'BackendServiceMetrics', '$q', function ($scope, BackendServiceMetrics, $q) {

 $scope.$back = function() { 
   window.history.back();
    };

  $scope.gridOptions = { 
    rowHeight: 30
  };
  

  var initializeGrid = function(){
    
     BackendServiceMetrics.getMetrics().then(function(metrics){
          $scope.gridOptions.data = metrics.data;
          resizeGrid(metrics.data.length);
      });
    
  };



  $scope.gridOptions.columnDefs = [
         { 
              name: 'metric_id', 
              displayName: 'Metric Id',
              enableCellEdit: false                             
         }, { 
              name: 'metric_cd', 
              displayName: 'Metric Code',
              enableCellEdit: true
         }, { 
              name: 'label', 
              displayName: 'Label',
              enableCellEdit: true,
              width: '20%'
         }, {
              name: 'Add_Content', 
              displayName: 'Action', 
              cellTemplate: '<div style="text-align:center"> <a   class="btn btn-xs btn-primary" type="button" href="/metric_edit/{{row.entity.metric_id}}">Edit / Delete</a> &nbsp;  <a   class="btn btn-xs btn-primary" type="button" href="/metric_measurements/{{row.entity.metric_id}}/2016">Add Measurements</a>&nbsp;  <a   class="btn btn-xs btn-primary" type="button" href="/metric_meta_data/{{row.entity.metric_id}}">Add Initiative Metadata</a></div>', 
              enableCellEdit: false,
              width: '30%'       
         }];



 initializeGrid();
 var resizeGrid = function (rowCount) {
     var minHeight = 60;
     var newHeight = (rowCount * 30 )+ minHeight;
 
     angular.element(document.getElementsByClassName('gridStyle')[0]).css('height', newHeight + 'px');
 };


}])
.factory('BackendServiceMetrics', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/metrics/';



        function getMetrics() {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl
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

        function updateMetric(metric_id,body) {
     
            var request = $http({
                method: 'PUT',
                data: body,
                url: backendGlobalUrl + metric_id 
            });
     
            return sendRequest(request);
        }
        function deleteMetric(metric_id) {

            var request = $http({
                method: 'DELETE',
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
                getMetrics  : getMetrics,
                createMetric: createMetric,
                updateMetric: updateMetric,
                deleteMetric: deleteMetric
            };
    }
]);
