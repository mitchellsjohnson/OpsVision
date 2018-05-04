var mysqlLib = require('../../mysqlLib');
/*
 * GET discussion_point listing.
 */


exports.view = function(req, res){
  var discussion_point_id = req.params.discussion_point_id;
  mysqlLib.getConnection(function(err,connection){
        var sql = 'SELECT dp.discussion_point_id, dp.detail, date_format(dp.created, \'%m/%d/%Y\') created, dp.created_by, ' +
                  ' mmda.metric_id, m.label, mmda.month, mmda.year,  date_format(dp.updated, \'%m/%d/%Y\') updated, dp.updated_by ' +
                  ' FROM discussion_points dp ' +
                  ' left join metric_measurements_daily_average mmda on mmda.discussion_point_id = dp.discussion_point_id ' +
                  ' left join metrics m on m.metric_id = mmda.metric_id where dp.discussion_point_id = ?';

        connection.query(sql, [discussion_point_id],function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};

exports.list = function(req, res){
  mysqlLib.getConnection(function(err,connection){
        var sql = 'SELECT dp.discussion_point_id, dp.detail, date_format(dp.created, \'%m/%d/%Y\') created, dp.created_by, ' +
                  ' mmda.metric_id, m.label, mmda.month, mmda.year,  date_format(dp.updated, \'%m/%d/%Y\') updated, dp.updated_by ' +
                  ' FROM discussion_points dp ' +
                  ' left join metric_measurements_daily_average mmda on mmda.discussion_point_id = dp.discussion_point_id ' +
                  ' left join metrics m on m.metric_id = mmda.metric_id ';

        connection.query(sql, function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};


/*Save the Discussion Point*/
exports.save = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));

    var updated_by = input.updated_by;
    if (!updated_by){
        updated_by = 'admin';
    };

    mysqlLib.getConnection(function (err, connection) {
        
        var data = {
            detail                  : input.detail,
            created_by              : updated_by,
            updated_by              : updated_by
        };
        var sql = 'INSERT INTO discussion_points set ?, updated=CURRENT_TIMESTAMP(), created=CURRENT_TIMESTAMP()';

        connection.query(sql,[data], function(err, rows)
        {
          
          if (err)
              console.log("Error inserting : %s ",err );
        var data1 = {
            discussion_point_id     : rows.insertId
            
        };

          sql = '  update metric_measurements_daily_average set ?, updated=CURRENT_TIMESTAMP() , updated_by = \'' + input.created_by + ' \' ' +
                      ' where metric_id = ' + input.metric_id + ' and month = ' + input.month + ' and year = ' + input.year ;
         
           var query =  connection.query(sql,  [data1], function(err, rows)
            {

              if (err)
                  console.log("Error updating : %s ",query.sql );
         
              res.json(true);
          
            });         
        });
   
    });
  
};

/*Edit the Discussion Point*/
exports.save_edit = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var discussion_point_id = req.params.discussion_point_id;
    
    mysqlLib.getConnection(function (err, connection) {
        
        var data = {
            detail                  : input.detail,
            updated_by              : input.updated_by
        };
        var sql = 'update discussion_points set ?, updated=CURRENT_TIMESTAMP() where discussion_point_id = ' + discussion_point_id ;

        connection.query(sql,[data], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );

          sql = '  update metric_measurements_daily_average set discussion_point_id = ' + discussion_point_id + ' , updated=CURRENT_TIMESTAMP(), updated_by =\'' + input.created_by + ' \' ' +
                      ' where metric_id = ' + input.metric_id + ' and month = ' + input.month + ' and year = ' + input.year ;
           var query =  connection.query(sql, function(err, rows)
            {
                
              if (err)
                  console.log("Error updating : %s ",query.sql);
              res.json(true);
          
            });         
        });
   
    });
  
};

/*Delete the Discussion Point*/
exports.delete = function(req,res){

    var discussion_point_id = req.params.discussion_point_id;
    
    mysqlLib.getConnection(function (err, connection) {
        

        var sql = 'update metric_measurements_daily_average set  discussion_point_id = null, updated=CURRENT_TIMESTAMP() where discussion_point_id = ' + discussion_point_id ;
 
        connection.query(sql, function(err, rows)
        {
  
          if (err)
              console.log("Error updating : %s ",err );

          sql = ' delete from discussion_points  where discussion_point_id = ' + discussion_point_id ;
           var query =  connection.query(sql, function(err, rows)
            {
  
              if (err)
                  console.log("Error updating : %s ",query.sql);
              res.json(true);
          
            });         
        });
   
    });
  
};

/*Detach the Discussion Point from all metrics*/
exports.detach = function(req,res){

    var discussion_point_id = req.params.discussion_point_id;
    
    mysqlLib.getConnection(function (err, connection) {
        

        var sql = 'update metric_measurements_daily_average set  discussion_point_id = null, updated=CURRENT_TIMESTAMP() where discussion_point_id = ' + discussion_point_id ;
 
        connection.query(sql, function(err, rows)
        {
  
          if (err)
              console.log("Error updating : %s ",err );

          res.json(true);        
        });
   
    });
  
};






