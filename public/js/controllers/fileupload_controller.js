'use strict';

/* Controllers */


var app= angular.module('opsVisionApp');


app.controller('FileUploadCtrl',  ['$scope', 'BackendServiceFileUpload', '$q', '$http', '$upload',
    function ($scope, BackendServiceFileUpload, $q, $http, $upload) {
    $scope.$back = function() { 
        window.history.back();
         };   
  
    $scope.uploadFile = function(){
 
     $scope.fileSelected = function(files) {
         if (files && files.length) {
            $scope.file = files[0];
         }
 
         $upload.upload({
           url: '/api/upload', //node.js route
           file: $scope.file
         })
         .success(function(data) {
           console.log(data, 'uploaded');
          });
 
        };
    };

}])
.factory('BackendServiceFileUpload', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/channels/';

        function getChannels() {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl 
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
                getChannels  : getChannels
            };
    }
]);

