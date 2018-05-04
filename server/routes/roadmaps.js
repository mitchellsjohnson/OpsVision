var mysqlLib = require('../../mysqlLib');



exports.list = function(req, res){

  mysqlLib.getConnection(function(err,connection){
       
        var sql = 'SELECT u.url_id, u.url_string, u.description,ut.url_type_cd, ut.url_type_id, ' +
                  'date_format(u.created, \'%m/%d/%Y\') created, u.created_by,  if (u.updated,date_format(u.updated, \'%m/%d/%Y\'),null) updated,' +
                  'u.updated_by FROM urls u ' +
                  'inner join url_types ut on ut.url_type_id = u.url_type_id and ut.url_type_cd = \'Product_Roadmap\' order by greatest(u.created, u.updated) desc ';

        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });
         
   
    });
  
};
