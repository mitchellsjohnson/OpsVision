var mysqlLib = require('../../mysqlLib');




exports.list     = function(req, res){

  mysqlLib.getConnection(function(err,connection){

        
        var sql = ' SELECT channel_splitscreen_id, channel_splitscreen_cd, description, channel_id_left, channel_id_right, ' +
                  ' date_format(created, \'%Y-%m-%d %h:%i:%s\') as created,  created_by, date_format(updated, \'%Y-%m-%d %h:%i:%s\') as created, updated_by ' +
                  ' FROM channel_splitscreens ';
        connection.query(sql,  function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting FROM channel_splitscreens (list) : %s ",err );
     
            res.send(rows);
           
         });

    });
};




exports.delete = function (req, res) {
    
    var channel_split_screen_id = req.params.channel_split_screen_id;
    mysqlLib.getConnection(function (err, connection) {
        
        var sql = 'DELETE FROM channel_splitscreens WHERE channel_splitscreen_id = ?';
        connection.query(sql, [channel_split_screen_id], function (err, rows) {
            if (err)
                console.log("Error deleting : %s ", err);
                
            });
            res.json(true); 
        });
};



exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var channel_splitscreen_id = req.params.channel_split_screen_id;
 
        
        var sql = ' SELECT channel_splitscreen_id, channel_splitscreen_cd, description, channel_id_left, channel_id_right, ' +
                  ' date_format(created, \'%Y-%m-%d %h:%i:%s\') as created,  created_by, date_format(updated, \'%Y-%m-%d %h:%i:%s\') as created, updated_by ' +
                  ' FROM channel_splitscreens where channel_splitscreen_id = ' + channel_splitscreen_id;   
 
        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting FROM channel_splitscreens (view) : %s ",err );
     
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
    var data = {
                channel_splitscreen_cd  :   input.channel_splitscreen_cd,
                description             :   input.description,
                channel_id_left         :   input.channel_id_left,
                channel_id_right        :   input.channel_id_right,
                updated_by              :   input.updated_by,
                created_by              :   input.updated_by};

        var sql = 'INSERT INTO channel_splitscreens set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()';
        connection.query(sql,[data], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.json(true);
          
        });
        
    });
};



exports.save_edit = function(req,res){
    var channel_split_screen_id = req.params.channel_split_screen_id;
    var input = JSON.parse(JSON.stringify(req.body));
    
    mysqlLib.getConnection(function (err, connection) {
        var updated_by = input.updated_by;
        if (!updated_by) {
            updated_by = 'admin';
        };
        var data = {
            channel_splitscreen_cd  : input.channel_splitscreen_cd,
            description             : input.description,
            channel_id_left         : input.channel_id_left,
            channel_id_right        : input.channel_id_right,
            updated_by              : input.updated_by,
            created_by              : input.updated_by
        };
        
        var sql = ' update channel_splitscreens set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()'+ 
                  ' where channel_splitscreen_id = ' + channel_split_screen_id;
        connection.query(sql, [data], function (err, rows) {
            
            if (err)
                console.log("Error inserting : %s ", err);
            
            res.json(true);
          
        });
        
    });
};
