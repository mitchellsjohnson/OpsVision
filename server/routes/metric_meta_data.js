var mysqlLib = require('../../mysqlLib');


exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var metric_id = req.params.metric_id;
        
        var sql = ' SELECT m.metric_id, m.metric_cd, m.label,                                       ' +
                  '    imd.plan_start,                     ' + 
                  '    imd.plan_finish,                   ' +
                  '    imd.target_finish,                   ' +
                  '    imd.actual_start,                 ' + 
                  '    imd.actual_finish,               ' + 
                  '    strategic_priority,                                                          ' +
                  '    date_format(imd.created, \'%Y-%m-%d\') as created,                           ' +
                  '    imd.created_by,                                                              ' +
                  '    imd.updated,                                                                 ' +
                  '    imd.updated_by,                                                              ' +
                  '    imd.initiative_meta_data_id,                                                 ' +
                  '    imd.short_note,                                                              ' +
                  '    imd.long_note,                                                               ' +
                  '    imd.value_proposition,                                                       ' +
                  '    imd.technology_lead,                                                         ' +
                  '    imd.product_lead                                                             ' +   
                  ' FROM metrics m                                                                  ' +  
                  '      left join initiative_meta_data imd on imd.metric_id = m.metric_id          ' +
                  '  WHERE  m.metric_id = '  + metric_id                                              +
                  ' order by m.label asc                                                            ' ;     
 
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
        updated_by = 'admin';
    }; 
    var plan_start = input.plan_start;
    var plan_finish = input.plan_finish;  
    var actual_start = input.actual_start;
    var actual_finish = input.actual_finish;
    var target_finish = input.target_finish;


    var data = {
                strategic_priority  :   input.strategic_priority,
                metric_id           :   input.metric_id,
                short_note          :   input.short_note,
                long_note           :   input.long_note,
                value_proposition   :   input.value_proposition,
                technology_lead     :   input.technology_lead,
                product_lead        :   input.product_lead,
                updated_by          :   updated_by,
                created_by          :   updated_by};

    if (plan_start){
        data.plan_start     = (new Date(plan_start)).toISOString().slice(0,10).replace(/-/g,"") ;
 
    };
    if (plan_finish){
        data.plan_finish    = (new Date(plan_finish)).toISOString().slice(0,10).replace(/-/g,"") ;
 
    };
    if (target_finish){
        data.target_finish    = (new Date(target_finish)).toISOString().slice(0,10).replace(/-/g,"") ;
 
    };
    if (actual_start){
        data.actual_start    = (new Date(actual_start)).toISOString().slice(0,10).replace(/-/g,"") ;
 
    };
    if (actual_finish){
        data.actual_finish   = (new Date(actual_finish)).toISOString().slice(0,10).replace(/-/g,"") ;
    };

        var sql = 'insert into initiative_meta_data set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()';
        connection.query(sql,[data], function(err, rows)
        {
  
            if(err){
                console.log("Error Inserting: %s ",err );
                res.status(500).send('ERROR:  ' + err);
            }else res.json(true);
          
        });
        
    });
};



exports.save_edit = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var initiative_meta_data_id = req.params.initiative_meta_data_id;
    mysqlLib.getConnection(function (err, connection) {
    var updated_by = input.updated_by;
    if (!updated_by){
        updated_by = 'msj';
    };     
    var plan_start = input.plan_start;
    var plan_finish = input.plan_finish;  
    var actual_start = input.actual_start;
    var actual_finish = input.actual_finish;
    var target_finish = input.target_finish;

    var data = {
                strategic_priority  :   input.strategic_priority,
                metric_id           :   input.metric_id,
                short_note          :   input.short_note,
                long_note           :   input.long_note,
                value_proposition   : input.value_proposition,
                technology_lead     : input.technology_lead,
                product_lead        : input.product_lead,
                updated_by          :   updated_by,
                created_by          :   updated_by};

    if (plan_start){
        data.plan_start     = (new Date(plan_start)).toISOString().slice(0,10).replace(/-/g,"") ;
 
    }else {
       data.plan_start    = null; 
    };
    if (plan_finish){
        data.plan_finish    = (new Date(plan_finish)).toISOString().slice(0,10).replace(/-/g,"") ;
 
    }else {
       data.plan_finish    = null; 
    };
    if (target_finish){
        data.target_finish    = (new Date(target_finish)).toISOString().slice(0,10).replace(/-/g,"") ;
 
    }else {
       data.target_finish    = null; 
    };
    if (actual_start){
        data.actual_start    = (new Date(actual_start)).toISOString().slice(0,10).replace(/-/g,"") ;
 
    }else {
       data.actual_start    = null; 
    };
    if (actual_finish){
        data.actual_finish   = (new Date(actual_finish)).toISOString().slice(0,10).replace(/-/g,"") ;
    }else {
       data.actual_finish    = null; 
    };

        var sql = 'update initiative_meta_data set ?, updated=CURRENT_TIMESTAMP() WHERE initiative_meta_data_id = ' + initiative_meta_data_id;
        connection.query(sql,[data], function(err, rows)
        {
  
            if(err){
                console.log("Error Updating : %s ",err );
                res.status(500).send('ERROR:  ' + err);
            }else res.json(true);
          
          
        });
        
    });
};


