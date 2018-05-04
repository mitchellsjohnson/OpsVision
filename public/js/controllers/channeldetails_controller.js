'use strict';

/* Controllers */


var app= angular.module('opsVisionApp');

app.controller('ChannelDetailsCtrl',  ['$scope', 'BackendServiceChannelDetails', '$q', '$http', '$routeParams', 
    function ($scope, BackendServiceChannelDetails, $q, $http, $routeParams) {
  $scope.viewModel = {};
  $scope.viewModel.myExternalScope = $scope;
  $scope.viewModel.$back = function() { 
   window.history.back();
    };
 
  $scope.viewModel.selectedRows = [];
  $scope.gridOptions = { 
    enableRowSelection: true,
    enableSelectAll: true,
    multiSelect:  true,
    enableCellEditOnFocus: true,
    selectionRowHeaderWidth: 30,
    rowHeight: 30

  };



  var initializeGrid = function(){
    
     BackendServiceChannelDetails.getChannelDetails($routeParams.channelid).then(function(channel){
          $scope.gridOptions.data = channel.data;
          resizeGrid(channel.data.length);
      });
    $scope.viewModel.selectedRows.length = 0;      
  };
     
  $scope.viewModel.deleteRows = function(){
      for (var i = $scope.viewModel.selectedRows.length - 1; i >= 0; i--) {
          BackendServiceChannelDetails.deleteChannelDetails($scope.viewModel.selectedRows[i]).then(function(channel){
              initializeGrid();
          });
      }
  };
  $scope.viewModel.addNewRow = function() {
    $scope.gridOptions.data.push({
                "channel_id": $routeParams.channelid,
                "channel_cd": null,
                "description": null,
                "updated_by": null
              });
    resizeGrid($scope.gridOptions.data.length);
  };
//populate the URL selection dropdown
 $scope.selectedUrlDD = null;
 $scope.url_dds = [];
 BackendServiceChannelDetails.getUrlsDD().then(function(urls){
               $scope.url_dds = urls.data;
 });     


  $scope.gridOptions.columnDefs = [
         { 
              name: 'url_id', 
              displayName: 'URL Description', 
              enableCellEdit: true,
              cellTemplate: "../partials/urldd_external.html",                                         
              width: '30%' 
         }, { 
              name: 'url_string', 
              displayName: 'Url', 
              enableCellEdit: false,
              width: '30%' 
         }, { 
              name: 'priority', 
              displayName: 'priority',
              enableCellEdit: true,
              type: 'number',
              width: '8%' 
         }, {   
              name: 'display_duration_sec', 
              displayName: 'Display Seconds', 
              enableCellEdit: true,
              type: 'number',
              width: '12%'
         }, { 
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
              name: 'id', 
              visible:  false
         },{ 
              name: 'channel_id', 
              visible:  false
         }];

   $scope.saveRow = function( rowEntity ) {
       var promise = $q.defer();
       $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );
       if(rowEntity.id === undefined){
            BackendServiceChannelDetails.createChannelDetails(rowEntity);
         } else {
            BackendServiceChannelDetails.updateChannelDetails(rowEntity.id, rowEntity.url_id, rowEntity);
         }
       initializeGrid();
       $scope.url_id = rowEntity.url_id;
       promise.resolve();
  }; 

 $scope.gridOptions.onRegisterApi = function(gridApi){
   //set gridApi on scope
   $scope.gridApi = gridApi;
   gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
   gridApi.selection.on.rowSelectionChanged($scope,function(row){
        if (row.isSelected) {
            $scope.viewModel.selectedRows.push(row.entity.id);
        } else {
            $scope.viewModel.selectedRows.splice($scope.viewModel.selectedRows.indexOf(row.entity.id), 1);
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
.factory('BackendServiceChannelDetails', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/channel_details/';



        function getChannelDetails(channelId) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + channelId
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

        function createChannelDetails(body) {
     
            var request = $http({
                method: 'POST',
                data: body,
                url: backendGlobalUrl
            });
     
            return sendRequest(request);
        }

        function updateChannelDetails(id, urlid, body) {
     
            var request = $http({
                method: 'PUT',
                data: body,
                url: backendGlobalUrl + id + '/' + urlid
            });
     
            return sendRequest(request);
        }
        function deleteChannelDetails(id) {

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
                getChannelDetails  : getChannelDetails,
                createChannelDetails: createChannelDetails,
                updateChannelDetails: updateChannelDetails,
                deleteChannelDetails: deleteChannelDetails,
                getUrlsDD    : getUrlsDD
            };
    }
]);
