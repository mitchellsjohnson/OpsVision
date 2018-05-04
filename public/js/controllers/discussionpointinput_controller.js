'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');




app.controller('DiscussionPointInputCtrl',  ['$scope', 'BackendServiceDiscussionPointInput', '$q', '$http', '$routeParams', 
    function ($scope, BackendServiceDiscussionPointInput, $q, $http, $routeParams) {
 
   $scope.$back = function() { 
      window.history.back();
       };         
   $scope.discussion_point_id = $routeParams.discussion_point_id;
   $scope.discussion_point = {};
   $scope.master= {};
   $scope.previous_discussion_point_id    = +$routeParams.discussion_point_id -1;
   $scope.next_discussion_point_id        = +$routeParams.discussion_point_id +1;
   $scope.years =
   [
       { id: 2014, name: "2014" },
       { id: 2015, name: "2015" },
       { id: 2016, name: "2016" },
       { id: 2017, name: "2017" },
       { id: 2018, name: "2018" },
       { id: 2019, name: "2019" },
   ];  
   $scope.months =
   [
       { id: 1, name: "Jan" },
       { id: 2, name: "Feb" },
       { id: 3, name: "Mar" },
       { id: 4, name: "Apr" },
       { id: 5, name: "May" },
       { id: 6, name: "Jun" },
       { id: 7, name: "Jul" },
       { id: 8, name: "Aug" },
       { id: 9, name: "Sep" },
       { id: 10, name: "Oct" },
       { id: 11, name: "Nov" },
       { id: 12, name: "Dec" },
   ];  
   //populate the URL selection dropdown
 $scope.selectedMetricsDD = null;
 $scope.metrics_dds = [];
    

  var initializeGrid = function(){
    if ($scope.discussion_point_id){
        BackendServiceDiscussionPointInput.getDiscussionPoint($scope.discussion_point_id).then(function(discussion_point){
               $scope.discussion_point.discussion_point_id                 = discussion_point.data[0].discussion_point_id;
               $scope.discussion_point.detail                              = discussion_point.data[0].detail
               $scope.discussion_point.month                               = discussion_point.data[0].month;
               $scope.discussion_point.year                                = discussion_point.data[0].year;
               $scope.discussion_point.metric_id                           = discussion_point.data[0].metric_id;
               $scope.discussion_point.created_by                          = discussion_point.data[0].created_by;
               if (discussion_point.data[0].created){
                 $scope.discussion_point.created                           = new Date(discussion_point.data[0].created); 
               };                        
               $scope.discussion_point.updated_by                          = discussion_point.data[0].updated_by;
               if (discussion_point.data[0].updated){
                 $scope.discussion_point.updated                           = new Date(discussion_point.data[0].updated); 
               }; 
       
               $scope.master= angular.copy($scope.discussion_point);
              });
      };
      BackendServiceDiscussionPointInput.getMetricsDD().then(function(metrics){
               $scope.metrics_dds = metrics.data;
      });  
  };

    if ($scope.discussion_point_id){
        initializeGrid();
    };

    $scope.submit = function(discussion_point) {
       if(discussion_point.discussion_point_id === undefined){
           if (!discussion_point.detail || !discussion_point.month || !discussion_point.year || !discussion_point.metric_id || !discussion_point.updated_by){
                $scope.success = null;
                $scope.error = 'ERROR:  Complete all REQUIRED Fields';   
            } else {
               BackendServiceDiscussionPointInput.createDiscussionPoint(discussion_point);
               var date = new Date();
               var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
               $scope.error = null;
               $scope.success = 'SAVE SUCCESSFUL:  ' + timeStr;
            };
       } else {
           //check if any changes
           if (JSON.stringify(discussion_point) != JSON.stringify($scope.master)) {
                BackendServiceDiscussionPointInput.updateDiscussionPoint(discussion_point.discussion_point_id, discussion_point);
                var date = new Date();
                var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                $scope.error = null;
                $scope.success = 'SAVE SUCCESSFUL:  ' + timeStr;
           } else {
                $scope.success = null;
                $scope.error = 'WARNING:  No Changes made to discussion_point';
           }
           
       }
       $scope.master = angular.copy(discussion_point);
     };
     initializeGrid();
}]).factory('BackendServiceDiscussionPointInput', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/discussion_points/';

      
        function getDiscussionPoint(discussion_point_id) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + discussion_point_id 
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

        function updateDiscussionPoint(discussion_point_id, discussion_point) {
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
                getDiscussionPoint    :      getDiscussionPoint,
                createDiscussionPoint :      createDiscussionPoint,
                updateDiscussionPoint :      updateDiscussionPoint,
                getMetricsDD:   getMetricsDD
            };
    }
]);