'use strict';

/* Controllers */


var app= angular.module('opsVisionApp');

app.controller('ChannelsCtrl',  ['$scope', 'BackendServiceChannel', '$q', '$http', function ($scope, BackendServiceChannel, $q, $http) {
		
 $scope.viewModel = {};
 $scope.viewModel.$back = function() { 
   window.history.back();
    };
  $scope.viewModel.selectedRows = [];
  $scope.gridOptions = { 
    enableRowSelection: true,
    enableSelectAll: true,
    enableCellEditOnFocus: true,
    selectionRowHeaderWidth: 30,
    rowHeight: 30
  };
  $scope.viewModel.myExternalScope = $scope;
  var initializeGrid = function(){
     BackendServiceChannel.getChannels().then(function(channels){
          $scope.gridOptions.data = channels.data;
          resizeGrid(channels.data.length);
      });


    $scope.viewModel.selectedRows.length = 0;
          
  };
      
  $scope.viewModel.deleteRows = function(){
      for (var i = $scope.viewModel.selectedRows.length - 1; i >= 0; i--) {
          BackendServiceChannel.deleteChannel($scope.viewModel.selectedRows[i]).then(function(channels){
              initializeGrid();
          });
      }
  };
  $scope.viewModel.addNewRow = function() {
    $scope.gridOptions.data.push({
                
                "channel_cd": null,
                "description": null,
                "updated_by": null
              });
     resizeGrid($scope.gridOptions.data.length);
  };
 
  $scope.gridOptions.columnDefs = [{ 
              name: 'channel_id', 
              displayName: 'Channel Id', 
              enableCellEdit: false,
              width: '5%'
   
         }, { 
              name: 'channel_cd', 
              displayName: 'Channel Code', 
              enableCellEdit: true,
              width: '10%'
         }, { 
              name: 'description', 
              displayName: 'Description', 
              enableCellEdit: true,
              width: '25%' 
         },  {   
              name: 'updated_by', 
              displayName: 'Updated By', 
              enableCellEdit: true,
              width: '10%'
         }, { 
              name: 'updated', 
              displayName: 'Updated On', 
              enableCellEdit: false,
              width: '10%' 
         }, {
              name: 'Add_Content', 
              displayName: 'Action', 
              cellTemplate: '<div style="text-align:center"> <a   class="btn btn-xs btn-primary" type="button" href="/channel_details/{{row.entity.channel_id}}">Add Content</a> &nbsp; <a   class="btn btn-xs btn-success" type="button" href="/broadcasts/{{row.entity.channel_cd}}" target="_blank">Watch</a></div>', 
              enableCellEdit: false,
              width: '20%'       
         }];
   $scope.gridOptions.multiSelect = true;
   $scope.saveRow = function( rowEntity ) {
       var promise = $q.defer();
       $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );
       if(rowEntity.channel_id === undefined){
           BackendServiceChannel.createChannel(rowEntity);
       } else {
           BackendServiceChannel.updateChannel(rowEntity.channel_id, rowEntity);
       }
       initializeGrid();
       promise.resolve();
  }; 

 $scope.gridOptions.onRegisterApi = function(gridApi){
   //set gridApi on scope
   $scope.gridApi = gridApi;
   gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
   gridApi.selection.on.rowSelectionChanged($scope,function(row){
        if (row.isSelected) {
            $scope.viewModel.selectedRows.push(row.entity.channel_id);
        } else {
            $scope.viewModel.selectedRows.splice($scope.viewModel.selectedRows.indexOf(row.entity.channel_id), 1);
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
.factory('BackendServiceChannel', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/channels/';

        function getChannels() {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl 
            });

            return sendRequest(request);
        }
       
        function getUrlsDD() {
            var request = $http({
                method: 'GET',
                url: '/api/urls_dd/'
            });

            return sendRequest(request);
        }

        function createChannel(body) {
     
            var request = $http({
                method: 'POST',
                data: body,
                url: backendGlobalUrl
            });
     
            return sendRequest(request);
        }

        function updateChannel(id, body) {
     
            var request = $http({
                method: 'PUT',
                data: body,
                url: backendGlobalUrl + id
            });
     
            return sendRequest(request);
        }
        function deleteChannel(id) {

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
                getChannels  : getChannels,
                createChannel: createChannel,
                updateChannel: updateChannel,
                deleteChannel: deleteChannel,
                getUrlsDD    : getUrlsDD
            };
    }
]);
