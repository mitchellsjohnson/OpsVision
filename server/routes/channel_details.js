var mysqlLib = require('../../mysqlLib');
/*
 * GET channels listing.
 */

exports.view = function(req, res){
  var channel_id = req.params.channelid;
  mysqlLib.getConnection(function(err,connection){
        var sql = 'SELECT  cua.id, c.channel_id, c.channel_cd, u.url_id, u.url_string, u.description,ut.url_type_cd, ' + 
                  '        date_format(cua.created, \'%m/%d/%Y\') as created, cua.created_by,  ' +
                  '        date_format(cua.updated, \'%m/%d/%Y\') as updated, cua.updated_by,  ' +
                  '        cua.priority, cua.display_duration_sec ' +
                  'FROM channels c ' +
                  '        LEFT join channel_url_assoc cua on cua.channel_id = c.channel_id ' +
                  '        LEFT join urls u on u.url_id = cua.url_id and u.active = 1' +
                  '        LEFT join url_types ut on ut.url_type_id = u.url_type_id ' +
                  'WHERE   c.channel_id = ?  and u.url_id is not null' +
                  '        order by priority asc';


        connection.query(sql,[channel_id], function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};

exports.addform = function(req, res){
  var channel_id = req.params.channelid;
  mysqlLib.getConnection(function(err,connection){
        var sql = 'SELECT  ' + channel_id + ' as channel_id, u.url_id, u.description ' + 
                  'FROM urls u ' +
                  'WHERE u.active = 1 ' +
                  '        order by url_id desc';

        connection.query(sql,function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
      
            res.render('channels_urls/add_channel_url',{page_title:"Map URL to Channel - CommandCenter",data:rows});
                
           
         });

    });



  
};


/*Save the Channel*/
exports.save = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    
    mysqlLib.getConnection(function (err, connection) {
        
        var data = {
            channel_id              : input.channel_id,
            url_id                  : input.url_id,
            priority                : input.priority,
            display_duration_sec    : input.display_duration_sec,
            created_by              : input.updated_by,
            updated_by              : input.updated_by
        
        };
        var sql = 'INSERT INTO channel_url_assoc set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()';
        connection.query(sql,[data], function(err, rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};


/*Save the Channel*/
exports.save_edit = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

     
    mysqlLib.getConnection(function (err, connection) {
        
        var data = {
            url_id                  : req.params.urlid,
            priority                : input.priority,
            display_duration_sec    : input.display_duration_sec,
            updated_by              : input.updated_by
        
        };
        var sql = 'update channel_url_assoc set ?, updated=CURRENT_TIMESTAMP() where id = ?';
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
        var sql = 'DELETE FROM channel_url_assoc WHERE id = ?';
        
        connection.query(sql,[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
      
             res.json(true);
             
        });
        
     });
};

exports.delete_all = function(req,res){
          
     var channelid = req.params.channelid;
     mysqlLib.getConnection(function (err, connection) {
        var sql = 'DELETE FROM channel_url_assoc WHERE channel_id = ?';
        
        connection.query(sql,[channelid], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
      
             res.json(true);
             
        });
        
     });
};
