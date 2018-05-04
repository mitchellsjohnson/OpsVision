var mysqlLib = require('../../mysqlLib');


exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    mysqlLib.getConnection(function (err, connection) {
    var updated_by = input.updated_by;
    if (!updated_by){
        updated_by = 'msj';
    };     

        
    var data = {
                value               :   input.value,
                measurement         :   input.measurement,
                month               :   input.month,
                year                :   input.year,
                metric_id           :   input.metric_id,
                updated_by          :   updated_by,
                created_by          :   updated_by};

        var sql = 'INSERT INTO metric_measurements_daily_average set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()';
        connection.query(sql,[data], function(err, rows)
        {
  
            if(err){
                console.log("Error Inserting : %s ",err );
                res.status(500).send('ERROR:  ' + err);
            }else res.json(true);
          
        });
        
    });
};



exports.save_edit = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    mysqlLib.getConnection(function (err, connection) {
        var updated_by = input.updated_by;
        if (!updated_by){
            updated_by = 'msj';
        };     
     

        //delete row if null
        if (input.value===''){
            var sql = 'delete from metric_measurements_daily_average where id = ? ';
                connection.query(sql,[id], function(err, rows)
                  {
                      if(err){
                          console.log("Error Deleted : %s ",err );
                          res.status(500).send('ERROR:  ' + err);
                      }else res.json(true);
                  });    
         }else{
                var data = {
                            value               :   input.value,
                            measurement         :   input.measurement,
                            month               :   input.month,
                            metric_id           :   input.metric_id,
                            year                :   input.year,
                            updated_by          :   updated_by};

                    var sql = 'update metric_measurements_daily_average set ?, updated=CURRENT_TIMESTAMP() WHERE id = ? ';
                    connection.query(sql,[data, id], function(err, rows)
                    {
  
                        if(err){
                            console.log("Error Updating : %s ",err );
                            res.status(500).send('ERROR:  ' + err);
                        }else res.json(true);
          
 
                    });
            };
        
        });
};


