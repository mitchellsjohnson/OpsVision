var mysqlLib = require('../../mysqlLib');



exports.list = function (req, res) {
    
    mysqlLib.getConnection(function (err, connection) {
        var dashboard_id = req.params.dashboard_id;
        var month = req.params.month;
        var year  = req.params.year;
        var sql = ' SELECT iur.initiative_update_request_id, m.metric_id, m.label, iur.percent_complete, iur.status,                ' +
                  ' d.description as dashboardName, iur.status_month, iur.status_year,iur.status_submitted_by,                      ' +
                  ' iur.status_approved_by, iur.initiative_update_request_status_cd,                                                ' +
                  ' date_format( iur.approved_dt, \'%Y-%m-%d\') as  approved_dt,                                                    ' +
                  ' date_format( iur.created, \'%Y-%m-%d\') as  created,                                                            ' +
                  ' date_format(  iur.status_dt, \'%Y-%m-%d\') as  status_dt,                                                       ' +                                  
                  ' iur.created_by, date_format( iur.updated, \'%Y-%m-%d\') as updated,                                             ' +  
                  ' imd.technology_lead, imd.product_lead,                                                                          ' +
                  ' iur.discussion_point_detail, iur.updated_by                                                                     ' + 
                  '  FROM initiative_update_request iur                                                                             ' +
                  '       join metrics m on iur.metric_id = m.metric_id                                                             ' +
                  '       join dashboard_metric_assoc dma on dma.metric_id = m.metric_id                                            ' +
                  '       join dashboards d on d.dashboard_id = dma.dashboard_id                                                    ' +
                  '       left join initiative_meta_data imd on imd.metric_id = m.metric_id                                         ' +
                  '  WHERE  d.dashboard_id = ' + dashboard_id + ' and iur.status_month = ' + month + ' and iur.status_year = ' + year +
                  '  order by iur.initiative_update_request_status_cd desc ';
        connection.query(sql, function (err, rows) {
            
            if (err)
                console.log("Error Selecting : %s ", err);
            
            res.send(rows);
           
        });

    });
};

exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var initiative_update_request_id = req.params.initiative_update_request_id;
        if (!initiative_update_request_id || initiative_update_request_id=='undefined') {
            initiative_update_request_id = -1;
        };
        var metric_id = req.params.metric_id;

        var sql = ' SELECT iur.initiative_update_request_id, m.metric_id, m.label, iur.percent_complete, iur.status,                ' +
                  ' iur.status_dt, iur.status_month, iur.status_year,iur.status_submitted_by,                                       ' +
                  ' iur.status_approved_by, iur.initiative_update_request_status_cd,  iur.comment,                                  ' +
                  ' date_format( iur.approved_dt, \'%Y-%m-%d\') as  approved_dt,                                                    ' +
                  ' date_format( iur.created, \'%Y-%m-%d\') as  created,                                                            ' +
                  ' iur.created_by, date_format( iur.updated, \'%Y-%m-%d\') as updated,                                             ' +   
                  ' iur.discussion_point_detail, iur.updated_by                                                                     ' + 
                  '  FROM               metrics m                                                                                   ' +
                  '       left join initiative_update_request iur on iur.metric_id = m.metric_id                                    ' +
                  '                                      and iur.initiative_update_request_id = ' + initiative_update_request_id      +
                  '  WHERE  m.metric_id = ' + metric_id                                                                               ;
        connection.query(sql, function (err, rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });

    });
};


exports.save = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    mysqlLib.getConnection(function (err, connection) {
    var updated_by = input.updated_by;
    if (!updated_by){
        updated_by = 'admin';
    }; 
    var status_dt = new Date(input.status_dt)
    var status_month = status_dt.getMonth();
    status_month = status_month + 1;
    var status_year = status_dt.getFullYear();
    var approved_dt = null;   
     

    var data = {
                metric_id                               :   input.metric_id,
                percent_complete                        :   input.percent_complete,
                status                                  :   input.status.toUpperCase(),
                status_month                            :   status_month,
                status_year                             :   status_year,
                discussion_point_detail                 :   input.discussion_point_detail,
                status_submitted_by                     :   input.status_submitted_by,
                comment                                 :   input.comment,
                initiative_update_request_status_cd     :   'PENDING',
                updated_by                              :   updated_by,
                created_by                              :   updated_by};

    if (status_dt){
        data.status_dt   = (new Date(status_dt)).toISOString().slice(0,10).replace(/-/g,"");
    };
    if (input.status_approved_by) {
            data.status_approved_by = input.status_approved_by;
            approved_dt = new Date();
            data.approved_dt = (new Date(approved_dt)).toISOString().slice(0, 10).replace(/-/g, "");
            data.initiative_update_request_status_cd = 'APPROVED';
    };
   
        var sql = 'insert into initiative_update_request set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()';
        connection.query(sql,[data], function(err, rows)
        {
  
            if (err) {
                console.log("Error Inserting: %s ", err);
                res.status(500).send('ERROR:  ' + err);
            } else {
                var initiative_update_request_id = rows.insertId;
                res.json(initiative_update_request_id);
            };
          
        });
        
    });
};

exports.save_edit = function (req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    var initiative_update_request_id = req.params.initiative_update_request_id;
    mysqlLib.getConnection(function (err, connection) {
        var updated_by = input.updated_by;
        if (!updated_by) {
            updated_by = 'admin';
        };
        var status_dt = new Date(input.status_dt)
        var status_month = status_dt.getMonth();
        status_month = status_month + 1;
        var status_year = status_dt.getFullYear();
 
        
        var data = {
            metric_id                               : input.metric_id,
            percent_complete                        : input.percent_complete,
            status                                  : input.status.toUpperCase(),
            status_month                            : status_month,
            status_year                             : status_year,
            discussion_point_detail                 : input.discussion_point_detail,
            comment                                 : input.comment,
            status_submitted_by                     : input.status_submitted_by,
            initiative_update_request_status_cd     : 'PENDING',
            updated_by                              : updated_by
        };
        
        if (status_dt) {
            data.status_dt = (new Date(status_dt)).toISOString().slice(0, 10).replace(/-/g, "");
        };

        if (input.status_approved_by) {
            data.status_approved_by = input.status_approved_by;
            approved_dt = new Date();
            data.approved_dt = (new Date(approved_dt)).toISOString().slice(0, 10).replace(/-/g, "");
            data.initiative_update_request_status_cd = 'APPROVED';
        };
        
        var sql = 'update initiative_update_request set ?, updated=CURRENT_TIMESTAMP() where initiative_update_request_id = ' + initiative_update_request_id;

        connection.query(sql, [data], function (err, rows) {
            
            if (err) {
                console.log("Error Updating: %s ", err);
                res.status(500).send('ERROR:  ' + err);
            } else res.json(true);
        });
        
    });
};


exports.approve = function (req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    var initiative_update_request_id = req.params.initiative_update_request_id;
    mysqlLib.getConnection(function (err, connection) {
        var updated_by = input.updated_by;
        if (!updated_by) {
            updated_by = 'admin';
        };
        var status_dt = new Date(input.status_dt)
        var status_month = status_dt.getMonth();
        status_month = status_month + 1;
        var status_year = status_dt.getFullYear();
        var approved_dt = null;
        
        
        var data = {
            metric_id                               : input.metric_id,
            percent_complete                        : input.percent_complete,
            status                                  : input.status.toUpperCase(),
            status_month                            : status_month,
            status_year                             : status_year,
            discussion_point_detail                 : input.discussion_point_detail,
            comment                                 : input.comment,
            status_submitted_by                     : input.status_submitted_by,
            initiative_update_request_status_cd     : 'APPROVED',
            updated_by                              : updated_by,
            created_by                              : updated_by
        };
        
        if (status_dt) {
            data.status_dt = (new Date(status_dt)).toISOString().slice(0, 10).replace(/-/g, "");
        };
        if (input.status_approved_by) {
            data.status_approved_by = input.status_approved_by;
            approved_dt = new Date();
            data.approved_dt = (new Date(approved_dt)).toISOString().slice(0, 10).replace(/-/g, "");
        };
        
        var sql = 'update initiative_update_request set ?, updated=CURRENT_TIMESTAMP() where initiative_update_request_id = ' + initiative_update_request_id;
        
        connection.beginTransaction(function (err) {
            if (err) {
                console.log("Error Beginning transaction: %s ", err);
               // throw err;
                res.status(500).send('ERROR:  ' + err);
            }

            connection.query(sql, [data], function (err, rows) {
                if (err) {
                    return connection.rollback(function () {
                        //throw err;
                        console.log("ERROR %s ", err);
                        res.status(500).send('ERROR:  ' + err);
                    });
                };
                
                sql = 'select max (id) as id from metric_measurements_daily_average where metric_id = ' + input.metric_id + ' and month = ' + status_month +
                    ' and year = ' + status_year;
                connection.query(sql, function (err, rows){
                    if (err) {
                         return connection.rollback(function () {
                            //throw err;
                            console.log("ERROR %s ", err);
                            res.status(500).send('ERROR:  ' + err);
                          });
                    };
                 var data1 = {
                     value               : input.percent_complete * 10,
                     measurement         : input.status.toUpperCase(),
                     month               : status_month,
                     year                : status_year,
                     metric_id           : input.metric_id,
                     updated_by          : updated_by,
                     created_by          : updated_by
                 };
                 var mmda_id = rows[0].id;
                    if (mmda_id === null) {
                        //insert
                        sql = 'INSERT INTO metric_measurements_daily_average set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()';
                        connection.query(sql, [data1], function (err, rows) {
                            if (err) {
                                return connection.rollback(function () {
                                    //throw err;
                                    console.log("ERROR INSERTING %s ", err);
                                    res.status(500).send('ERROR INSERTING:  ' + err);
                                });
                            };
                  
                        });
                        mmda_id = rows[0].id;
                    } else {
                        //update
                        sql = 'update metric_measurements_daily_average set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP() where id = ' + mmda_id;
                        connection.query(sql, [data1], function (err, rows) {
                            if (err) {
                                return connection.rollback(function () {
                                    //throw err;
                                    console.log("ERROR UPDATING %s ", err);
                                    res.status(500).send('ERROR UPDATING:  ' + err);
                                });
                            };
                  
                        });

                    };
                    sql = 'select discussion_point_id from metric_measurements_daily_average where id = ' + mmda_id;
                    connection.query(sql, function (err, rows) {
                        if (err) {
                            return connection.rollback(function () {
                                //throw err;
                                console.log("ERROR %s ", err);
                                res.status(500).send('ERROR:  ' + err);
                            });
                        };
                        var data2 = {
                            detail              : input.discussion_point_detail,
                            updated_by          : updated_by,
                            created_by          : updated_by
                        };
             
                        var dpi = null;
                        if (rows.length > 0) {
                            dpi = rows[0].discussion_point_id;
                        };
                      
                        if ( dpi === null && input.discussion_point_detail !=null && input.discussion_point_detail != 'undefined') {
                            //insert discussion point and update measurement
                            sql = 'INSERT INTO discussion_points set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()';
                            connection.query(sql, [data2], function (err, rows) {
                                if (err) {
                                    return connection.rollback(function () {
                                        //throw err;
                                        console.log("ERROR INSERTING %s ", err);
                                        res.status(500).send('ERROR INSERTING:  ' + err);
                                    });
                                };
                                
                                dpi = rows.insertId;
                             
                                sql = 'update metric_measurements_daily_average set discussion_point_id = ' + dpi + ', updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()' +
                                  ' where id = ' + mmda_id;
                                connection.query(sql, function (err, rows) {
                                    if (err) {
                                        return connection.rollback(function () {
                                            //throw err;
                                            console.log("ERROR C %s ", err);
                                            res.status(500).send('ERROR UPDATING:  ' + err);
                                        });
                                    };
                  
                                });
                            });

                        } else if (input.discussion_point_detail != null && input.discussion_point_detail != 'undefined') {
                            //update
                            sql = 'update discussion_points set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP() where discussion_point_id = ' + dpi;
                            connection.query(sql, [data2], function (err, rows) {
                                if (err) {
                                    return connection.rollback(function () {
                                        //throw err;
                                        console.log("ERROR UPDATING %s ", err);
                                        res.status(500).send('ERROR UPDATING:  ' + err);
                                    });
                                };
                  
                            });

                        };
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                throw err;
                            });
                        }

                        res.json(true);
                    });
                });
            });
          });
        });
     });           
  };     
        
        
        
        
    
exports.cancel = function (req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    mysqlLib.getConnection(function (err, connection) {
        var updated_by = input.updated_by;
        if (!updated_by) {
            updated_by = 'admin';
        };
        
        var data = {
            initiative_update_request_status_cd     : 'CANCELLED',
            updated_by                              : updated_by
        };

    
        
        var sql = 'update initiative_update_request set ?, updated=CURRENT_TIMESTAMP()';
        connection.query(sql, [data], function (err, rows) {
            
            if (err) {
                console.log("Error Cancelling: %s ", err);
                res.status(500).send('ERROR:  ' + err);
            } else res.json(true);
        });
        
    });
};




