'use strict';

/* Controllers */


var app= angular.module('opsVisionApp');

app.controller('DashboardConfigCtrl',  ['$scope', 'BackendServiceDashboardConfig', '$q', '$http', '$routeParams', 
    function ($scope, BackendServiceDashboardConfig, $q, $http, $routeParams) {

  $scope.myExternalScope = $scope;
  $scope.$back = function() { 
     window.history.back();
    };
 
  $scope.selectedRows = [];
  $scope.gridOptions = { 
    enableRowSelection: true,
    enableSelectAll: true,
    multiSelect:  true,
    enableCellEditOnFocus: true,
    selectionRowHeaderWidth: 30,
    rowHeight: 30

  };



  var initializeGrid = function(){
    
     BackendServiceDashboardConfig.getDashboardConfig($routeParams.dashboardid).then(function(dashboardConfig){
          $scope.gridOptions.data = dashboardConfig.data;
          resizeGrid(dashboardConfig.data.length);
      });
    $scope.selectedRows.length = 0;      
  };
     
  $scope.deleteRows = function(){
      for (var i = $scope.selectedRows.length - 1; i >= 0; i--) {
          BackendServiceDashboardConfig.deleteDashboardConfig($scope.selectedRows[i]).then(function(dashboardConfig){
              initializeGrid();
          });
      }
  };
  $scope.addNewRow = function() {
    $scope.gridOptions.data.push({
                "dashboard_id": $routeParams.dashboardid,
                "dashboard_cd": null,
                "description": null,
                "updated_by": null
              });
    resizeGrid($scope.gridOptions.data.length);
  };
//populate the URL selection dropdown
 $scope.selectedMetricDD = null;
 $scope.metrics_dds = [];
 BackendServiceDashboardConfig.getMetricsDD().then(function(metrics){
               $scope.metrics_dds = metrics.data;
 });     


  $scope.gridOptions.columnDefs = [
          { 
              name: 'metric_id', 
              displayName: 'Metric Id', 
              enableCellEdit: false,                                        
              width: '10%' 
         },{ 
              name: 'metric_id', 
              displayName: 'Metric Description', 
              cellTemplate: "../partials/metricdd_external.html",                                         
              width: '15%' 
         }, { 
              name: 'definition', 
              displayName: 'Metric Definition', 
              enableCellEdit: false,
              width: '40%' 
         }, { 
              name: 'sequence', 
              displayName: 'Sequence',
              type: 'number',
              width: '8%' 
         }, { 
              name: 'updated_by', 
              displayName: 'Updated By', 
              width: '10%' 
         }, { 
              name: 'updated', 
              displayName: 'Updated On', 
              enableCellEdit: false,
              width: '10%' 
         }, { 
              name: 'dashboard_id', 
              visible:  false
         }, { 
              name: 'id', 
              visible:  false
         }];

   $scope.saveRow = function( rowEntity ) {
       var promise = $q.defer();
       $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );
       if(rowEntity.id === undefined || rowEntity.id === null){
            BackendServiceDashboardConfig.createDashboardConfig(rowEntity);
         } else {
            BackendServiceDashboardConfig.updateDashboardConfig(rowEntity.id , rowEntity);
         }
       initializeGrid();
       $scope.metric_id = rowEntity.metric_id;
       promise.resolve();
  }; 

 $scope.gridOptions.onRegisterApi = function(gridApi){
   //set gridApi on scope
   $scope.gridApi = gridApi;
   gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
   gridApi.selection.on.rowSelectionChanged($scope,function(row){
        if (row.isSelected) {
            $scope.selectedRows.push(row.entity.id);
        } else {
            $scope.selectedRows.splice($scope.selectedRows.indexOf(row.entity.id), 1);
        }
   });
  
 };

 initializeGrid();
 var resizeGrid = function (rowCount) {
     var minHeight = 60;
     var newHeight = (rowCount * 30 )+ minHeight;
 
     angular.element(document.getElementsByClassName('gridStyle')[0]).css('height', newHeight + 'px');
 };


}])
.factory('BackendServiceDashboardConfig', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/dashboard_config/';



        function getDashboardConfig(dashboardId) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + dashboardId
            });

            return sendRequest(request);
        }
       
        function getMetricsDD() {
            var request = $http({
                method: 'GET',
                url: '/api/metrics_dd/'
            });

            return sendRequest(request);
        }

        function createDashboardConfig(body) {
     
            var request = $http({
                method: 'POST',
                data: body,
                url: backendGlobalUrl
            });
     
            return sendRequest(request);
        }

        function updateDashboardConfig(dashboard_id,  body) {
     
            var request = $http({
                method: 'PUT',
                data: body,
                url: backendGlobalUrl + dashboard_id 
            });
     
            return sendRequest(request);
        }
        function deleteDashboardConfig(id) {

            var request = $http({
                method: 'DELETE',
                url: backendGlobalUrl + id
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
                getDashboardConfig  : getDashboardConfig,
                createDashboardConfig: createDashboardConfig,
                updateDashboardConfig: updateDashboardConfig,
                deleteDashboardConfig: deleteDashboardConfig,
                getMetricsDD    : getMetricsDD
            };
    }
]);
