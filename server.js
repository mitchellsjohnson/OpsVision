
/**
 * Module dependencies
 */


var express = require('express'),
   routes = require('./server/routes/default'),
   urls = require('./server/routes/urls'); 
   roadmaps = require('./server/routes/roadmaps'); 
   resourceplans = require('./server/routes/resourceplans');    

   channels = require('./server/routes/channels'); 
   broadcasts = require('./server/routes/broadcasts'); 
   lrgheader = require('./server/routes/lrgheader'); 
   channel_details = require('./server/routes/channel_details'); 
   dashboard_details = require('./server/routes/dashboard_details'); 
   initiative_dashboard = require('./server/routes/initiative_dashboard'); 
   initiative_details = require('./server/routes/initiative_details'); 

   dashboards = require('./server/routes/dashboards'); 
   dashboard_config = require('./server/routes/dashboard_config'); 

   discussion_points = require('./server/routes/discussion_points'); 
   defects = require('./server/routes/defects'); 
   commitments = require('./server/routes/commitments'); 
   metric_details = require('./server/routes/metric_details');
   metrics = require('./server/routes/metrics'); 
   metric_measurements = require('./server/routes/metric_measurements'); 
   metric_mtd_measurement = require('./server/routes/metric_mtd_measurement'); 
   metric_ytd_measurement = require('./server/routes/metric_ytd_measurement'); 
   metric_meta_data = require('./server/routes/metric_meta_data'); 
   metric_trend = require('./server/routes/metric_trend'); 
   initiative_update_request = require('./server/routes/initiative_update_request');
   split_screens = require('./server/routes/channel_split_screens');
   split_screen_broadcast = require('./server/routes/channel_split_screen_broadcast');



   path = require('path'),
   favicon = require('static-favicon'),
   logger = require('morgan'),
   cookieParser = require('cookie-parser'),
   bodyParser = require('body-parser'),
   expressBlocks = require('express-blocks'),
   CONFIG = require('nconf'),
   mysqlLib = require('./mysqlLib'),  //TODO REMOVE
   cluster = require("cluster"),
   http = require("http");


CONFIG.argv().env();

//setup express
var app = express();

//setup config loading
if (app.get('env') === 'production') {
    CONFIG.file('config/production.json');
} else if (app.get('env') === 'development') {
    CONFIG.file('config/development.json');
}

//configure the mysql library
mysqlLib.configure(CONFIG.get('database'));  

/**
* Configuration
*/

// all environments



// view engine setup - use for broadcasts only, Angular for all core UI
app.engine('.ov', require('ejs').__express);
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ov');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
 
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


// Routes - API

//URL Maintenance Operations 

app.get('/api/urls_dd', urls.list_dd);
app.get('/api/urltype_dd', urls.list_type_dd);  
app.get('/api/urls', urls.list);
app.get('/api/urls/:id', urls.view);
app.post('/api/urls', urls.save);
app.put('/api/urls/:id', urls.save_edit);
app.delete('/api/urls/:id', urls.delete);

//Resource Plan and Roadmap Operations
app.get('/api/roadmaps', roadmaps.list);
app.get('/api/resourceplans', resourceplans.list);

//Channel Maintenance Operations 


app.get('/api/channels/', channels.list);  
app.post('/api/channels', channels.save);
app.put('/api/channels/:id', channels.save_edit);
app.delete('/api/channels/:id', channels.delete);


//Channel Details Maintenance Operations 

app.get('/api/channel_details/:channelid', channel_details.view);  
app.post('/api/channel_details', channel_details.save);
app.put('/api/channel_details/:id/:urlid', channel_details.save_edit);
app.delete('/api/channel_details/:id', channel_details.delete_row);
app.delete('/api/channel_details/:channelid', channel_details.delete_all);

//Main Broadcast Operations

app.get('/broadcasts', broadcasts.list);
app.get('/broadcasts/:name', broadcasts.view);
app.get('/broadcasts/:name/emergency', broadcasts.emergency);
app.get('/broadcasts/:name/:id', broadcasts.getUrl);
app.get('/broadcasts/:name/:priority/next', broadcasts.next);

app.get('/lrgheader/:id', lrgheader.view);

//Splitscreen Broadcast
app.get('/split_screen_broadcast/:channel_split_screen_id', split_screen_broadcast.view);

//Dashboard Presentation
app.get('/api/dashboard_details/:id/:year/:metric_id?', dashboard_details.view);


//Dashboard Presentation
app.get('/api/initiative_dashboard/:dashboard_id/:start_year/:start_month/:total_months/:metric_id?', initiative_dashboard.view);


app.get('/api/initiative_details/:metric_id', initiative_details.view);
app.get('/api/initiative_details/schedule/:metric_id', initiative_details.view_schedule);

app.get('/api/commitments/:metricid/:month/:year', commitments.view);
app.get('/api/defects/:metricid/:viewtype', defects.view);
app.get('/api/metric_details/:metricid/:month/:year', metric_details.view);
app.get('/api/metrics_dd/', metrics.list_dd);


//Dashboard Administration
app.get('/api/dashboards/', dashboards.list);
app.post('/api/dashboards/', dashboards.save);
app.put('/api/dashboards/:dashboard_id', dashboards.save_edit);
app.delete('/api/dashboards/:dashboard_id', dashboards.delete);

app.get('/api/dashboard_config/:dashboard_id', dashboard_config.view);  
app.post('/api/dashboard_config', dashboard_config.save);
app.put('/api/dashboard_config/:id', dashboard_config.save_edit);
app.delete('/api/dashboard_config/:id', dashboard_config.delete_row);
app.delete('/api/dashboard_config/:dashboard_id', dashboard_config.delete_all);
app.get('/api/dashboard_type_dd/', dashboard_config.list_dd);



//Metrics Maintenance
app.get('/api/metrics/', metrics.list);
app.get('/api/metrics/:metric_id', metrics.view);
app.post('/api/metrics/', metrics.save);
app.put('/api/metrics/:metric_id', metrics.save_edit);

//Metric Measurements
app.get('/api/metric_measurements/:metric_id/:year', metric_measurements.view);

app.post('/api/metric_mtd_measurements/', metric_mtd_measurement.save);
app.put('/api/metric_mtd_measurements/:id', metric_mtd_measurement.save_edit);
app.post('/api/metric_ytd_measurements/', metric_ytd_measurement.save);
app.put('/api/metric_ytd_measurements/:id', metric_ytd_measurement.save_edit);

//Metric Metadata
app.get('/api/metric_meta_data/:metric_id', metric_meta_data.view);
app.post('/api/metric_meta_data/', metric_meta_data.save);
app.put('/api/metric_meta_data/:initiative_meta_data_id', metric_meta_data.save_edit);


//Metric Trend
app.get('/api/metric_trend/:metric_id', metric_trend.view);

//Discussion Points 
app.get('/api/discussion_points/:discussion_point_id', discussion_points.view);  
app.get('/api/discussion_points', discussion_points.list);  
app.post('/api/discussion_points', discussion_points.save);
app.put('/api/discussion_points/:discussion_point_id', discussion_points.save_edit);
app.put('/api/discussion_points/detach/:discussion_point_id', discussion_points.detach);
app.delete('/api/discussion_points/:discussion_point_id', discussion_points.delete);

//initiative update requests
app.get('/api/initiative_update_request/:metric_id/:initiative_update_request_id?', initiative_update_request.view);
app.put('/api/initiative_update_request/:initiative_update_request_id', initiative_update_request.save_edit);
app.post('/api/initiative_update_request/', initiative_update_request.save);
app.delete('/api/initiative_update_request/:initiative_update_request_id', initiative_update_request.cancel);
app.put('/api/initiative_update_request/approve/:initiative_update_request_id', initiative_update_request.approve);
app.get('/api/initiative_update_request/list/:dashboard_id/:month/:year', initiative_update_request.list);

//Splitscreens 
app.get('/api/split_screens/', split_screens.list);
app.get('/api/split_screens/:channel_split_screen_id', split_screens.view);
app.post('/api/split_screens/', split_screens.save);
app.put('/api/split_screens/:channel_split_screen_id', split_screens.save_edit);
app.delete('/api/split_screens/:channel_split_screen_id', split_screens.delete);
app.get('/api/channel_dd/', channels.channel_dd);



// redirect all others to the index (HTML5 history)
app.get('*',function(req,res){
  res.sendfile('public/index.html');
});

/**
* Start Server
*/
var port = process.env.PORT || CONFIG.get('node').port;

//xl_header template setup - use in routes if you want to add a large header

//app.set('xl_header_url', 'http://localhost:' + port + '/lrgheader/');

app.set('xl_header_url', '/lrgheader/');

http.createServer(app).listen(port, function () {
  console.log('Express server listening on port ' + port);
});