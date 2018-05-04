'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');

app.controller('CommitmentsCtrl',  ['$scope', 'BackendServiceCommitments', '$q', '$http', '$routeParams', '$filter',
    function ($scope, BackendServiceCommitments, $q, $http, $routeParams, $filter) {
  
 $scope.$back = function() { 
   window.history.back();
    };
 $scope.rowCollection = [];
 $scope.project                      = 'Loading';
 $scope.area                         = 'Loading';
 $scope.label                        = 'Loading';
 $scope.metric_value_mtd             = 'Loading';
 $scope.metric_measurement_mtd       = 'Loading';
 $scope.metric_value_ytd             = 'Loading';
 $scope.metric_measurement_ytd       = 'Loading';
 $scope.display_type                 = 'Loading';
 $scope.bugcount                     = 'Loading';
 $scope.lastUpdatedDt                = 'Loading';
 $scope.committedDeliveredCount      = 'Loading';
 $scope.notCommittedDeliveredCount   = 'Loading';
 $scope.missedCommitmentsCount       = 'Loading';


 $scope.year = $routeParams.year;
 $scope.month = $routeParams.month;
		

 $scope.metric_id  = $routeParams.metricid;

 if ((Number($routeParams.month) - 1) === 0){
    $scope.prev_month = 12
    $scope.prev_year = Number($routeParams.year) -1;
 } else {
    $scope.prev_month = Number($routeParams.month) - 1;
    $scope.prev_year = Number($routeParams.year);
 }

 if ((Number($routeParams.month) + 1) === 13){
    $scope.next_month = 1
    $scope.next_year = Number($routeParams.year) +1;
 } else {
    $scope.next_month = Number($routeParams.month) + 1;
    $scope.next_year = Number($routeParams.year);
 }

//Feature support began in June 2015, don't allow user to roll back before this date
//TODO - make this abstract and not a hard code
var prevDt = new Date($scope.prev_year, $scope.prev_month -1, 0);
var featureDt = new Date(2015, 5, 0); //june, 2015
$scope.allow_previous_rollback = 'TRUE';
if (prevDt < featureDt){
    $scope.allow_previous_rollback = 'FALSE';
}



 var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
 ];

 $scope.monthName = monthNames[$routeParams.month -1]
   
BackendServiceCommitments.getCommitments($routeParams.metricid,  $scope.month,  $scope.year ).then(function(commitments){
    var committedDelivered = 0;
    var notCommittedDelivered = 0;
    var missed = 0;

    for (var i = 0; i < commitments.data.length; i++) {
         $scope.rowCollection[i] = commitments.data[i];
         if (commitments.data[i].commitResult === 'Committed and Delivered' || commitments.data[i].commitResult === 'Committed and Delivered (Manual Override)'){
            committedDelivered = committedDelivered + 1;
         }
         if (commitments.data[i].commitResult === 'Delivered without Commitment' ){
            notCommittedDelivered = notCommittedDelivered + 1;
         }
         if (commitments.data[i].commitResult === 'Missed Commitment' ){
            missed = missed + 1;
         }
    }
    $scope.committedDeliveredCount      = committedDelivered;
    $scope.notCommittedDeliveredCount   = notCommittedDelivered;
    $scope.missedCommitmentsCount       = missed;
    $scope.bugcount                     = commitments.data.length;
    BackendServiceCommitments.getMetricDetails($routeParams.metricid, $scope.month,  $scope.year).then(function(metricDetails){
          if (metricDetails.data.length===1){
            $scope.project                 = metricDetails.data[0].project;
            $scope.area                    = metricDetails.data[0].area;
            $scope.label                   = metricDetails.data[0].label;
            $scope.metric_value_mtd        = metricDetails.data[0].metric_value_mtd;
            $scope.metric_measurement_mtd  = metricDetails.data[0].metric_measurement_mtd;
            $scope.metric_value_ytd        = metricDetails.data[0].metric_value_ytd;
            $scope.metric_measurement_ytd  = metricDetails.data[0].metric_measurement_ytd;
            $scope.display_type            = metricDetails.data[0].display_type;
            $scope.lastUpdatedDt           = metricDetails.data[0].LastUpdatedProdDefectDt;
            $scope.LastUpdatedProdCommitDt = metricDetails.data[0].LastUpdatedProdCommitDt;

          };
       }); 
});
 $scope.displayedCollection = [].concat($scope.rowCollection);
      

}])
.factory('BackendServiceCommitments', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api';

        function getCommitments(metricid, month, year) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + '/commitments/' + metricid + '/' + month + '/' + year
            });

            return sendRequest(request);
        }
        function getMetricDetails(metricid, month, year) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + '/metric_details/' + metricid + '/' + month + '/' + year
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
                getCommitments      :      getCommitments,
                getMetricDetails    :      getMetricDetails

            };
    }
]);
