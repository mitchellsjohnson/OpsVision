var mysqlLib = require('../../mysqlLib');


exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var metric_id = req.params.metric_id;
        var year = req.params.year;
        
       var sql = ' SELECT ' + year + ' as year, m.metric_id, m.metric_cd, m.label, date_format( m.created, \'%Y-%m-%d %h:%i:%s\') as created,   ' + 
                 ' m.created_by, mmda.updated_by as mtd_updated_by, date_format(mmda.updated, \'%Y-%m-%d %h:%i:%s\') as mtd_updated,            ' +  
                 ' mmda.id as mtd_id, mmda.value as mtd_value, mmda.measurement as mtd_measurement, mmda.month as mtd_month,                    ' +
                 ' mmya.id as ytd_id, mmya.value as ytd_value, mmya.measurement as ytd_measurement,                                             ' +
                 ' mmya.updated_by as ytd_updated_by, date_format(mmya.updated, \'%Y-%m-%d %h:%i:%s\') as ytd_updated,                           ' +
                 ' mmda.discussion_point_id as mtd_discussion_point_id                                                                                                   ' +
                 ' FROM metrics m                                                                                                               ' +
                 ' left join metric_measurements_daily_average mmda on mmda.metric_id = m.metric_id and mmda.year =                             ' + year +
                 ' left join metric_measurements_ytd_average mmya on mmya.metric_id = m.metric_id and mmya.year =                               ' + year +
                 ' where m.metric_id = ? ';

        connection.query(sql, [metric_id], function(err,rows)
        {

            if(err){
                console.log("Error Selecting : %s ",err );
                res.status(500).send('ERROR:  ' + err);
            }else res.send(rows);
           
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