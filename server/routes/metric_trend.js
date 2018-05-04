var mysqlLib = require('../../mysqlLib');

exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var metric_id = req.params.metric_id;
        
        var sql = ' SELECT mm.id,  mm.external_id, mm.project, mm.area, mm.count, mm.threshold_green_high_normal, ' +
                  ' mm.threshold_yellow_high_normal, mm.threshold_red_high_normal, mm.measurement, mm.emergency, ' +
                  ' mm.high, mm.normal, mm.low, mm.cosmetic, mm.fix_if_time, mm.dont_fix, mm.metric_id, mm.day, mm.month, mm.year, ' +
                  ' mm.inserted_by, mm.inserted_on, m.label FROM metric_measurements mm ' +
                  ' join metrics m on mm.metric_id = m.metric_id '+
                  ' where  STR_TO_DATE(concat(mm.day, \',\', mm.month, \',\', mm.year),\'%d,%m,%Y\') > NOW() - INTERVAL 31 DAY ' +
                  '        and mm.metric_id = ' + metric_id +
                  '  order by mm.inserted_on asc';     
 
        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });

    });
};
