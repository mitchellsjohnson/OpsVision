'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');




app.controller('InitiativeUpdateRequestCtrl',  ['$scope', '$cookies', '$cookieStore', 'BackendServiceInitiativeUpdateRequest', '$q', '$http', '$routeParams', 
    function ($scope, $cookies, $cookieStore, BackendServiceInitiativeUpdateRequest, $q, $http, $routeParams) {
   $scope.viewModel = {};
   $scope.viewModel.$back = function () {
       window.history.back();
        };
   $scope.viewModel.isAdmin = false;
   var isAdmin = $cookieStore.get('ADMIN');
   if (isAdmin === 'TRUE') {
       $scope.viewModel.isAdmin = true;
     };
   $scope.viewModel.metric_id = $routeParams.metric_id;
   $scope.viewModel.initiative_update_request_id = $routeParams.initiative_update_request_id;
   $scope.viewModel.initiativeUpdateRequest = {};
   $scope.viewModel.master= {};
   var d = new Date();
   $scope.viewModel.year = d.getFullYear();
   Date.prototype.yyyyDASHmmDASHdd = function () {
       var yyyy = this.getFullYear().toString();
       var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
       var dd = this.getDate().toString();
       return yyyy + '-' + (mm[1]?mm:"0" + mm[0]) + '-' + (dd[1]?dd:"0" + dd[0]); // padding
        };
   $scope.viewModel.requireDiscussionItem = false;
   
   $scope.viewModel.requireDiscussionItemCheck = function () {
       
       var check = $scope.viewModel.initiativeUpdateRequest.status;
       
       if (check === 'GREEN' || check ==='' || check === null) {
           $scope.viewModel.requireDiscussionItem = false;
       } else {
           $scope.viewModel.requireDiscussionItem = true;
       }
   };
     
   $scope.viewModel.todaysDt = d.yyyyDASHmmDASHdd;
   var d = new Date();
   $scope.viewModel.year = d.getFullYear();
   $scope.viewModel.month = d.getMonth() + 1;


        var initializeGrid = function (){
       BackendServiceInitiativeUpdateRequest.getInitiativeUpdateRequest($scope.viewModel.metric_id, $scope.viewModel.initiative_update_request_id).then(function(initiativeUpdateRequest){
               $scope.viewModel.initiativeUpdateRequest.initiative_update_request_id    = initiativeUpdateRequest.data[0].initiative_update_request_id;               
               $scope.viewModel.initiativeUpdateRequest.metric_id                       = initiativeUpdateRequest.data[0].metric_id;
               $scope.viewModel.initiativeUpdateRequest.label                           = initiativeUpdateRequest.data[0].label;
               if (initiativeUpdateRequest.data[0].status_dt) {
                   $scope.viewModel.initiativeUpdateRequest.status_dt                   = new Date(initiativeUpdateRequest.data[0].status_dt);
                };
               $scope.viewModel.initiativeUpdateRequest.status_month                    = initiativeUpdateRequest.data[0].status_month;
               $scope.viewModel.initiativeUpdateRequest.status_year                     = initiativeUpdateRequest.data[0].status_year;
               $scope.viewModel.initiativeUpdateRequest.percent_complete                = initiativeUpdateRequest.data[0].percent_complete;                                       
               $scope.viewModel.initiativeUpdateRequest.status                          = initiativeUpdateRequest.data[0].status;      
               $scope.viewModel.initiativeUpdateRequest.comment                         = initiativeUpdateRequest.data[0].comment;
               $scope.viewModel.initiativeUpdateRequest.status_submitted_by             = initiativeUpdateRequest.data[0].status_submitted_by;
               $scope.viewModel.initiativeUpdateRequest.status_approved_by              = initiativeUpdateRequest.data[0].status_approved_by;
               $scope.viewModel.initiativeUpdateRequest.status_cd                       = initiativeUpdateRequest.data[0].initiative_update_request_status_cd;
               if (initiativeUpdateRequest.data[0].approved_dt) {
                   $scope.viewModel.initiativeUpdateRequest.approved_dt                 = new Date(initiativeUpdateRequest.data[0].approved_dt);
               };
               $scope.viewModel.initiativeUpdateRequest.discussion_point_detail         = initiativeUpdateRequest.data[0].discussion_point_detail;

               $scope.viewModel.initiativeUpdateRequest.updated_by                      = initiativeUpdateRequest.data[0].updated_by;
               if (initiativeUpdateRequest.data[0].updated){                       
                   $scope.viewModel.initiativeUpdateRequest.updated                     = new Date(initiativeUpdateRequest.data[0].updated); 
               }; 
               $scope.viewModel.requireDiscussionItemCheck();
               $scope.viewModel.master = angular.copy($scope.viewModel.initiativeUpdateRequest);
              });
        };
        $scope.approve = function (initiativeUpdateRequest) {
            if (!initiativeUpdateRequest.status_approved_by || !initiativeUpdateRequest.status_dt || !initiativeUpdateRequest.percent_complete || !initiativeUpdateRequest.status || !initiativeUpdateRequest.status_submitted_by || !initiativeUpdateRequest.updated_by || (initiativeUpdateRequest.status != 'GREEN' && !initiativeUpdateRequest.discussion_point_detail)) {
                $scope.viewModel.success = null;
                $scope.viewModel.error = 'WARNING:  Complete all REQUIRED Fields';
            } else {
                BackendServiceInitiativeUpdateRequest.approveInitiativeUpdateRequest(initiativeUpdateRequest.initiative_update_request_id, initiativeUpdateRequest).then(function () {
                    var date = new Date();
                    var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                    $scope.viewModel.error = null;
                    $scope.viewModel.success = 'APPROVAL SUCCESSFUL:  ' + timeStr;
                    initializeGrid();
                });
            }
        }
    $scope.cancel = function ( initiativeUpdateRequest) {
            BackendServiceInitiativeUpdateRequest.cancelInitiativeUpdateRequest(initiativeUpdateRequest.initiative_update_request_id).then(function () {
                var date = new Date();
                var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                $scope.viewModel.error = null;
                $scope.viewModel.success = 'CANCEL SUCCESSFUL:  ' + timeStr;
                initializeGrid();
            });
        }
    $scope.submit = function(initiativeUpdateRequest) {
       if(!initiativeUpdateRequest.initiative_update_request_id){
           if (!initiativeUpdateRequest.status_dt || !initiativeUpdateRequest.percent_complete || !initiativeUpdateRequest.status || !initiativeUpdateRequest.status_submitted_by  || !initiativeUpdateRequest.updated_by ||(initiativeUpdateRequest.status != 'GREEN' && !initiativeUpdateRequest.discussion_point_detail) ){
                $scope.viewModel.success = null;
                $scope.viewModel.error = 'WARNING:  Complete all REQUIRED Fields';
            } else {
                    BackendServiceInitiativeUpdateRequest.createInitiativeUpdateRequest(initiativeUpdateRequest).then(function (result) {
                   
                        $scope.viewModel.initiative_update_request_id = result.data;
                        var date = new Date();
                        var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                        $scope.viewModel.error = null;
                        $scope.viewModel.success = 'SAVE SUCCESSFUL:  ' + timeStr;
                        initializeGrid();
                    });
                    

            };
       } else {
           //check if any changes
           if (JSON.stringify(initiativeUpdateRequest) != JSON.stringify($scope.viewModel.master)) {
                    BackendServiceInitiativeUpdateRequest.updateInitiativeUpdateRequest(initiativeUpdateRequest.initiative_update_request_id, initiativeUpdateRequest, $scope.viewModel.master);
                var date = new Date();
                var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                $scope.viewModel.error = null;
                $scope.viewModel.success = 'SAVE SUCCESSFUL:  ' + timeStr;
                initializeGrid();
           } else {
                $scope.viewModel.success = null;
                $scope.viewModel.error = 'WARNING:  No Changes made to Initiative Update Request';
           }
           
       }
       $scope.viewModel.master = angular.copy(initiativeUpdateRequest);
     };
     initializeGrid();
}]).factory('BackendServiceInitiativeUpdateRequest', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/initiative_update_request/';

      
        function getInitiativeUpdateRequest(metric_id, initiative_update_request_id) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + metric_id + '/' + initiative_update_request_id
            });

            return sendRequest(request);
        }
        function createInitiativeUpdateRequest(body) {
     
            var request = $http({
                method: 'POST',
                data: body,
                url: backendGlobalUrl
            });
     
            return sendRequest(request);
        }

        function updateInitiativeUpdateRequest(initiative_update_request_id, initiative_update_request) {
            var request = $http({
                method: 'PUT',
                data: initiative_update_request,
                url: backendGlobalUrl + initiative_update_request_id
            });
     
            return sendRequest(request);
        }

        function cancelInitiativeUpdateRequest(initiative_update_request_id) {
            var request = $http({
                method: 'DELETE',
                url: backendGlobalUrl + initiative_update_request_id
            });
            
            return sendRequest(request);
        }

        function approveInitiativeUpdateRequest(initiative_update_request_id, initiative_update_request) {
            var request = $http({
                method: 'PUT',
                data: initiative_update_request,
                url: backendGlobalUrl + 'approve/' +initiative_update_request_id
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
                getInitiativeUpdateRequest          :      getInitiativeUpdateRequest,
                createInitiativeUpdateRequest       :      createInitiativeUpdateRequest,
                updateInitiativeUpdateRequest       :      updateInitiativeUpdateRequest,
                cancelInitiativeUpdateRequest       :      cancelInitiativeUpdateRequest,
                approveInitiativeUpdateRequest      :      approveInitiativeUpdateRequest
            };
    }
]);