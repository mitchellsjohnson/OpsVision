'use strict';

/* Controllers */

var app = angular.module('opsVisionApp');


app.controller('DashboardDetailsCtrl', ['$scope', 'BackendServiceDashboardDetails', '$q', '$http', '$cookies','$cookieStore', '$routeParams',
        function($scope, BackendServiceDashboardDetails, $q, $http, $cookies, $cookieStore,  $routeParams) {
           
            //admin grants additional permissions in OpsVision - TODO:  Implement authentication and roles
            $scope.admin = 'FALSE';
            var isAdmin = $cookieStore.get('ADMIN');
            if (isAdmin === 'TRUE'){
               $scope.isAdmin = 'TRUE'; 
            };
            $scope.metrics = [];
            $scope.year = $routeParams.year;
            $scope.dashboard_id = $routeParams.dashboard_id;
            $scope.dashboard_description = '';
            $scope.metric_id = $routeParams.metric_id;
            $scope.$back = function() { 
               window.history.back();
                };
            //look to see if we want to summarize the view
            $scope.month_display = 12;
            var d = new Date();
            var currentMonth = d.getMonth() + 1;
            $scope.mr_month = d.getMonth()+1;
            $scope.summary_view = $routeParams.summary_view;
            if ( $scope.summary_view === 'MRM'){
               $scope.month_display = currentMonth -1;
            } else if ($scope.summary_view === 'MTD') {
               $scope.month_display = currentMonth;
            } else if ($scope.summary_view === 'MRMLO') {
               $scope.month_display = currentMonth -2;
            };


            
            var formatGrey = '3px dotted grey';
            
     

            BackendServiceDashboardDetails.getDashboardDetails($routeParams.dashboard_id, $routeParams.year, $routeParams.metric_id).then(function(dashboardDetails) {
                $scope.metrics = dashboardDetails.data;

                for (var i = 0; i < $scope.metrics.length; i++) {

                                  
                    //get starting and ending date for initiative formatting, if one exists
                    if (i == 0){
                        $scope.dashboard_description = $scope.metrics[i].dashboard_description;
                    };
                    
                    if ($scope.metrics[i].initiative_meta_data_id){
                        var startMonth = 0;
                        var endMonth = 0;
                        var psMonth = 0;
                        var asMonth = 0;
                        var pfMonth = 0;
                        var afMonth = 0;
                        var tfMonth = 0;

                        var psYear = 0;
                        var asYear = 0;
                        var pfYear = 0;
                        var afYear = 0;
                        var tfYear = 0;

                        var psTxt = 'Plan Start'
                        var pfTxt = 'Plan Launch';
                        var asTxt = 'Actual Start';
                        var afTxt = 'Actual Launch';
                        var tfTxt = 'Target Launch';

                        if ($scope.metrics[i].plan_start){
                            var ps = new Date($scope.metrics[i].plan_start);
                            psMonth = ps.getUTCMonth() + 1;
                            psYear = ps.getUTCFullYear();
                        };
                        if ($scope.metrics[i].actual_start){
                            var as = new Date($scope.metrics[i].actual_start);
                            asMonth = as.getUTCMonth() + 1;
                            asYear = as.getUTCFullYear();
                        };      
                        startMonth = Math.max(psMonth, asMonth);

                        if ($scope.metrics[i].plan_finish){
                            var pf = new Date($scope.metrics[i].plan_finish);
                            pfMonth = pf.getUTCMonth() + 1;
                            pfYear = pf.getUTCFullYear();
                        };
                        if ($scope.metrics[i].actual_finish){
                            var af = new Date($scope.metrics[i].actual_finish);
                            afMonth = af.getUTCMonth() + 1;
                            afYear = af.getUTCFullYear();
                        };                            
                        if ($scope.metrics[i].target_finish){
                            var tf = new Date($scope.metrics[i].target_finish);
                            tfMonth = tf.getUTCMonth() + 1;
                            tfYear = tf.getUTCFullYear();
                        };   
                        if ( afMonth > 0){
                            endMonth = afMonth;
                        } else if (tfMonth > 0){
                            endMonth = tfMonth;
                        } else endMonth = pfMonth;      
                        
                        //set formatting
                        for (var j = 1; j < 13; j++) {
                            if (j === 1) {
                                    console.log(tfYear);
                                    console.log($routeParams.year);
                                    if (tfYear == $routeParams.year) console.log('happy');
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].janPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].janActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].janPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].janActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].janTargetLaunch = tfTxt;  
                                if (startMonth === j){
                                    $scope.metrics[i].janBorderTop = formatGrey;
                                    $scope.metrics[i].janBorderBottom = formatGrey;
                                    $scope.metrics[i].janBorderLeft = formatGrey;   
                                };
                                 if (endMonth === j){
                                    $scope.metrics[i].janBorderTop = formatGrey;
                                    $scope.metrics[i].janBorderBottom = formatGrey;
                                    $scope.metrics[i].janBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].janBorderTop = formatGrey;
                                    $scope.metrics[i].janBorderBottom = formatGrey;
                                };
                            };
                            if (j === 2) {
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].febPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].febActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].febPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].febActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].febTargetLaunch = tfTxt; 
                                if (startMonth === j){
                                    $scope.metrics[i].febBorderTop = formatGrey;
                                    $scope.metrics[i].febBorderBottom = formatGrey;
                                    $scope.metrics[i].febBorderLeft = formatGrey;   
                                };
                                 if (endMonth === j){
                                    $scope.metrics[i].febBorderTop = formatGrey;
                                    $scope.metrics[i].febBorderBottom = formatGrey;
                                    $scope.metrics[i].febBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].febBorderTop = formatGrey;
                                    $scope.metrics[i].febBorderBottom = formatGrey;
                                };
                            };
                            if (j === 3) {
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].marPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].marActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].marPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].marActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].marTargetLaunch = tfTxt; 
                                if (startMonth === j){
                                    $scope.metrics[i].marBorderTop = formatGrey;
                                    $scope.metrics[i].marBorderBottom = formatGrey;
                                    $scope.metrics[i].marBorderLeft = formatGrey;   
                                };
                                 if (endMonth === j){
                                    $scope.metrics[i].marBorderTop = formatGrey;
                                    $scope.metrics[i].marBorderBottom = formatGrey;
                                    $scope.metrics[i].marBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].marBorderTop = formatGrey;
                                    $scope.metrics[i].marBorderBottom = formatGrey;
                                };
                            };
                            if (j === 4) {
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].aprPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].aprActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].aprPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].aprActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].aprTargetLaunch = tfTxt; 
                                if (startMonth === j){
                                    $scope.metrics[i].aprBorderTop = formatGrey;
                                    $scope.metrics[i].aprBorderBottom = formatGrey;
                                    $scope.metrics[i].aprBorderLeft = formatGrey;   
                                };
                                 if (endMonth === j){
                                    $scope.metrics[i].aprBorderTop = formatGrey;
                                    $scope.metrics[i].aprBorderBottom = formatGrey;
                                    $scope.metrics[i].aprBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].aprBorderTop = formatGrey;
                                    $scope.metrics[i].aprBorderBottom = formatGrey;
                                };
                            };
                            if (j === 5) {
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].mayPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].mayActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].mayPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].mayActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].mayTargetLaunch = tfTxt; 
                                if (startMonth === j){
                                    $scope.metrics[i].mayBorderTop = formatGrey;
                                    $scope.metrics[i].mayBorderBottom = formatGrey;
                                    $scope.metrics[i].mayBorderLeft = formatGrey;   
                                };
                                 if (endMonth === j){
                                    $scope.metrics[i].mayBorderTop = formatGrey;
                                    $scope.metrics[i].mayBorderBottom = formatGrey;
                                    $scope.metrics[i].mayBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].mayBorderTop = formatGrey;
                                    $scope.metrics[i].mayBorderBottom = formatGrey;
                                };
                            };
                            if (j === 6) {
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].junPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].junActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].junPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].junActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].junTargetLaunch = tfTxt; 
                                if (startMonth === j){
                                    $scope.metrics[i].junBorderTop = formatGrey;
                                    $scope.metrics[i].junBorderBottom = formatGrey;
                                    $scope.metrics[i].junBorderLeft = formatGrey;   
                                };
                                 if (endMonth === j){
                                    $scope.metrics[i].junBorderTop = formatGrey;
                                    $scope.metrics[i].junBorderBottom = formatGrey;
                                    $scope.metrics[i].junBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].junBorderTop = formatGrey;
                                    $scope.metrics[i].junBorderBottom = formatGrey;
                                };
                            };
                            if (j === 7) {
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].julPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].julActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].julPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].julActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].julTargetLaunch = tfTxt; 
                                if (startMonth === j){
                                    $scope.metrics[i].julBorderTop = formatGrey;
                                    $scope.metrics[i].julBorderBottom = formatGrey;
                                    $scope.metrics[i].julBorderLeft = formatGrey;   
                                };
                                 if (endMonth === j){
                                    $scope.metrics[i].julBorderTop = formatGrey;
                                    $scope.metrics[i].julBorderBottom = formatGrey;
                                    $scope.metrics[i].julBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].julBorderTop = formatGrey;
                                    $scope.metrics[i].julBorderBottom = formatGrey;
                                };
                            };
                            if (j === 8) {
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].augPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].augActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].augPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].augActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].augTargetLaunch = tfTxt; 
                                if (startMonth === j){
                                    $scope.metrics[i].augBorderTop = formatGrey;
                                    $scope.metrics[i].augBorderBottom = formatGrey;
                                    $scope.metrics[i].augBorderLeft = formatGrey;   
                                };
                                 if (endMonth === j){
                                    $scope.metrics[i].augBorderTop = formatGrey;
                                    $scope.metrics[i].augBorderBottom = formatGrey;
                                    $scope.metrics[i].augBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].augBorderTop = formatGrey;
                                    $scope.metrics[i].augBorderBottom = formatGrey;
                                };
                            };
                            if (j === 9) {
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].sepPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].sepActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].sepPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].sepActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].sepTargetLaunch = tfTxt; 
                                if (startMonth === j){
                                    $scope.metrics[i].sepBorderTop = formatGrey;
                                    $scope.metrics[i].sepBorderBottom = formatGrey;
                                    $scope.metrics[i].sepBorderLeft = formatGrey;   
                                };
                                 if (endMonth === j){
                                    $scope.metrics[i].sepBorderTop = formatGrey;
                                    $scope.metrics[i].sepBorderBottom = formatGrey;
                                    $scope.metrics[i].sepBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].sepBorderTop = formatGrey;
                                    $scope.metrics[i].sepBorderBottom = formatGrey;
                                };
                            };
                            if (j === 10) {
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].octPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].octActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].octPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].octActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].octTargetLaunch = tfTxt; 
                                if (startMonth === j){
                                    $scope.metrics[i].octBorderTop = formatGrey;
                                    $scope.metrics[i].octBorderBottom = formatGrey;
                                    $scope.metrics[i].octBorderLeft = formatGrey;   
                                };
                                 if (endMonth === j){
                                    $scope.metrics[i].octBorderTop = formatGrey;
                                    $scope.metrics[i].octBorderBottom = formatGrey;
                                    $scope.metrics[i].octBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].octBorderTop = formatGrey;
                                    $scope.metrics[i].octBorderBottom = formatGrey;
                                };
                            };
                            if (j === 11) {
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].novPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].novActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].novPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].novActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].novTargetLaunch = tfTxt; 
                                if (startMonth === j){
                                    $scope.metrics[i].novBorderTop = formatGrey;
                                    $scope.metrics[i].novBorderBottom = formatGrey;
                                    $scope.metrics[i].novBorderLeft = formatGrey;   
                                };
                                 if (endMonth === j){
                                    $scope.metrics[i].novBorderTop = formatGrey;
                                    $scope.metrics[i].novBorderBottom = formatGrey;
                                    $scope.metrics[i].novBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].novBorderTop = formatGrey;
                                    $scope.metrics[i].novBorderBottom = formatGrey;
                                };
                            };
                            if (j === 12) {
                                if (psMonth === j && psYear == $scope.year) $scope.metrics[i].decPlanStart = psTxt;
                                if (asMonth === j && asYear == $scope.year) $scope.metrics[i].decActualStart = asTxt;
                                if (pfMonth === j && pfYear == $scope.year) $scope.metrics[i].decPlanLaunch = pfTxt;
                                if (afMonth === j && afYear == $scope.year) $scope.metrics[i].decActualLaunch = afTxt;
                                if (tfMonth === j && tfYear == $scope.year) $scope.metrics[i].decTargetLaunch = tfTxt; 
                                if (startMonth === j){
                                    $scope.metrics[i].decBorderTop = formatGrey;
                                    $scope.metrics[i].decBorderBottom = formatGrey;
                                    $scope.metrics[i].decBorderLeft = formatGrey;   
                                };
                                if (endMonth === j){
                                    $scope.metrics[i].decBorderTop = formatGrey;
                                    $scope.metrics[i].decBorderBottom = formatGrey;
                                    $scope.metrics[i].decBorderRight = formatGrey;
                                };
                                if (j > startMonth && j < endMonth && startMonth > 0) {
                                    $scope.metrics[i].decBorderTop = formatGrey;
                                    $scope.metrics[i].decBorderBottom = formatGrey;
                                };
                            };                          
                        };
                                        
                    };


                };


            });

        }
  
    ])
    .factory('BackendServiceDashboardDetails', ['$http', '$q',
        function($http, $q) {

            var backendGlobalUrl = '/api/dashboard_details/';

            function getDashboardDetails(dashboard_id, year, metric_id) {
                var request = $http({
                    method: 'GET',
                    url: backendGlobalUrl + dashboard_id + '/' + year + '/' + metric_id
                });

                return sendRequest(request);
            }

            function sendRequest(config) {

                var deferred = $q.defer();

                config.then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
            return {
                getDashboardDetails: getDashboardDetails
            };
        }
    ]);