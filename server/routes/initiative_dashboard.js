var mysqlLib = require('../../mysqlLib');






exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var dashboard_id = req.params.dashboard_id;
        var start_year = parseInt(req.params.start_year,10);
        var start_month = parseInt(req.params.start_month,10);
        var total_months = parseInt(req.params.total_months,10);
        var metric_id = req.params.metric_id;

        var startDt = new Date(start_year, start_month-1, 1);
        var endDt =  new Date(start_year, start_month-1+total_months, 1);

	    var beginDD = startDt.getDate();
	    var beginMM = startDt.getMonth() + 1;
	    var beginYYYY = startDt.getFullYear();

	    var endDD = endDt.getDate();
	    var endMM = endDt.getMonth() + 1;
	    var endYYYY = endDt.getFullYear();
        
        var monthStr = '' + beginMM;
        if (monthStr.length < 2) monthStr = '0' + beginMM;
        var dayStr = '01';
        var beginDtStr = [beginYYYY, monthStr, dayStr].join('-');

        monthStr = '' + endMM;
        if (monthStr.length < 2) monthStr = '0' + endMM;

        dayStr = '01'
        if ( dayStr.length < 2) day = '0' +  dayStr;
        var endDtStr = [endYYYY, monthStr, dayStr].join('-');
        var sqlback = '';
        if (metric_id === 'undefined' || metric_id === undefined){
            sqlback =     '  FROM dashboards d ' +
                          '   join dashboard_metric_assoc dma on d.dashboard_id = dma.dashboard_id ' +
                          '   join metrics m on m.metric_id = dma.metric_id '  + 
                          '   LEFT join metric_measurements_daily_average mm on m.metric_id = mm.metric_id and DATE_ADD(MAKEDATE(mm.year, 1), INTERVAL (mm.month)-1 MONTH)  between \'' + beginDtStr + '\' AND  \'' + endDtStr + '\' ' +
                          '   LEFT join initiative_meta_data imd on m.metric_id = imd.metric_id ' +
                          ' where d.dashboard_id = ' + dashboard_id  +
                          ' order by dma.sequence, m.metric_id, month, year asc ' ;
        } else {
            sqlback =     '  FROM metrics m ' +
                          '     LEFT join dashboard_metric_assoc dma on dma.metric_id = (select parent_metric_id from metrics where metric_id = m.metric_id ) ' +
                          '     LEFT join dashboards d on d.dashboard_id = dma.dashboard_id ' +
                          '     LEFT join metric_measurements_daily_average mm on m.metric_id = mm.metric_id and DATE_ADD(MAKEDATE(mm.year, 1), INTERVAL (mm.month)-1 MONTH)  between \'' + beginDtStr + '\' AND  \'' + endDtStr + '\' ' +
                          '   LEFT join initiative_meta_data imd on m.metric_id = imd.metric_id ' +
                          '  WHERE  m.parent_metric_id = '  + metric_id  +
                          '         and  d.dashboard_id = ' + dashboard_id +
                          '  order by imd.plan_start, m.metric_id asc' ;

        }           
        if (!metric_id || metric_id == 'undefined')metric_id=-5;
        var sqlfront = ' SELECT distinct ' + dashboard_id + ' as dashboard_id' + ', case when mm.year is null then Year(CURDATE()) else mm.year end as year,   ' +
                  '    (select label from metrics where metric_id = ' + metric_id + ') as parent_label, ' +
                  '    case when mm.month is null then Month(CURDATE()) else mm.month end as month, m.metric_id, m.label, ' +
                  '    case (select count(*) from metrics where parent_metric_id = m.metric_id)' +
                  '       when  0 then \'FALSE\' ' +
                  '       ELSE \'TRUE\' ' +
                  '    END as HasChildDash, ' +
                  '    d.description as dashboard_description, ' +
                  '    m.definition, ' +
                  '    m.display_type as displaytype, ' +        
                  '    m.type as viewtype, ' +           
                  '    m.calculation_interval, ' +
                  '    (select case m.type when \'DELIVERY\' THEN (1000-(value*10)) else value end as value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = mm.month) as val, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = mm.month),\'GRAY\') as measure, ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month= mm.month) as discussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = mm.month) as externalDashboard,' +
                  '    (select case m.type when \'DELIVERY\' THEN (1000-(value*10)) else value end as value  from metric_measurements_ytd_average where metric_id = m.metric_id and year = mm.year ) as ytdval, ' + 
                  '    ifnull((select measurement from metric_measurements_ytd_average where metric_id = m.metric_id and year = mm.year),\'GRAY\')  as ytdmeasure, ' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month is null) as initiativeExternalDashboard,' +
                  '    imd.initiative_meta_data_id,                                                                                                                                  ' +
                  '    imd.plan_start,                                                                                                                                               ' +
                  '    imd.plan_finish,                                                                                                                                              ' + 
                  '    imd.actual_start,                                                                                                                                             ' + 
                  '    imd.actual_finish,                                                                                                                                            ' +
                  '    imd.target_finish,                                                                                                                                            ' +
                  '    imd.short_note,                                                                                                                                             ' + 
                  '    imd.long_note,                                                                                                                                            ' +
                  '    imd.value_proposition,                                                                                                                                            ' + 
                  '    imd.strategic_priority                                                                                                                                        ';  
                          
        var sql = sqlfront + sqlback;
   
        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });

    });
};
