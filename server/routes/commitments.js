var mysqlLib = require('../../mysqlLib');


exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        
        var metricid = req.params.metricid;
        var month = req.params.month;
        var year = req.params.year;

        var startDt = new Date(year, month, 1);
        var endDt = new Date(year, parseInt(month)+1, 1);
		
	    var year = startDt.getFullYear();
	    var beginDD = '01';
	    var beginMM = '' + startDt.getMonth();
		if (beginMM.length < 2) beginMM = '0' + beginMM;
	    var endDD = '01';
	    var endMM = '' + endDt.getMonth();
		if (endMM.length < 2) endMM = '0' + endMM;
        
        var beginDtStr = [year, beginMM, beginDD].join('-');
		var endDtStr = [year, endMM, endDD].join('-');
		
        var sql = 'SELECT cr.project, cr.bugid, cr.title, cr.status, cr.category, cr.commitment_name, ' +
                  ' date_format(cr.committed_dt, \'%Y-%m-%d\') as commitDt, date_format(cr.min_dt_rolled_to_prod, \'%Y-%m-%d\') as releaseDt, ' +
                  ' cr.commitment_result  as commitResult ' +
                  ' FROM commitment_results cr ' +
                  '      join metric_project_group mpg on cr.project = mpg.project ' +
                  ' WHERE ( ' +
				  '		(cr.committed_dt BETWEEN \'' + beginDtStr + '\' AND \'' + endDtStr + '\' AND cr.min_dt_rolled_to_prod IS NULL) ' +
                  '     or (cr.committed_dt IS NULL and cr.min_dt_rolled_to_prod BETWEEN \'' + beginDtStr + '\' AND \'' + endDtStr + '\' ) ' +
                  '     or (cr.committed_dt BETWEEN \'' + beginDtStr + '\' AND  \'' + endDtStr + '\' AND cr.min_dt_rolled_to_prod BETWEEN \'' + beginDtStr + '\' AND \'' + endDtStr + '\' ) ' +
				  ' ) ' +
                  ' AND cr.category <> \'Defect\' AND cr.commitment_result not like \'N/A%\' AND cr.commitment_result <> \'Committed and on Schedule (Manual Override)\' ' +
                  ' AND metric_id = ? ';
      

		console.log(sql);
     
        connection.query(sql, [metricid], function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });

    });
};
