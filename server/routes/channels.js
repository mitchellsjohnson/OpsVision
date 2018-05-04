var mysqlLib = require('../../mysqlLib');
/*
 * GET channels listing.
 */

exports.list = function(req, res){

  mysqlLib.getConnection(function(err,connection){
       
        var sql = 'SELECT channel_id, channel_cd, description, ' +
                  'date_format(created, \'%m/%d/%Y\') created, created_by,  if (updated,date_format(updated, \'%m/%d/%Y\'),null) updated,' +
                  'updated_by FROM channels  ' +
                  'order by greatest(created, updated) desc ';

        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};

exports.channel_dd = function (req, res) {
    
    mysqlLib.getConnection(function (err, connection) {
        
        var sql = ' SELECT channel_id, concat_ws(\' \', channel_cd, \'created by\', created_by, \'on\', date_format(created, \'%Y-%m-%d\')  ) as name ' +
                  ' FROM channels ';
        connection.query(sql, function (err, rows) {
            
            if (err)
                console.log("Error Selecting : %s ", err);
            
            res.send(rows);
           
        });
         
   
    });
  
};


/*Edit the Channel*/
exports.view = function(req, res){
    
    var id = req.params.id;
    
    mysqlLib.getConnection(function(err,connection){
        var sql = 'SELECT channel_id, channel_cd, length(channel_cd) channel_cd_length, description, ' +
                  ' length(description) description_length, active ' +
                  ' FROM channels where channel_id = ?'
        connection.query(sql,[id], function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });

    });
};

/*Save the Channel*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    mysqlLib.getConnection(function (err, connection) {
        
        var data = {
            
            channel_cd    : input.channel_cd,
            description   : input.description,
        //set created_by as the updated user on the initial insert
            created_by    : input.updated_by,
            updated_by    : input.updated_by,
            active        : 1
  
        };
        var sql = 'INSERT INTO channels set ?, updated=CURRENT_TIMESTAMP()';
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
    var id = req.params.id;
    
    mysqlLib.getConnection(function (err, connection) {
        
     
        var data = {
            
            channel_cd    : input.channel_cd,
            description   : input.description,
            updated_by    : input.updated_by,
            active        : 1
           
        
        };
        var sql = 'UPDATE channels set ?, updated=CURRENT_TIMESTAMP() WHERE channel_id = ?';
        connection.query(sql,[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          
         res.json(true);
          
        });
    
    });
};


exports.delete = function(req,res){
          
     var id = req.params.id;
     mysqlLib.getConnection(function (err, connection) {

        var sql = 'DELETE FROM channel_url_assoc WHERE channel_id = ?';
        connection.query(sql,[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
             sql = 'DELETE FROM channels WHERE channel_id = ?';
             connection.query(sql,[id], function(err, rows)
             { 
                 if(err)
                 console.log("Error deleting : %s ",err );
                res.json(true);
             });          
             
             
        });
        
     });
};
