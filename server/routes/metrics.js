var mysqlLib = require('../../mysqlLib');




exports.list     = function(req, res){

  mysqlLib.getConnection(function(err,connection){

        
        var sql = ' SELECT metric_id, metric_cd, label, definition,  project, area, threshold_green, threshold_yellow, threshold_red,        ' +
                  ' parent_metric_id, date_format(created, \'%Y-%m-%d %h:%i:%s\') as created , created_by, date_format(updated, \'%Y-%m-%d %h:%i:%s\') as updated, ' +
                  ' updated_by, date_format(metric_start_date, \'%Y-%m-%d %h:%i:%s\') as metric_start_date, type, display_type, calculation_interval ' +
                  ' FROM metrics                                                                                                            ';

        connection.query(sql,  function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });

    });
};




exports.list_dd = function(req, res){

  mysqlLib.getConnection(function(err,connection){
       
        var sql = 'SELECT metric_id , label as name  FROM metrics order by label asc ';

        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};


exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var metric_id = req.params.metric_id;
        var year = req.params.year;
        
        var sql = ' SELECT m.metric_id, m.metric_cd, m.label,                                       ' +
                  '    case (select count(*) from metrics where parent_metric_id = m.metric_id)     ' +
                  '       when  0 then \'FALSE\'                                                    ' +
                  '       ELSE \'TRUE\'                                                             ' +
                  '    END as HasChildDash,                                                         ' +
                  '    m.parent_metric_id,                                                          ' +
                  '    m.definition,                                                                ' +
                  '    m.project,                                                                   ' +
                  '    m.area,                                                                      ' +
                  '    m.display_type as display_type,                                              ' +        
                  '    m.type as type,                                                              ' +           
                  '    m.calculation_interval,                                                      ' +
                  '    m.threshold_green,                                                           ' +
                  '    m.threshold_yellow,                                                          ' +
                  '    m.threshold_red,                                                             ' +
                  '    date_format(m.created, \'%Y-%m-%d\') as created,                             ' +
                  '    m.created_by,                                                                ' +
                  '    date_format(m.updated, \'%Y-%m-%d\')  as updated,                            ' +
                  '    m.updated_by,                                                                ' +
                  '    date_format(m.metric_start_date, \'%Y-%m-%d\')  as metric_start_date         ' +
                  ' FROM metrics m                                                                  ' +                     
                          '  WHERE  m.metric_id = '  + metric_id                                    ;     
 
        connection.query(sql,function(err,rows)
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
        updated_by = 'msj';
    };     
    var metric_start_date = (new Date(input.metric_start_date)).toISOString().slice(0,10).replace(/-/g,"") ;
    var data = {
                metric_cd           :   input.metric_cd,
                label               :   input.label,
                definition          :   input.definition,
                project             :   input.project,
                area                :   input.area,
                threshold_green     :   input.threshold_green,
                threshold_yellow    :   input.threshold_yellow,
                threshold_red       :   input.threshold_red,
                parent_metric_id    :   input.parent_metric_id,
                updated_by          :   input.updated_by,
                metric_start_date   :   metric_start_date,
                type                :   input.type,
                display_type        :   input.display_type,
                calculation_interval:   input.calculation_interval,
                updated_by          :   input.updated_by,
                created_by          :   input.updated_by};

        var sql = 'INSERT INTO metrics set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()';
        connection.query(sql,[data], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.json(true);
          
        });
        
    });
};



exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var metric_id = req.params.metric_id;
    var updated_by = input.updated_by;
    if (!updated_by){
        updated_by = 'msj';
    };
    mysqlLib.getConnection(function (err, connection) {
        var metric_start_date = (new Date(input.metric_start_date)).toISOString().slice(0,10).replace(/-/g,"") ;    
        var data = {
            metric_cd           :   input.metric_cd,
            label               :   input.label,
            definition          :   input.definition,
            project             :   input.project,
            area                :   input.area,
            threshold_green     :   input.threshold_green,
            threshold_yellow    :   input.threshold_yellow,
            threshold_red       :   input.threshold_red,
            parent_metric_id    :   input.parent_metric_id,
            updated_by          :   input.updated_by,
            created_by          :   input.updated_by,
            metric_start_date   :    metric_start_date,
  
            type                :   input.type,
            display_type        :   input.display_type,
            calculation_interval:   input.calculation_interval};

        var sql = 'UPDATE metrics set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP() WHERE metric_id = ? ';
        connection.query(sql,[data,metric_id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          
         res.json(true);
          
        });
    
    });
};
