    'use strict';

/* Controllers */

var app = angular.module('opsVisionApp');


app.controller('InitiativeDashboardCtrl', ['$scope', 'BackendServiceInitiativeDashboard', '$q', '$http', '$cookies','$cookieStore', '$routeParams',
        function($scope, BackendServiceInitiativeDashboard, $q, $http, $cookies, $cookieStore,  $routeParams) {
           
            //admin grants additional permissions in OpsVision - TODO:  Implement authentication and roles
            $scope.admin = 'FALSE';
            var isAdmin = $cookieStore.get('ADMIN');
            if (isAdmin === 'TRUE'){
               $scope.isAdmin = 'TRUE'; 
            };
            $scope.$back = function() { 
               window.history.back();
                };
            
            var formatGrey = '3px dotted grey';
            
            $scope.viewModel = {};
            $scope.viewModel.metrics = [];
            $scope.viewModel.columnHeaders = [];
            var d = new Date();
            $scope.viewModel.year = d.getFullYear();
            $scope.viewModel.current_month = d.getMonth() + 1;
            $scope.viewModel.dashboard_id = $routeParams.dashboard_id;
            $scope.viewModel.metricId = $routeParams.metric_id;
            $scope.viewModel.showPercentComplete = 'FALSE';
            if ($routeParams.show_percent_complete === "1") {
                $scope.viewModel.showPercentComplete = 'TRUE';
            }
            //create column headers array
            
            var month = new Array();
            month[0] = "Jan";
            month[1] = "Feb";
            month[2] = "Mar";
            month[3] = "Apr";
            month[4] = "May";
            month[5] = "Jun";
            month[6] = "Jul";
            month[7] = "Aug";
            month[8] = "Sep";
            month[9] = "Oct";
            month[10] = "Nov";
            month[11] = "Dec";          
  
            var startYear = parseInt($routeParams.start_year, 10);
            var startMonth = parseInt($routeParams.start_month, 10);
            var totalMonths = parseInt($routeParams.total_months, 10);
            var startDt = new Date(startYear, startMonth-1, 1);
            var endDt =  new Date(startYear, startMonth-1+totalMonths, 1);
            var tmpCells = [];
            for (var i = 0; i < totalMonths; i++) { 
                var tmpColumnHeader = {};
                var adjustMonth = startMonth+ i
                var dt = new Date(startYear, adjustMonth-1 , 1);
                var monName = month[dt.getMonth()];
                var year = dt.getFullYear();
                year = year.toString().substr(2,2);
                tmpColumnHeader.value = monName + year;
                $scope.viewModel.columnHeaders.push(tmpColumnHeader);
                var tmpRangeCell = {};
                tmpRangeCell.year = dt.getFullYear();
                tmpRangeCell.month = dt.getMonth() + 1;
                tmpRangeCell.measure = 'GRAY';
                tmpCells.push(tmpRangeCell);
            }
   
            var ARRAY_PROPS = {
              length: 'number',
              sort: 'function',
              slice: 'function',
              splice: 'function'
            };

            /**
             * Determining if something is an array in JavaScript
             * is error-prone at best.
             */
            function isArray(obj) {
              if (obj instanceof Array)
                return true;
              // Otherwise, guess:
              for (var k in ARRAY_PROPS) {
                if (!(k in obj && typeof obj[k] == ARRAY_PROPS[k]))
                  return false;
              }
              return true;
            }
            function deepCopy(obj) {
              if (typeof obj == 'object') {
                if (isArray(obj)) {
                  var l = obj.length;
                  var r = new Array(l);
                  for (var i = 0; i < l; i++) {
                    r[i] = deepCopy(obj[i]);
                  }
                  return r;
                } else {
                  var r = {};
                  r.prototype = obj.prototype;
                  for (var k in obj) {
                    r[k] = deepCopy(obj[k]);
                  }
                  return r;
                }
              }
              return obj;
            };

            BackendServiceInitiativeDashboard.getDashboardDetails($routeParams.dashboard_id, $routeParams.start_year,$routeParams.start_month, $routeParams.total_months, $routeParams.metric_id).then(function(dashboardDetails) {     
                var prevMetricId = -1;
                for (var i = 0; i < dashboardDetails.data.length; i++) {      
                  //setup dashboard details on first iteration
                    
                    if (i==0) {
                        if ($scope.viewModel.metricId)$scope.viewModel.dashboardDescription = dashboardDetails.data[i].parent_label;
                        else $scope.viewModel.dashboardDescription = dashboardDetails.data[i].dashboard_description;
                    }
                    if (prevMetricId != dashboardDetails.data[i].metric_id){

                        if (i > 0) $scope.viewModel.metrics.push(tmpMetric);
                        var tmpMetric = {};
                        tmpMetric.metricId = dashboardDetails.data[i].metric_id;
                        tmpMetric.label = dashboardDetails.data[i].label;
                        tmpMetric.definition = dashboardDetails.data[i].definition;
                        tmpMetric.HasChildDash = dashboardDetails.data[i].HasChildDash;
                        tmpMetric.displayType = dashboardDetails.data[i].displaytype;
                        tmpMetric.calculationInterval = dashboardDetails.data[i].calculation_interval;
                        tmpMetric.externalDashboard = dashboardDetails.data[i].externalDashboard;
                        tmpMetric.ytdval = dashboardDetails.data[i].ytdval;
                        tmpMetric.initiativeExternalDashboard = dashboardDetails.data[i].initiativeExternalDashboard;
                        tmpMetric.initiativeMetaDataId = dashboardDetails.data[i].initiative_meta_data_id;
                        tmpMetric.planStart = dashboardDetails.data[i].plan_start;
                        tmpMetric.planFinish = dashboardDetails.data[i].plan_finish;
                        tmpMetric.actualStart = dashboardDetails.data[i].actual_start;
                        tmpMetric.actualFinish = dashboardDetails.data[i].actual_finish;
                        tmpMetric.targetFinish = dashboardDetails.data[i].target_finish;
                        tmpMetric.shortNote = dashboardDetails.data[i].short_note;
                        tmpMetric.dashboardId = dashboardDetails.data[i].dashboard_id;
                        tmpMetric.year = dashboardDetails.data[i].year;
                        tmpMetric.HasChildDash = dashboardDetails.data[i].HasChildDash;
                        tmpMetric.startYear = $routeParams.start_year;
                        tmpMetric.startMonth = $routeParams.start_month;
                        tmpMetric.totalMonths = $routeParams.total_months;
                        tmpMetric.cells = deepCopy(tmpCells);
                        //populate the cells with holders for the dashboard date range
                        prevMetricId = dashboardDetails.data[i].metric_id;
                    };         
                    var tmpCell = {};   
                    if (dashboardDetails.data[i].discussionPointId){
                        tmpCell.discussionPointId = dashboardDetails.data[i].discussionPointId;
                    };

                    tmpCell.year=dashboardDetails.data[i].year;
                    tmpCell.month=dashboardDetails.data[i].month;
                    tmpCell.val=dashboardDetails.data[i].val;
                    tmpCell.measure=dashboardDetails.data[i].measure;
                    tmpCell.displaytype=dashboardDetails.data[i].displaytype;
            
                    //splice the metric into the date range
                    for (var j = 0; j < totalMonths; j++) { 
                         var compareDt = new Date(tmpMetric.cells[j].year, tmpMetric.cells[j].month-1, 1);
                         var evalDt = new Date(tmpCell.year, tmpCell.month-1, 1);
                         if (evalDt.getTime() === compareDt.getTime()){
                            tmpMetric.cells[j] = tmpCell; 
                         };
                    };

                    if (i == dashboardDetails.data.length-1 ){
                        //apply project management formatting...

                        $scope.viewModel.metrics.push(tmpMetric);
                        for (var k = 0; k <  $scope.viewModel.metrics.length; k++) {                  
                            for (var l = 0; l < $scope.viewModel.metrics[k].cells.length; l++) {                                      
                                  var startMonth = 0;
                                  var endMonth = 0;
                                  var psMonth = 0;
                                  var asMonth = 0;
                                  var pfMonth = 0;
                                  var afMonth = 0;
                                  var tfMonth = 0;

                                  var startYear = 0;
                                  var endYear = 0;
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
                                  var startDtArray = [];
                                  var endDtArray = [];

                                  if ($scope.viewModel.metrics[k].planStart){
                                      var ps = new Date($scope.viewModel.metrics[k].planStart);
                                      psMonth = ps.getUTCMonth() + 1;
                                      psYear = ps.getUTCFullYear() ;
                                      startDtArray.push(ps);
                                  };
                                  if ($scope.viewModel.metrics[k].actualStart){
                                      var as = new Date($scope.viewModel.metrics[k].actualStart);
                                      asMonth = as.getUTCMonth() + 1;
                                      asYear = as.getUTCFullYear() ;
                                      startDtArray.push(as);
                                  };      
                                  if ($scope.viewModel.metrics[k].planFinish){
                                      var pf = new Date($scope.viewModel.metrics[k].planFinish);
                                      pfMonth = pf.getUTCMonth() + 1;
                                      pfYear = pf.getUTCFullYear() ;
                                      endDtArray.push(pf);
                                  };
                                  if ($scope.viewModel.metrics[k].actualFinish){
                                      var af = new Date($scope.viewModel.metrics[k].actualFinish);
                                      afMonth = af.getUTCMonth() + 1;
                                      afYear = af.getUTCFullYear() ;
                                      endDtArray.push(af);
                                  };                            
                                  if ($scope.viewModel.metrics[k].targetFinish){
                                      var tf = new Date($scope.viewModel.metrics[k].targetFinish);
                                      tfMonth = tf.getUTCMonth() + 1;
                                      tfYear = tf.getUTCFullYear() ;
                                      endDtArray.push(tf);
                                  };   
                                 //figure out the exact start and end dates of the initiative
                                 var initStartDt = new Date(Math.min.apply(null,startDtArray));
                                 var initEndDt = new Date(Math.max.apply(null,endDtArray));
                                //create summary dates for start and end to compare and format the cell
                                 var initSummaryStartDt = new Date(initStartDt.getFullYear(), initStartDt.getMonth(), 1);
                                 var initSummaryEndDt = new Date(initEndDt.getFullYear(), initEndDt.getMonth(), 1);
                                 var cellDt = new Date($scope.viewModel.metrics[k].cells[l].year, $scope.viewModel.metrics[k].cells[l].month-1, 1);
                                  //set formatting

                                  if (psMonth === $scope.viewModel.metrics[k].cells[l].month && psYear === $scope.viewModel.metrics[k].cells[l].year)$scope.viewModel.metrics[k].cells[l].planStart = psTxt;
                                  if (asMonth === $scope.viewModel.metrics[k].cells[l].month && asYear === $scope.viewModel.metrics[k].cells[l].year) $scope.viewModel.metrics[k].cells[l].actualStart = asTxt;
                                  if (pfMonth === $scope.viewModel.metrics[k].cells[l].month && pfYear === $scope.viewModel.metrics[k].cells[l].year) $scope.viewModel.metrics[k].cells[l].planFinish = pfTxt;
                                  if (afMonth === $scope.viewModel.metrics[k].cells[l].month && afYear === $scope.viewModel.metrics[k].cells[l].year) $scope.viewModel.metrics[k].cells[l].actualFinish = afTxt;
                                  if (tfMonth === $scope.viewModel.metrics[k].cells[l].month && tfYear === $scope.viewModel.metrics[k].cells[l].year) $scope.viewModel.metrics[k].cells[l].targetLaunch = tfTxt;
                                
                                  if (initSummaryStartDt.getTime() == cellDt.getTime()){
                                     $scope.viewModel.metrics[k].cells[l].borderTop = formatGrey;
                                     $scope.viewModel.metrics[k].cells[l].borderBottom = formatGrey;
                                     $scope.viewModel.metrics[k].cells[l].borderLeft = formatGrey;  
                                  }
                                  if (initSummaryEndDt.getTime() == cellDt.getTime()){
                                     $scope.viewModel.metrics[k].cells[l].borderTop = formatGrey;
                                     $scope.viewModel.metrics[k].cells[l].borderBottom = formatGrey;
                                     $scope.viewModel.metrics[k].cells[l].borderRight = formatGrey;  
                                  }
                                  if (cellDt.getTime() > initSummaryStartDt.getTime() && cellDt.getTime() < initSummaryEndDt.getTime()) {
                                      $scope.viewModel.metrics[k].cells[l].borderTop = formatGrey;
                                      $scope.viewModel.metrics[k].cells[l].borderBottom = formatGrey;
                                  };
                              };
                          };
                    };
           


                };
    
            });

        }
  
    ])
    .factory('BackendServiceInitiativeDashboard', ['$http', '$q',
        function($http, $q) {

            var backendGlobalUrl = '/api/initiative_dashboard/';

            function getDashboardDetails(dashboard_id, start_year, start_month, total_months, metric_id) {
                var request = $http({
                    method: 'GET',
                    url: backendGlobalUrl + dashboard_id + '/' + start_year + '/' + start_month + '/' + total_months + '/' + metric_id
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