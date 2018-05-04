'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');

app.controller('SplitScreenInputCtrl',  ['$scope', 'BackendServiceSplitScreenInput', '$q', '$http', '$routeParams', 
    function ($scope, BackendServiceSplitScreenInput, $q, $http, $routeParams) {
 
   $scope.viewModel = {};
   $scope.viewModel.$back = function () {
       window.history.back();
   };  
   $scope.channel_splitscreen_id = $routeParams.channel_splitscreen_id;
   $scope.viewModel.splitscreen = {};
   $scope.master= {};


   //populate the channel selection dropdown
   $scope.viewModel.selectedChannelDD = null;
   $scope.viewModel.channel_dds = [];
    

  var initializeGrid = function(){
    if ($scope.channel_splitscreen_id){
                BackendServiceSplitScreenInput.getSplitScreen($scope.channel_splitscreen_id).then(function (splitscreen){
                    console.log($scope.channel_splitscreen_id);
               $scope.viewModel.splitscreen.channel_splitscreen_id                = splitscreen.data[0].channel_splitscreen_id;
               $scope.viewModel.splitscreen.channel_splitscreen_cd                = splitscreen.data[0].channel_splitscreen_cd;
               $scope.viewModel.splitscreen.description                           = splitscreen.data[0].description;
               $scope.viewModel.splitscreen.channel_id_left                       = splitscreen.data[0].channel_id_left;
               $scope.viewModel.splitscreen.channel_id_right                      = splitscreen.data[0].channel_id_right;                   
               if (splitscreen.data[0].created){
                 $scope.viewModel.splitscreen.created                             = new Date(splitscreen.data[0].created); 
               };                        
               $scope.viewModel.splitscreen.updated_by                            = splitscreen.data[0].updated_by;
               if (splitscreen.data[0].updated){
                 $scope.viewModel.splitscreen.updated                             = new Date(splitscreen.data[0].updated); 
               }; 
       
               $scope.master= angular.copy($scope.splitscreen);
              });
      };
      BackendServiceSplitScreenInput.getChannelDD().then(function(channels){
             $scope.viewModel.channel_dds = channels.data;
      });  
  };

    if ($scope.channel_splitscreen_id){
        initializeGrid();
    };

    $scope.submit = function(splitscreen) {
       if(splitscreen.channel_splitscreen_id === undefined){
           if (!splitscreen.channel_splitscreen_cd || !splitscreen.description || splitscreen.channel_id_right==null || splitscreen.channel_id_left == null || !splitscreen.updated_by){
                $scope.viewModel.success = null;
                $scope.viewModel.error = 'ERROR:  Complete all REQUIRED Fields';   
            } else {
               BackendServiceSplitScreenInput.createSplitScreen(splitscreen);
               var date = new Date();
               var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
               $scope.viewModel.error = null;
               $scope.viewModel.success = 'SAVE SUCCESSFUL:  ' + timeStr;
            };
       } else {
           //check if any changes
                if (JSON.stringify(splitscreen) != JSON.stringify($scope.master)) {
                    if (!splitscreen.channel_splitscreen_cd || !splitscreen.description || splitscreen.channel_id_right == null || splitscreen.channel_id_left == null || !splitscreen.updated_by) {
                        $scope.viewModel.success = null;
                        $scope.viewModel.error = 'ERROR:  Complete all REQUIRED Fields';
                    } else {
                        BackendServiceSplitScreenInput.updateSplitScreen(splitscreen.channel_splitscreen_id, splitscreen);
                        var date = new Date();
                        var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                        $scope.viewModel.error = null;
                        $scope.viewModel.success = 'SAVE SUCCESSFUL:  ' + timeStr;
                    };                   
           } else {
                $scope.viewModel.success = null;
                $scope.viewModel.error = 'WARNING:  No Changes made to discussion_point';
           }
           
       }
       $scope.master = angular.copy(splitscreen);
     };
     initializeGrid();
}]).factory('BackendServiceSplitScreenInput', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/split_screens/';

      
        function getSplitScreen(channel_splitscreen_id) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + channel_splitscreen_id 
            });

            return sendRequest(request);
        }

        function getChannelDD() {
            var request = $http({
                method: 'GET',
                url: '/api/channel_dd/'
            });

            return sendRequest(request);
        }

        function createSplitScreen(body) {
     
            var request = $http({
                method: 'POST',
                data: body,
                url: backendGlobalUrl
            });
     
            return sendRequest(request);
        }

        function updateSplitScreen(discussion_point_id, discussion_point) {
            var request = $http({
                method: 'PUT',
                data: discussion_point,
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
                getSplitScreen          :      getSplitScreen,
                createSplitScreen       :      createSplitScreen,
                updateSplitScreen       :      updateSplitScreen,
                getChannelDD            :      getChannelDD
            };
    }
]);