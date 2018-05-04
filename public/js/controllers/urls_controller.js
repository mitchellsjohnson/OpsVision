'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');

app.controller('URLsCtrl',  ['$scope', 'BackendServiceUrl', '$q', function ($scope, BackendServiceUrl, $q) {
 
 $scope.$back = function() { 
   window.history.back();
    };
  $scope.myExternalScope = $scope;  

  $scope.selectedRows = [];
  $scope.gridOptions = { 
    enableRowSelection: true,
    enableSelectAll: true,
    multiSelect:  true,
    enableCellEditOnFocus: true,
    selectionRowHeaderWidth: 30,
    rowHeight: 30
  };
  $scope.gridOptions.multiSelect = true;
 
  var initializeGrid = function(){
      BackendServiceUrl.getUrls().then(function(urls){
          $scope.gridOptions.data = urls.data;
          resizeGrid(urls.data.length);
      });
      $scope.selectedRows.length = 0;
  };
      
  $scope.deleteRows = function(){
      for (var i = $scope.selectedRows.length - 1; i >= 0; i--) {
          BackendServiceUrl.deleteUrl($scope.selectedRows[i]).then(function(urls){
              initializeGrid();
          });
      }
  };
  $scope.addNewRow = function() {
    $scope.gridOptions.data.push({
                
                "url_string": null,
                "description": null,
                "updated_by": null
              });
    resizeGrid($scope.gridOptions.data.length);
  };
  //populate the URL type dropdown
  $scope.selectedUrlTypeDD = null;
  $scope.urltype_dds = [];
  BackendServiceUrl.getUrlTypeDD().then(function(urltypes){
                $scope.urltype_dds = urltypes.data;
  });     
  $scope.gridOptions.columnDefs = [{ 
              name: 'url_type_id', 
              displayName: 'URL Type', 
              cellTemplate: "../partials/urltypedd_external.html",                                         
              width: '14%' 
          }, { 
              name: 'url_id', 
              displayName: 'URL Id', 
              enableCellEdit: false,
              width: '6%'
   
          }, { 
              name: 'url_string', 
              displayName: 'URL String', 
              type:  'URL',
              width: '35%'
          }, { 
              name: 'description', 
              displayName: 'Description', 
              width: '25%' 
          }, {
              name: 'updated_by', 
              displayName: 'Updated By', 
              width: '10%'
          }, { 
              name: 'updated', 
              displayName: 'Updated On', 
              enableCellEdit: false,
              width: '10%' 
          }];

   $scope.saveRow = function( rowEntity ) {
       var promise = $q.defer();
       $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );
       if(rowEntity.url_id === undefined){
           BackendServiceUrl.createUrl(rowEntity);
       } else {
           BackendServiceUrl.updateUrl(rowEntity.url_id, rowEntity);
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
            $scope.selectedRows.push(row.entity.url_id);
        } else {
            $scope.selectedRows.splice($scope.selectedRows.indexOf(row.entity.url_id), 1);
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
.factory('BackendServiceUrl', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/urls/';

        function getUrls() {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl 
            });

            return sendRequest(request);
        }

        function createUrl(body) {
     
            var request = $http({
                method: 'POST',
                data: body,
                url: backendGlobalUrl
            });
     
            return sendRequest(request);
        }

        function updateUrl(id, body) {
     
            var request = $http({
                method: 'PUT',
                data: body,
                url: backendGlobalUrl + id
            });
     
            return sendRequest(request);
        }
        function deleteUrl(id) {

            var request = $http({
                method: 'DELETE',
                url: backendGlobalUrl + id
            });

            return sendRequest(request);
        }
        function getUrlTypeDD() {
            var request = $http({
                method: 'GET',
                url: '/api/urltype_dd/'
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
                getUrls  :      getUrls,
                createUrl:      createUrl,
                updateUrl:      updateUrl,
                deleteUrl:      deleteUrl,
                getUrlTypeDD:   getUrlTypeDD
            };
    }
]);


