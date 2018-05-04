'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');




app.controller('DiscussionPointDetailsCtrl',  ['$scope', 'BackendServiceDiscussionPointDetails', '$q', '$http', '$routeParams', 
    function ($scope, BackendServiceDiscussionPointDetails, $q, $http, $routeParams) {
  
   $scope.$back = function() { 
     window.history.back();
    }; 
    $scope.channels  = [];

    $scope.year = $routeParams.year
    $scope.month = $routeParams.month
    $scope.dashboardid = $routeParams.dashboardid
    $scope.metricid = $routeParams.metricid

    $scope.gridOptions = {};
    $scope.metric_label                            = 'Error';
    $scope.metric_value_mtd                        = 'Error';
    $scope.metric_measurement_mtd                  = 'Error';
    $scope.metric_value_ytd                        = 'Error';
    $scope.metric_measurement_ytd                  = 'Error';
    $scope.display_type                            = 'Error';
    $scope.discussion_point                        = 'Error';
    $scope.discussion_point_created_by             = 'Error';

   $scope.$back = function() { 
               window.history.back();
    };
    BackendServiceDiscussionPointDetails.getDiscussionPoint($scope.metricid, $scope.month, $scope.year).then(function(discussionpoint){
                if (discussionpoint.data.length===1){
                  $scope.discussionpoint            = discussionpoint.data[0].discussion_point_detail;
                  $scope.metric_label               = discussionpoint.data[0].label;
                  $scope.metric_value_mtd           = discussionpoint.data[0].metric_value_mtd;
                  $scope.metric_measurement_mtd     = discussionpoint.data[0].metric_measurement_mtd;
                  $scope.metric_value_ytd           = discussionpoint.data[0].metric_value_ytd;
                  $scope.metric_measurement_ytd     = discussionpoint.data[0].metric_measurement_ytd;
                  $scope.display_type               = discussionpoint.data[0].display_type;
                  $scope.discussion_point_created_by= discussionpoint.data[0].discussion_point_created_by;
                };
      });

}])
.factory('BackendServiceDiscussionPointDetails', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/metric_details/';

        function getDiscussionPoint(metricid, month, year) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl  + metricid + '/' + month + '/' + year
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
                getDiscussionPoint : getDiscussionPoint
            };
    }
]);
