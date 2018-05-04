'use strict';

/* Controllers */


var app= angular.module('opsVisionApp');

app.controller('DiscussionPointsCtrl',  ['$scope', 'BackendServiceDiscussionPoints', '$q', function ($scope, BackendServiceDiscussionPoints, $q) {

 $scope.myExternalScope = $scope;
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
  $scope.gridOptions.multiSelect = true;
 

  var initializeGrid = function(){
    
     BackendServiceDiscussionPoints.getDiscussionPoints().then(function(discussion_points){
          $scope.gridOptions.data = discussion_points.data;
          resizeGrid(discussion_points.data.length);
      });
    $scope.selectedRows.length = 0;      
  };
     
  $scope.deleteRows = function(){
      for (var i = $scope.selectedRows.length - 1; i >= 0; i--) {
          BackendServiceDiscussionPoints.deleteDiscussionPoint($scope.selectedRows[i]).then(function(discussion_point){
              initializeGrid();
          });
      }
  };
 
  $scope.detachRows = function(){
      for (var i = $scope.selectedRows.length - 1; i >= 0; i--) {
          BackendServiceDiscussionPoints.detachDiscussionPoint($scope.selectedRows[i]).then(function(discussion_point){
              initializeGrid();
          });
      }
  };


//populate the metric selection dropdown
 $scope.selectedMetricsDD = null;
 $scope.metrics_dds = [];
 BackendServiceDiscussionPoints .getMetricsDD().then(function(metrics){
               $scope.metrics_dds = metrics.data;
 });     


  $scope.gridOptions.columnDefs = [
         { 
              name: 'discussion_point_id', 
              displayName: 'Discussion Point Id', 
              enableCellEdit: false,                                        
              width: '6%' 
         }, { 
              name: 'detail', 
              displayName: 'Discussion Point Detail', 
              enableCellEdit: false, 
              width: '40%' 
         },  { 
              name: 'metric_id', 
              displayName: 'Metric Id',     
              enableCellEdit: false,                                   
              width: '6%' 
         }, { 
              name: 'label', 
              displayName: 'Metric Description',     
              enableCellEdit: false,                                   
              width: '15%' 
         }, {
              name: 'month', 
              displayName: 'month',     
              enableCellEdit: false,                                   
              width: '6%' 
         }, {
              name: 'year', 
              displayName: 'year',     
              enableCellEdit: false,                                   
              width: '6%' 
         }, {
              name: 'updated_by', 
              displayName: 'Updated By', 
              enableCellEdit: false, 
              width: '5%' 
         }, { 
              name: 'updated', 
              displayName: 'Updated On', 
              enableCellEdit: false,
              width: '5%' 
         }, {
              name: 'Add_Content', 
              displayName: 'Action', 
              cellTemplate: '<div style="text-align:center"> <a   class="btn btn-xs btn-primary" type="button" href="/discussion_point_input/{{row.entity.discussion_point_id}}">Edit</a> </div>', 
              enableCellEdit: false,
              width: '10%'       
         }];
$scope.gridOptions.multiSelect = true;

 $scope.gridOptions.onRegisterApi = function(gridApi){
   //set gridApi on scope
   $scope.gridApi = gridApi;
   gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
   gridApi.selection.on.rowSelectionChanged($scope,function(row){
        if (row.isSelected) {
            $scope.selectedRows.push(row.entity.discussion_point_id);
        } else {
            $scope.selectedRows.splice($scope.selectedRows.indexOf(row.entity.discussion_point_id), 1);
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
.factory('BackendServiceDiscussionPoints', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/discussion_points/';



        function getDiscussionPoints() {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl
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

        function createDiscussionPoint(body) {
     
            var request = $http({
                method: 'POST',
                data: body,
                url: backendGlobalUrl
            });
     
            return sendRequest(request);
        }

        function detachDiscussionPoint(discussion_point_id) {
            var urlDetach = backendGlobalUrl + 'detach/';
            var request = $http({
                method: 'PUT',
                url: urlDetach + discussion_point_id 
            });
     
            return sendRequest(request);
        }

        function updateDiscussionPoint(discussion_point_id,body) {
     
            var request = $http({
                method: 'PUT',
                data: body,
                url: backendGlobalUrl + discussion_point_id 
            });
     
            return sendRequest(request);
        }
        function deleteDiscussionPoint(discussion_point_id) {

            var request = $http({
                method: 'DELETE',
                url: backendGlobalUrl + discussion_point_id
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
                getDiscussionPoints  : getDiscussionPoints,
                createDiscussionPoint: createDiscussionPoint,
                updateDiscussionPoint: updateDiscussionPoint,
                detachDiscussionPoint: detachDiscussionPoint,
                deleteDiscussionPoint: deleteDiscussionPoint,
                getMetricsDD    : getMetricsDD
            };
    }
]);
