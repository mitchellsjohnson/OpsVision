var mysqlLib = require('../../mysqlLib');


exports.view = function(req, res) {
   var url_id = req.params.id;
    mysqlLib.getConnection(function(err, connection) {
        if (err) throw err;

        var sql = 'select u.url_id, u.url_string, u.description ' +
                  'from urls u where url_id = ?';        
        
        connection.query(sql, [url_id],function(sqlErr, rows, fields) {
            if (sqlErr) throw sqlErr;

            if (!rows || rows.length == 0) {
                res.json({});
            } else {
                var row = rows[0];
                var viewData = {
  
                    id: row.url_id,
                    url: row.url_string,
					description: row.description
                };

                res.render('layouts/view_lrgheader', {
                    page_title: ' OpsVision - URL Large Header',
                    view: viewData
                });
            }
        });
    });
};

