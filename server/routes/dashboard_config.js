var mysqlLib = require('../../mysqlLib');




exports.list_dd = function(req, res){

  mysqlLib.getConnection(function(err,connection){
       
        var sql = 'SELECT dashboard_type_id, description as name  FROM  dashboard_types  order by dashboard_type_id asc';

        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};


/*
 * GET dashboard details 
 */

exports.view = function(req, res){
  var dashboard_id = req.params.dashboard_id;
  mysqlLib.getConnection(function(err,connection){
        var sql = 'SELECT  dma.id, d.dashboard_id, d.dashboard_cd, m.metric_id, m.definition, ' + 
                  '        date_format(dma.created, \'%m/%d/%Y\') as created, dma.created_by,  ' +
                  '        date_format(dma.updated, \'%m/%d/%Y\') as updated, dma.updated_by,  ' +
                  '        dma.sequence ' +
                  'FROM dashboards d ' +
                  '        LEFT join dashboard_metric_assoc dma on dma.dashboard_id = d.dashboard_id ' +
                  '        LEFT join metrics m on m.metric_id = dma.metric_id' +
                  '        LEFT join dashboard_types dt on dt.dashboard_type_id = d.dashboard_type_id ' +
                  'WHERE   d.dashboard_id = ? ' +
                  '        order by dma.sequence asc';


        connection.query(sql,[dashboard_id], function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};



/*Save the Dashboard*/
exports.save = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    
    mysqlLib.getConnection(function (err, connection) {
        
        var data = {
            dashboard_id              : input.dashboard_id,
            metric_id                  : input.metric_id,
            sequence                : input.sequence,
            created_by              : input.updated_by,
            updated_by              : input.updated_by
        
        };
        var sql = 'INSERT INTO dashboard_metric_assoc set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()';
        connection.query(sql,[data], function(err, rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};


/*Edit the Dashboard*/
exports.save_edit = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

     
    mysqlLib.getConnection(function (err, connection) {
        
        var data = {
            metric_id                  : input.metric_id,
            sequence                   : input.sequence,
            updated_by                 : input.updated_by
        
        };
        var sql = 'update dashboard_metric_assoc set ?, updated=CURRENT_TIMESTAMP() where id = ?';
        connection.query(sql,[data,id], function(err, rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};


exports.delete_row = function(req,res){
          
     var id = req.params.id;
     mysqlLib.getConnection(function (err, connection) {
        var sql = 'DELETE FROM dashboard_metric_assoc WHERE id = ?';
        
        connection.query(sql,[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
      
             res.json(true);
             
        });
        
     });
};

exports.delete_all = function(req,res){
          
     var dashboard_id = req.params.dashboard_id;
     mysqlLib.getConnection(function (err, connection) {
        var sql = 'DELETE FROM dashboard_metric_assoc WHERE dashboard_id = ?';
        
        connection.query(sql,[dashboard_id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
      
             res.json(true);
             
        });
        
     });
};
