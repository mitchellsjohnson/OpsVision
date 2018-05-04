﻿var mysqlLib = require('../../mysqlLib');

function getChannelCode(req) {
    //TODO: add validation that name exists
    return req.params.name;
};

function getViewId(req) {
    //TODO: add validation that id exists
    return req.params.id;
};

function getPriority(req) {
    //TODO: add validation that priority exists
    return req.params.priority;
};

exports.emergency = function(req, res) {
    var channelCode = getChannelCode(req);


    mysqlLib.getConnection(function(err, connection) {
        if (err) throw err;

        var sql = 'select u.url_id, ' +
                  'case when ut.url_type_cd = \'XL_HEADER\' THEN ' + ' concat (\'' + req.app.get('xl_header_url')  + '\', u.url_id )' +
                  'else u.url_string ' +
                  'end as url_string, ' +
                  'ut.url_type_cd, cua.priority, cua.display_duration_sec ' +
                  'from channels c inner join channel_url_assoc cua on cua.channel_id = c.channel_id ' +
                  'inner join urls u on u.url_id = cua.url_id  ' +
                  'inner join url_types ut on ut.url_type_id = u.url_type_id ' +
                  'where c.channel_cd = ' + connection.escape(channelCode) +
                  ' and c.active = 1 and u.active = 1 and cua.priority = 0';
 
        connection.query(sql, function(sqlErr, rows, fields) {
            if (sqlErr) throw sqlErr;

            if (!rows || rows.length == 0) {
                res.json(null);
            } else {
                var row = rows[0];
                var viewData = {
                    channelCode: channelCode,
                    id: row.url_id,
                    type: row.url_type_id,
                    url: row.url_string,
                    priority: row.priority,
                    duration: row.display_duration_sec
                };

                res.json(viewData);
            }
        });
    });
};

exports.view = function(req, res) {
    var channelCode = getChannelCode(req);
    
    mysqlLib.getConnection(function(err, connection) {
        if (err) throw err;

        var sql = 'select u.url_id, ' +
                  'case when ut.url_type_cd = \'XL_HEADER\' THEN ' + ' concat (\'' + req.app.get('xl_header_url')  + '\', u.url_id )' +
                  'else u.url_string ' +
                  'end as url_string, ' +
                  'ut.url_type_cd, '+
                  'cua.priority, cua.display_duration_sec ' +
                  'from channels c inner join channel_url_assoc cua on cua.channel_id = c.channel_id ' +
                  'inner join urls u on u.url_id = cua.url_id  ' +
                  'inner join url_types ut on ut.url_type_id = u.url_type_id ' +
                  'where c.channel_cd = ' + connection.escape(channelCode) + 
                  ' and c.active = 1 and u.active = 1 order by cua.priority asc limit 1';       
 
        
        connection.query(sql, function(sqlErr, rows, fields) {
            if (sqlErr) throw sqlErr;

            if (!rows || rows.length == 0) {
                res.json({});
            } else {
                var row = rows[0];
                var viewData = {
                    channelCode: channelCode,
                    id: row.url_id,
                    type: row.url_type_id,
                    url: row.url_string,
                    priority: row.priority,
                    duration: row.display_duration_sec
                };

                res.render('broadcasts/view', {
                    page_title: ' OpsVision - ' + channelCode,
                    view: viewData
                });
            }
        });
    });
};

//TODO: fix sql
exports.getUrl = function(req, res) {
    var channelCode = getChannelCode(req);
    var viewId = getViewId(req);

    mysqlLib.getConnection(function(err, connection) {
        if (err) throw err;

        var sql = 'SELECT u.url_id, ut.url_type_cd, ' +
                  'case when ut.url_type_cd = \'XL_HEADER\' THEN ' + ' concat (\'' + req.app.get('xl_header_url')  + '\', u.url_id )' +
                  'else u.url_string ' +
                  'end as url_string, ' +
                  'cua.priority, cua.display_duration_sec ' +
                  'FROM channels c JOIN channel_url_assoc cua on c.channel_id = cua.channel_id ' +
                  'JOIN urls u on cua.url_id = u.url_id ' +
                  'JOIN url_types ut on ut.url_type_id = u.url_type_id ' +
                  'WHERE c.channel_cd = ' + connection.escape(channelCode) +' and u.url_id = ' + connection.escape(viewId);


        connection.query(sql, function(sqlErr, rows, fields) {
            if (sqlErr) throw sqlErr;

            if (!rows || rows.length == 0) {
                res.json({ });
            } else {
                var row = rows[0];
                res.json({ 
                    channelCode: channelCode, 
                    id: viewId, 
                    type: row.url_type_id, 
                    url: row.url_string, 
                    priority: row.priority, 
                    duration: row.display_duration_sec
                });
            }
        });
    });
};

exports.next = function(req, res) {
    var channelCode = getChannelCode(req);
    var priority = getPriority(req);

    mysqlLib.getConnection(function(err, connection) {
        if (err) throw err;

        var sql = 'select u.url_id, ' +
                  'case when ut.url_type_cd = \'XL_HEADER\' THEN ' + ' concat (\'' + req.app.get('xl_header_url')  + '\', u.url_id )' +
                  'else u.url_string ' +
                  'end as url_string, ' +
                  'ut.url_type_cd, cua.priority, cua.display_duration_sec ' +
                  'from channels c inner join channel_url_assoc cua on cua.channel_id = c.channel_id ' +
                  'inner join urls u on u.url_id = cua.url_id  ' +
                  'inner join url_types ut on ut.url_type_id = u.url_type_id ' +
                  'where c.channel_cd = ' + connection.escape(channelCode) + 
                  ' and c.active = 1 and u.active = 1 order by cua.priority asc';
        
 
        connection.query(sql, function(sqlErr, rows, fields) {
            if (sqlErr) throw sqlErr;
            
            if (!rows || rows.length == 0) {
                res.json(null);
            } else {
                var viewData = null;
                
                if (rows[0].priority === 0) {
                    var priorityRow = rows[0];
                    viewData = {
                        channelCode: channelCode,
                        id: priorityRow.url_id,
                        type: priorityRow.url_type_cd,
                        url: priorityRow.url_string,
                        priority: priorityRow.priority,
                        duration: priorityRow.display_duration_sec
                    };
                } else if (rows[rows.length - 1].priority == priority) { //fix priority to int
                    var firstRow = rows[0];
                    viewData = {
                        channelCode: channelCode,
                        id: firstRow.url_id,
                        type: firstRow.url_type_cd,
                        url: firstRow.url_string,
                        priority: firstRow.priority,
                        duration: firstRow.display_duration_sec
                    };
                }else{
                    for (var index = 0; index < rows.length; index++) {
                        var row = rows[index];  
                        if (row.priority <= priority)
                            continue;

                        viewData = {
                            channelCode: channelCode,
                            id: row.url_id,
                            type: row.url_type_cd,
                            url: row.url_string,
                            priority: row.priority,
                            duration: row.display_duration_sec
                        };
                        break;
                    }
                }
                res.json(viewData);
            }
        });
    });
};

exports.list = function(req, res) {
    mysqlLib.getConnection(function(err, connection) {
        if (err) throw err;
        
        connection.query('select channel_cd, description from channels where active = 1', function(sqlErr, rows, fields) {
            if (sqlErr) throw sqlErr;
            
            var channelList = [];
            for (var i = 0; i < rows.length; i++) {
                var channelCode = rows[i].channel_cd;
                var description = rows[i].description;

                channelList.push({ code: channelCode, description: description });
            }

            res.render('broadcasts/list', { page_title: "Channel Broadcasts", channels: channelList });
        });
    });
};