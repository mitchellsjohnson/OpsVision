var mysqlLib = require('../../mysqlLib');


exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var metricid = req.params.metricid;
        var month = req.params.month;
        var year = req.params.year;
        
       var sql = ' SELECT m.metric_id, m.metric_cd, m.label, m.definition,  m.project, m.area, m.threshold_green, m.threshold_yellow, m.threshold_red,                                     ' +
       ' m.parent_metric_id,date_format( m.created, \'%Y-%m-%d %h:%i:%s\') as created,  m.created_by, m.updated_by, date_format(m.updated, \'%Y-%m-%d %h:%i:%s\') as updated, display_type, m.type,  ' +
       ' date_format(m.metric_start_date, \'%Y-%m-%d %h:%i:%s\') as metric_start_date, m.type, m.calculation_interval,                                                                                         ' +
       ' (select mmya.value from metric_measurements_ytd_average mmya where mmya.metric_id = m.metric_id and year = ' + year + ' ) as metric_value_ytd,                                                ' +
       ' (select mmya.measurement from metric_measurements_ytd_average mmya where mmya.metric_id = m.metric_id and year = ' + year + ' ) as metric_measurement_ytd,                       ' +
       ' (select mmda.value from metric_measurements_daily_average mmda where mmda.metric_id = m.metric_id and year =  ' + year + ' and month =  ' + month + ') as metric_value_mtd,      ' +
       ' (select mmda.measurement from metric_measurements_daily_average mmda where mmda.metric_id = m.metric_id and year = ' + year + ' and month =  ' + month + ') as metric_measurement_mtd ,                ' +  
       ' (select dp.detail from metric_measurements_daily_average mmda left join discussion_points dp on mmda.discussion_point_id = dp.discussion_point_id  where mmda.metric_id = m.metric_id and mmda.year = ' + year + ' and mmda.month =  ' + month + ') as discussion_point_detail, ' +  
       ' (select dp.created_by from metric_measurements_daily_average mmda left join discussion_points dp on mmda.discussion_point_id = dp.discussion_point_id  where mmda.metric_id = m.metric_id and mmda.year = ' + year + ' and mmda.month =  ' + month + ') as discussion_point_created_by, ' +   
       ' imd.value_proposition, ' +
       ' (select DATE_FORMAT(max(inserted_on),\'%W, %M %e, %Y @ %h:%i %p\')  from  issue_history) as LastUpdatedProdDefectDt, ' +
       ' (select DATE_FORMAT(max(inserted_on),\'%W, %M %e, %Y @ %h:%i %p\')  from  commitment_results) as LastUpdatedProdCommitDt, ' +
       ' (SELECT count FROM metric_measurements where metric_id = ' + metricid + ' order by inserted_on desc limit 1) as metricCountToday, ' +
       ' (SELECT count FROM metric_measurements where metric_id = ' + metricid + ' order by inserted_on desc limit 1 offset 1) as metricCountYest ' +
       ' FROM metrics m   ' +
       ' left join initiative_meta_data imd on imd.metric_id = m.metric_id ' +
       ' where m.metric_id = ? ';

        connection.query(sql, [metricid], function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });

    });
};




exports.list_dd = function(req, res){

  mysqlLib.getConnection(function(err,connection){
       
        var sql = 'SELECT metric_id , label as name  FROM metrics ';

        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};