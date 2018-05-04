    var mysqlLib = require('../../mysqlLib');


exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var viewtype = req.params.viewtype;
        var metricid = req.params.metricid;
        var sqlback = 'ORDER BY h1.date_reported DESC';
        var sqlmiddle = '';
        
        var sqlfront =  'SELECT ? AS metric_id, h1.issue_id, h1.project, h1.area, h1.priority, h1.title, h1.status, h1.clients_reporting, h1.assigned_to, h1.reported_by, date_format(date_reported, \'%Y-%m-%d %l:%i:%s %p\') AS date_reported ' + 
                        'FROM issue_history h1  ' + 
                        'INNER JOIN (SELECT max(history_id) max_history_id ' + 
                        '            FROM issue_history ' + 
                        '            GROUP BY issue_id) h2 ' + 
                        ' ON h1.history_id = h2.max_history_id ' + 
						'INNER JOIN metrics m ' +
						' ON m.category = h1.category ' +
                        'WHERE h1.project IN ( ' +
						'  SELECT project ' +
						'  FROM metric_project_group mpg ' +
						'  WHERE mpg.metric_id = ? ' +
						'  UNION ' +
						'  SELECT project ' +
						'  FROM metrics m ' +
						'  WHERE m.metric_id = ? ' +
						'  )   ' + 
						'  AND m.metric_id = ? ' +
                        '  AND h1.Priority in (\'Highest\', \'High\', \'Medium\') ' + 
                        '  AND (h1.production_defect = 1 OR m.label LIKE \'%Smart Click Tasks%\') ' + 
                        '  AND h1.date_closed IS NULL ' +
						'  AND h1.category = m.category ' + 
						'  AND DATE_ADD(h1.date_reported, interval COALESCE(m.metrics_day_limit,0) day) <= NOW() ';
                        

        if (viewtype === 'CLIENTREPORTED_PROJECT'){
            sqlmiddle = ' AND LENGTH(h1.clients_reporting) > 0 ';
        } else if (viewtype === 'AREA'){
            sqlmiddle = ' AND h1.area = m.area ';
        }  else if (viewtype === 'CLIENTREPORTED_AREA'){
            sqlmiddle = ' AND h1.area = m.area ' + 
                        ' AND LENGTH(h1.clients_reporting) > 0 ';
        }


        var sql = sqlfront + sqlmiddle + sqlback;
        console.log("SQL : %s ", sql);
        connection.query(sql, [metricid,metricid,metricid,metricid], function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });

    });
};
