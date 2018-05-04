'use strict';


// Declare app level module which depends on filters, and services

var opsVisionApp = angular.module('opsVisionApp', [
  'opsVisionfilters',
  'ngRoute',
  'ui.grid',
  'ui.grid.resizeColumns',
  'ui.grid.exporter',
  'ui.grid.selection',
  'ui.grid.rowEdit', 
  'ui.grid.edit',
  'ui.grid.autoResize',
  'ui.grid.cellNav',
  'ngCookies',
  'smart-table',
  'tc.chartjs']);


opsVisionApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/urls', {templateUrl: '/partials/urls.html', controller: 'URLsCtrl'});
    $routeProvider.when('/channels', {templateUrl: '/partials/channels.html', controller: 'ChannelsCtrl'});
    $routeProvider.when('/channel_details/:channelid', {templateUrl: '/partials/channel_details.html', controller: 'ChannelDetailsCtrl'});
    $routeProvider.when('/broadcast_list/', {templateUrl: '/partials/broadcast_list.html', controller: 'BroadcastListCtrl'});
    $routeProvider.when('/home/:hide_nav?', {templateUrl: '/partials/home.html', controller: 'HomeCtrl'});
    $routeProvider.when('/admin/:revertadmin?', {templateUrl: '/partials/home.html', controller: 'AdminHomeCtrl'});
    $routeProvider.when('/dashboard_details/:dashboard_id/:year/:metric_id?/:summary_view?', {templateUrl: '/partials/dashboards/metric_dashboard_annual.html', controller: 'DashboardDetailsCtrl'});
    $routeProvider.when('/initiative_dashboard_details/:dashboard_id/:year/:metric_id?', {templateUrl: '/partials/dashboards/initiative_dashboard_annual.html', controller: 'DashboardDetailsCtrl'});
    $routeProvider.when('/discussion_points/', {templateUrl: '/partials/dashboards/discussion_points_list.html', controller: 'DiscussionPointsCtrl'});
    $routeProvider.when('/discussion_point_details/:metricid/:dashboardid/:month/:year', {templateUrl: '/partials/dashboards/discussion_point_details.html', controller: 'DiscussionPointDetailsCtrl'});
    $routeProvider.when('/defects/:metricid/:dashboardid/:viewtype', {templateUrl: '/partials/dashboards/defects.html', controller: 'DefectsCtrl'});          
    $routeProvider.when('/metric_details/:metricid/:dashboardid/:year', {templateUrl: '/partials/dashboards/metric_details.html', controller: 'MetricDetailsCtrl'});
    $routeProvider.when('/initiative_details/:metricid', {templateUrl: '/partials/dashboards/initiative_details.html', controller: 'InitiativeDetailCtrl'});
    $routeProvider.when('/metrics/', {templateUrl: '/partials/dashboards/metrics_list.html', controller: 'MetricsCtrl'});
    $routeProvider.when('/metric_edit/:metric_id', {templateUrl: '/partials/dashboards/metric_input.html', controller: 'MetricEditCtrl'});   
    $routeProvider.when('/metric_measurements/:metric_id/:year', {templateUrl: '/partials/dashboards/metric_measurements_input.html', controller: 'MetricMeasurementsCtrl'});   
    $routeProvider.when('/metric_meta_data/:metric_id', {templateUrl: '/partials/dashboards/metric_meta_data_input.html', controller: 'MetricMetaDataCtrl'});   
    $routeProvider.when('/discussion_point_input/:discussion_point_id?', {templateUrl: '/partials/dashboards/discussion_point_input.html', controller: 'DiscussionPointInputCtrl'});  
    $routeProvider.when('/metric_add/', {templateUrl: '/partials/dashboards/metric_input.html', controller: 'MetricEditCtrl'});    
    $routeProvider.when('/chart_line_defect/:metric_id/:tv_view?', {templateUrl: '/partials/dashboards/chartLineDefect.html', controller: 'ChartLineDefectCtrl'});    
    $routeProvider.when('/chart_stackbar_defect/:metric_id/:tv_view?', { templateUrl: '/partials/dashboards/chartStackBarDefect.html', controller: 'ChartStackBarDefectCtrl' });         
    $routeProvider.when('/product_scorecards/', { templateUrl: '/partials/dashboards/product_scorecards.html', controller: 'BlankCtrl' });       
    $routeProvider.when('/dashboards', {templateUrl: '/partials/dashboards/dashboards.html', controller: 'DashboardsCtrl'});    
    $routeProvider.when('/dashboard_config/:dashboardid', {templateUrl: '/partials/dashboards/dashboard_config.html', controller: 'DashboardConfigCtrl'}); 
    $routeProvider.when('/commitments/:metricid/:month/:year', {templateUrl: '/partials/dashboards/commitments.html', controller: 'CommitmentsCtrl'});         
    $routeProvider.when('/initiative_dashboard/:dashboard_id/:start_year/:start_month/:total_months/:metric_id?/:show_percent_complete?', { templateUrl: '/partials/dashboards/initiative_dashboard.html', controller: 'InitiativeDashboardCtrl' }); 
    $routeProvider.when('/upload_file/', {templateUrl: '/partials/file_upload.html', controller: 'FileUploadCtrl'});   
    $routeProvider.when('/roadmap_list/', {templateUrl: '/partials/roadmap_list.html', controller: 'RoadmapListCtrl'});
    $routeProvider.when('/resourceplan_list/', {templateUrl: '/partials/resourceplan_list.html', controller: 'ResourcePlanListCtrl'});
	$routeProvider.when('/initiative_update_request_list/:dashboard_id/:month/:year', { templateUrl: '/partials/dashboards/initiative_update_request_list.html', controller: 'InitiativeUpdateRequestListCtrl' });
    $routeProvider.when('/initiative_update_request/:metric_id/:initiative_update_request_id?', { templateUrl: '/partials/dashboards/initiative_update_request_input.html', controller: 'InitiativeUpdateRequestCtrl' });
    $routeProvider.when('/splitscreens/', { templateUrl: '/partials/splitscreens.html', controller: 'SplitScreensCtrl' });
    $routeProvider.when('/splitscreen_input/:channel_splitscreen_id?', { templateUrl: '/partials/splitscreen_input.html', controller: 'SplitScreenInputCtrl' });               
    $routeProvider.otherwise({ redirectTo: '/home' });
    $locationProvider.html5Mode({enabled: true,  requireBase: false});
  }]);
