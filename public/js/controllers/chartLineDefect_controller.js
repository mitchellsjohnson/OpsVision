'use strict';

/* Controllers */

var app= angular.module('opsVisionApp');


app.controller('ChartLineDefectCtrl', ['$scope', 'BackendServiceMetricTrend', '$q', '$http', '$routeParams', 
    function ($scope, BackendServiceMetricTrend, $q, $http, $routeParams) {
   
	$scope.viewModel = {};
	$scope.viewModel.$back = function () {
		window.history.back();
	};
    $scope.viewModel.metric_id = $routeParams.metric_id;
    $scope.viewModel.tv_view  = false;
    var tv_view = $routeParams.tv_view;
    if( tv_view === '1'){
        $scope.viewModel.tv_view = true;
    }
 
   var data = {
        labels : [],
          datasets : [
      
            {
              label : "Green",
              fill: false,
              borderColor: "rgba(55,255,51,1)",
              data : []
            },
            {
              label : "Yellow",
              borderColor: "rgba(255,255,0,1)",
              fill: false,
              data : []
            },
            {
              label : "Red",
              borderColor: "rgba(255,0,0,1)",
              fill: false,
              data : []
            },
            {
              label : "Defect Count",
              fill: true,
              fillColor : "rgba(151,187,205,0.2)",
              data : []
            }
          ]
    };
  var labels = [];
  var count = [];
  var green = [];
  var yellow = [];
  var red = [];
  var metric_label = '';

  $scope.viewModel.mtdmeasure = 'GRAY';
  $scope.viewModel.mtdcount = 'N/A';
  BackendServiceMetricTrend.getMetricTrend($scope.viewModel.metric_id).then(function(metric_trend){
     for (var i = 0; i < metric_trend.data.length; i++) { 
          labels.push(metric_trend.data[i].month + '/' + metric_trend.data[i].day);
          count.push(metric_trend.data[i].count);
          green.push(metric_trend.data[i].threshold_green_high_normal);
          yellow.push(metric_trend.data[i].threshold_yellow_high_normal);
          red.push(metric_trend.data[i].threshold_red_high_normal);
          metric_label = metric_trend.data[i].label;
          if (i == metric_trend.data.length-1) {
            $scope.viewModel.mtdmeasure = metric_trend.data[i].measurement;
            $scope.viewModel.mtdcount = metric_trend.data[i].count;
          }
     };
      data.labels = labels;
      data.datasets[0].data = green; 
      data.datasets[1].data = yellow; 
      data.datasets[2].data = red;
      data.datasets[3].data = count;
      $scope.viewModel.metric_label = metric_label;
      $scope.viewModel.data = data;
            var line_ctx = document.getElementById('line-chart');
            var line_chart = new Chart(line_ctx,{
                type: 'line',
                data: data ,
                options: {
                    // Sets the chart to be responsive
                    responsive: true,
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [ {
                                ticks: {
                                    fontSize: 20
                                    }
                            }],
                        xAxes: [{
                                ticks: {
                                    fontSize: 20
                                }
                            }]
                    },
     
                    scaleFontStyle: "bold",
                    
                    ///Boolean - Whether grid lines are shown across the chart
                    scaleShowGridLines : true,
                    
                    //String - Colour of the grid lines
                    scaleGridLineColor : "rgba(0,0,0,.05)",
                    
                    //Number - Width of the grid lines
                    scaleGridLineWidth : 1,
                    
                    //Boolean - Whether the line is curved between points
                    bezierCurve : true,
                    
                    //Number - Tension of the bezier curve between points
                    bezierCurveTension : 0.4,
                    
                    //Boolean - Whether to show a dot for each point
                    pointDot : true,
                    
                    //Number - Radius of each point dot in pixels
                    pointDotRadius : 4,
                    
                    //Number - Pixel width of point dot stroke
                    pointDotStrokeWidth : 1,
                    
                    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                    pointHitDetectionRadius : 20,
                    
                    //Boolean - Whether to show a stroke for datasets
                    datasetStroke : true,
                    
                    //Number - Pixel width of dataset stroke
                    datasetStrokeWidth : 2,
                    
                    //Boolean - Whether to fill the dataset with a colour
                    datasetFill : true,               
                } // options
            });

  });
  
        
        




}]).factory('BackendServiceMetricTrend', ['$http', '$q',
    function($http, $q) {

    var backendGlobalUrl = '/api/metric_trend/';

      
        function getMetricTrend(metricid) {
            var request = $http({
                method: 'GET',
                url: backendGlobalUrl + metricid 
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
                getMetricTrend    :      getMetricTrend
            };
    }
]);