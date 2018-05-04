    'use strict';

/* Controllers */

var app = angular.module('opsVisionApp');


app.controller('InitiativeDetailCtrl', ['$scope', 'BackendServiceInitiativeDetail', '$q', '$http', '$cookies','$cookieStore', '$routeParams',
        function($scope, BackendServiceInitiativeDetail, $q, $http, $cookies, $cookieStore,  $routeParams) {
           
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
            $scope.viewModel.metricId = $routeParams.metric_id;

   
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
        function Noofmonths(date1, date2) {
            var Nomonths;
            Nomonths= (date2.getFullYear() - date1.getFullYear()) * 12;
            Nomonths-= date1.getMonth() + 1;
            Nomonths+= date2.getMonth();
            Nomonths+= 2;
            return Nomonths <= 0 ? 0 : Nomonths;
        }

        var startDt;
        var endDt;
        var tmpCells = [];
        var startYear;
        var startMonth;
        var totalMonths; 
        BackendServiceInitiativeDetail.getInitiativeSchedule($routeParams.metricid).then(function(initiative){
                    
                        var startDtArray = [];
                        var endDtArray = [];
                        if (initiative.data[0].plan_start !== null){
                            var planStart       = new Date(initiative.data[0].plan_start);
                            startDtArray.push(planStart);
                        }
                        if (initiative.data[0].actual_start !== null){
                            var actualStart     = new Date(initiative.data[0].actual_start);
                            startDtArray.push(actualStart);
                        }      
                        if (initiative.data[0].plan_finish !== null){
                            var planFinish      = new Date(initiative.data[0].plan_finish);
                            endDtArray.push(planFinish);
                        }
                        if (initiative.data[0].actual_finish !== null){
                            var actualFinish    = new Date(initiative.data[0].actual_finish);
                            endDtArray.push(actualFinish);
                        }                    
                        
                        if (initiative.data[0].target_finish !== null){
                             var targetFinish    = new Date(initiative.data[0].target_finish);
                            endDtArray.push(targetFinish);
                        }                    
                        
                        
                        startDt = new Date(Math.min.apply(null,startDtArray));
                        endDt = new Date(Math.max.apply(null,endDtArray));
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
  
                                startYear = parseInt(startDt.getFullYear(), 10);
                                startMonth = parseInt(startDt.getMonth()+1, 10);
                                totalMonths = parseInt(Noofmonths(startDt, endDt));
                        

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
          });

            

            


         

            BackendServiceInitiativeDetail.getInitiativeDetail( $routeParams.metricid).then(function(initiativeDetail) {     
                var prevMetricId = -1;
                for (var i = 0; i < initiativeDetail.data.length; i++) {      
                  //setup dashboard details on first iteration
                    
          
                    if (prevMetricId != initiativeDetail.data[i].metric_id){

                        if (i > 0) $scope.viewModel.metrics.push(tmpMetric);
                        var tmpMetric = {};
                        tmpMetric.metricId = initiativeDetail.data[i].metric_id;
                        tmpMetric.label = initiativeDetail.data[i].label;
                        tmpMetric.definition = initiativeDetail.data[i].definition;
                        tmpMetric.HasChildDash = initiativeDetail.data[i].HasChildDash;
                        tmpMetric.displayType = initiativeDetail.data[i].displaytype;
                        tmpMetric.calculationInterval = initiativeDetail.data[i].calculation_interval;
                        tmpMetric.ytdval = initiativeDetail.data[i].ytdval;
                        $scope.viewModel.ytdmeasure = initiativeDetail.data[i].ytdmeasure;
                        tmpMetric.ytdmeasure = initiativeDetail.data[i].ytdmeasure;
                        tmpMetric.initiativeMetaDataId = initiativeDetail.data[i].initiative_meta_data_id;
                        tmpMetric.planStart = initiativeDetail.data[i].plan_start;
                        tmpMetric.planFinish = initiativeDetail.data[i].plan_finish;
                        tmpMetric.actualStart = initiativeDetail.data[i].actual_start;
                        tmpMetric.actualFinish = initiativeDetail.data[i].actual_finish;
                        tmpMetric.targetFinish = initiativeDetail.data[i].target_finish;
                        tmpMetric.shortNote = initiativeDetail.data[i].short_note;
                        tmpMetric.dashboardId = initiativeDetail.data[i].dashboard_id;
                        tmpMetric.year = initiativeDetail.data[i].year;
                        tmpMetric.HasChildDash = initiativeDetail.data[i].HasChildDash;
                        tmpMetric.valueProposition = initiativeDetail.data[i].value_proposition;
                        tmpMetric.startYear = startYear;
                        tmpMetric.startMonth = startMonth;
                        tmpMetric.totalMonths = totalMonths;
                        tmpMetric.cells = deepCopy(tmpCells);
                        //populate the cells with holders for the dashboard date range
                        prevMetricId = initiativeDetail.data[i].metric_id;
                    };         
                    var tmpCell = {};   
                    if (initiativeDetail.data[i].discussionPointId){
                        tmpCell.discussionPointId = initiativeDetail.data[i].discussionPointId;
                    };

                    tmpCell.year=initiativeDetail.data[i].year;
                    tmpCell.month=initiativeDetail.data[i].month;
                    tmpCell.val=initiativeDetail.data[i].val;
                    tmpCell.measure=initiativeDetail.data[i].measure;
                    tmpCell.displaytype=initiativeDetail.data[i].displaytype;
            
                    //splice the metric into the date range
                    for (var j = 0; j < totalMonths; j++) { 
                         var compareDt = new Date(tmpMetric.cells[j].year, tmpMetric.cells[j].month-1, 1);
                         var evalDt = new Date(tmpCell.year, tmpCell.month-1, 1);
                         if (evalDt.getTime() === compareDt.getTime()){
                            tmpMetric.cells[j] = tmpCell; 
                         };
                    };

                    if (i == initiativeDetail.data.length-1 ){
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
    .factory('BackendServiceInitiativeDetail', ['$http', '$q',
        function($http, $q) {

            var backendGlobalUrl = '/api/initiative_details/';

            function getInitiativeDetail(metric_id) {
                var request = $http({
                    method: 'GET',
                    url: backendGlobalUrl  + metric_id
                });

                return sendRequest(request);
            }
            function getInitiativeSchedule(metric_id) {
                var request = $http({
                    method: 'GET',
                    url: backendGlobalUrl  + 'schedule/' + metric_id
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
                getInitiativeDetail: getInitiativeDetail,
                getInitiativeSchedule: getInitiativeSchedule
            };
        }
    ]);