var mysqlLib = require('../../mysqlLib');
/*
 * GET Dashboard listing.
 */

exports.list = function(req, res){

  mysqlLib.getConnection(function(err,connection){
       
        var sql = ' SELECT d.dashboard_id, d.dashboard_cd, d.description, dt.dashboard_type_id, ' +
                  ' date_format(d.created, \'%m/%d/%Y\') created, d.created_by,  if (d.updated,date_format(d.updated, \'%m/%d/%Y\'),null) updated,' +
                  ' d.updated_by, d.month_default, d.year_default FROM dashboards d ' +
                  ' inner join dashboard_types dt on dt.dashboard_type_id = d.dashboard_type_id ' +
                  'order by greatest(d.created, d.updated) asc ';

        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};

/*Save the dashboard*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    mysqlLib.getConnection(function (err, connection) {
        
        var data = {
            
            dashboard_cd        : input.dashboard_cd,
            dashboard_type_id   : input.dashboard_type_id,
            description         : input.description,
        //set created_by as the updated user on the initial insert
            month_default       : input.month_default,
            year_default        : input.year_default,
            created_by          : input.updated_by,
            updated_by          : input.updated_by
  
        };
        var sql = 'INSERT INTO dashboards set ?, updated=CURRENT_TIMESTAMP()';
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
    var id = req.params.dashboard_id;
    
    mysqlLib.getConnection(function (err, connection) {
        
     
        var data = {
            
            dashboard_cd    : input.dashboard_cd,
            dashboard_type_id   : input.dashboard_type_id,
            month_default       : input.month_default,
            year_default        : input.year_default,
            description   : input.description,
            updated_by    : input.updated_by
           
        
        };
        var sql = 'UPDATE dashboards set ?, updated=CURRENT_TIMESTAMP() WHERE dashboard_id = ?';
  
        connection.query(sql,[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          
         res.json(true);
          
        });
    
    });
};


exports.delete = function(req,res){
          
     var id = req.params.dashboard_id;
     mysqlLib.getConnection(function (err, connection) {

        var sql = 'DELETE FROM dashboard_metric_assoc WHERE dashboard_id = ?';
        connection.query(sql,[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
             sql = 'DELETE FROM dashboards WHERE dashboard_id = ?';
             connection.query(sql,[id], function(err, rows)
             { 
                 if(err)
                 console.log("Error deleting : %s ",err );
                res.json(true);
             });          
             
             
        });
        
     });
};
