'use strict';

/* Controllers */


var app= angular.module('opsVisionApp');

app.controller('DashboardsCtrl',  ['$scope', 'BackendServiceDashboards', '$q', '$http', 
    function ($scope, BackendServiceDashboards, $q, $http) {

  $scope.$back = function() { 
   window.history.back();
    };
  $scope.selectedRows = [];
  $scope.gridOptions = { 
    enableRowSelection: true,
    enableSelectAll: true,
    enableCellEditOnFocus: true,
    selectionRowHeaderWidth: 30,
    rowHeight: 30
  };
  $scope.myExternalScope = $scope;

  var initializeGrid = function(){
     BackendServiceDashboards.getDashboards().then(function(dashboards){
          $scope.gridOptions.data = dashboards.data;
          resizeGrid(dashboards.data.length);
      });


    $scope.selectedRows.length = 0;
          
  };
      
  $scope.deleteRows = function(){
      for (var i = $scope.selectedRows.length - 1; i >= 0; i--) {
          BackendServiceDashboards.deleteDashboard($scope.selectedRows[i]).then(function(dashboard){
              initializeGrid();
          });
      }
  };
  $scope.addNewRow = function() {
    $scope.gridOptions.data.push({
                
                "dashboard_cd": null,
                "description": null,
                "updated_by": null
              });
     resizeGrid($scope.gridOptions.data.length);
  };
 
  //populate the Dashboard type dropdown
  $scope.selectedDashboardTypeDD = null;
  $scope.dashboardtype_dds = [];
  BackendServiceDashboards.getDashboardTypeDD().then(function(dashboardtypes){
                $scope.dashboardtype_dds = dashboardtypes.data;
  });  
  $scope.gridOptions.columnDefs = [{ 
              name: 'dashboard_id', 
              displayName: 'Dashboard Id', 
              enableCellEdit: false,
              width: '5%'
   
         }, { 
              name: 'dashboard_cd', 
              displayName: 'Dashboard Code', 
              enableCellEdit: true,
              width: '10%'
         }, { 
              name: 'description', 
              displayName: 'Description', 
              enableCellEdit: true ,
              width: '20%' 
         }, { 
              name: 'dashboard_type_id', 
              displayName: 'Dashboard Type', 
              enableCellEdit: true,
              cellTemplate: "../partials/dashboards/dashboardtypedd_external.html",                                         
              width: '15%' 
         }, { 
              name: 'month_default', enableCellEdit: true, 
              displayName: 'Month Default', editableCellTemplate: 'ui-grid/dropdownEditor', width: '5%', 
              
              cellFilter: 'mapMonth', editDropdownValueLabel: 'month', editDropdownOptionsArray: [
              { id: 1, month: '1' }, 
              { id: 2, month: '2' }, 
              { id: 3, month: '3' }, 
              { id: 4, month: '4' }, 
              { id: 5, month: '5' }, 
              { id: 6, month: '6' }, 
              { id: 7, month: '7' }, 
              { id: 8, month: '8' }, 
              { id: 9, month: '9' }, 
              { id: 10, month: '10' }, 
              { id: 11, month: '11' }, 
              { id: 12, month: '12' }, 

         ] }, { 
              name: 'year_default', enableCellEdit: true ,
              displayName: 'Year Default', editableCellTemplate: 'ui-grid/dropdownEditor', width: '5%', 
              cellFilter: 'mapYear', editDropdownValueLabel: 'year', editDropdownOptionsArray: [
              { id: 2013, year: '2013' }, 
              { id: 2014, year: '2014' }, 
              { id: 2015, year: '2015' }, 
              { id: 2016, year: '2016' }, 
              { id: 2017, year: '2017' }, 
              { id: 2018, year: '2018' }, 
         ] }, { 
              name: 'updated_by', 
              enableCellEdit: true,
              displayName: 'Updated By', 
              width: '5%'
         }, { 
              name: 'updated', 
              displayName: 'Updated On', 
              enableCellEdit: false,
              width: '5%' 
         }, {
              name: 'Add_Metrics', 
              displayName: 'Action', 
              cellTemplate: '<div style="text-align:center"> <a   class="btn btn-xs btn-primary" type="button" href="/dashboard_config/{{row.entity.dashboard_id}}">Add Metrics</a> &nbsp; <a   class="btn btn-xs btn-success" type="button" href="/dashboard_details/{{row.entity.dashboard_id}}/{{row.entity.year_default}}" target="_blank">View Summary</a> &nbsp; <a   class="btn btn-xs btn-success" type="button" href="/initiative_dashboard/{{row.entity.dashboard_id}}/{{row.entity.year_default}}/{{row.entity.month_default}}/12" target="_blank">View Details</a></div>', 
              enableCellEdit: false,
              width: '20%'       
         }];
   $scope.gridOptions.multiSelect = true;
   $scope.saveRow = function( rowEntity ) {
       var promise = $q.defer();
       $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );
       if(rowEntity.dashboard_id === undefined){
           BackendServiceDashboards.createDashboard(rowEntity);
       } else {
           BackendServiceDashboards.updateDashboard(rowEntity.dashboard_id, rowEntity);
       }
     
       promise.resolve();
       initializeGrid();
  }; 

 $scope.gridOptions.onRegisterApi = function(gridApi){
   //set gridApi on scope
   $scope.gridApi = gridApi;
   gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
   gridApi.selection.on.rowSelectionChanged($scope,function(row){
        if (row.isSelected) {
            $scope.selectedRows.push(row.entity.dashboard_id);
        } else {
            $scope.selectedRows.splice($scope.selectedRows.indexOf(row.entity.dashboard_id), 1);
        }
   });
 };

 initializeGrid();
 var resizeGrid = function (rowCount) {
     var minHeight = 60;
     var newHeight = (rowCount * 30 )+ minHeight;;
 
     angular.element(document.getElementsByClassName('gridStyle')[0]).css('height', newHeight + 'px');
 };



}])
.factory('BackendServiceDashboards', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/dashboards/';

        function getDashboards() {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl 
            });

            return sendRequest(request);
        }
       
 
        function createDashboard(body) {
     
            var request = $http({
                method: 'POST',
                data: body,
                url: backendGlobalUrl
            });
     
            return sendRequest(request);
        }

        function updateDashboard(id, body) {
     
            var request = $http({
                method: 'PUT',
                data: body,
                url: backendGlobalUrl + id
            });
     
            return sendRequest(request);
        }
        function deleteDashboard(id) {

            var request = $http({
                method: 'DELETE',
                url: backendGlobalUrl + id
            });

            return sendRequest(request);
        }
        function getDashboardTypeDD() {
            var request = $http({
                method: 'GET',
                url: '/api/dashboard_type_dd/'
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
                getDashboards  : getDashboards,
                createDashboard: createDashboard,
                updateDashboard: updateDashboard,
                deleteDashboard: deleteDashboard,
                getDashboardTypeDD:   getDashboardTypeDD
            };
    }
]);
