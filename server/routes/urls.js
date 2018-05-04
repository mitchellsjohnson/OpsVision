var mysqlLib = require('../../mysqlLib');



exports.list_dd = function(req, res){

  mysqlLib.getConnection(function(err,connection){
       
        var sql = 'SELECT u.url_id , u.description as name, ut.url_type_id  FROM urls u ' +
                  'inner join url_types ut on ut.url_type_id = u.url_type_id order by greatest(u.created, u.updated) desc ';

        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};
exports.list_type_dd = function(req, res){

  mysqlLib.getConnection(function(err,connection){
       
        var sql = 'SELECT url_type_id, url_type_cd as name ' +
                  'FROM url_types ';
        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};


exports.list = function(req, res){

  mysqlLib.getConnection(function(err,connection){
       
        var sql = 'SELECT u.url_id, u.url_string, u.description,ut.url_type_cd, ut.url_type_id, ' +
                  'date_format(u.created, \'%m/%d/%Y\') created, u.created_by,  if (u.updated,date_format(u.updated, \'%m/%d/%Y\'),null) updated,' +
                  'u.updated_by FROM urls u ' +
                  'inner join url_types ut on ut.url_type_id = u.url_type_id order by greatest(u.created, u.updated) desc ';

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
        var id = req.params.id;
        var sql = 'SELECT u.url_id, u.url_string, u.description,ut.url_type_cd, ut.url_type_id, ' +
                  'date_format(u.created, \'%m/%d/%Y\') created, u.created_by,  if (u.updated,date_format(u.updated, \'%m/%d/%Y\'),null) updated,' +
                  'u.updated_by FROM urls u ' +
                  'inner join url_types ut on ut.url_type_id = u.url_type_id ' +
                  'where url_id = ?  ';

        connection.query(sql,[id], function(err,rows)
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
        
        var data = {
            
            url_string    : input.url_string,
            url_type_id   : input.url_type_id,
            description   : input.description,
//set created_by as the updated user on the initial insert
            created_by    : input.updated_by,
            updated_by    : input.updated_by,
            active        : 1
        
        };
        var sql = 'INSERT INTO urls set ?, updated=CURRENT_TIMESTAMP()';
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
            url_string    : input.url_string,
            description   : input.description,
            updated_by    : input.updated_by,
            url_type_id   : input.url_type_id,
            active        : 1
           
        
        };
        var sql = 'UPDATE urls set ?, updated=CURRENT_TIMESTAMP() WHERE url_id = ? ';
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
        var sql = 'DELETE FROM urls WHERE url_id = ?';
        connection.query(sql,[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
      
             res.json(true);
             
        });
        
     });
};


