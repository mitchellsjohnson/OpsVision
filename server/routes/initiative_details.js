var mysqlLib = require('../../mysqlLib');




exports.view_schedule     = function(req, res){

  mysqlLib.getConnection(function(err,connection){
       var metric_id = req.params.metric_id;
        
       var sql  = ' select imd.plan_start,                  ' +                                                                                                                                       
                  '    imd.plan_finish,                     ' +                                                                                                                                               
                  '    imd.actual_start,                    ' +                                                                                                                                             
                  '    imd.actual_finish,                   ' +                                                                                                                                              
                  '    imd.target_finish                    ' +     
                  '    from initiative_meta_data imd        ' + 
                  '    where metric_id = ' +  metric_id  ; 

        connection.query(sql,  function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send(rows);
           
         });

    });
};


exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var metric_id = req.params.metric_id;

       var sql  = ' select UNIX_TIMESTAMP(imd.plan_start) as planStart,                 ' +                                                                                                                                       
                  '    UNIX_TIMESTAMP(imd.plan_finish) as planFinish,                   ' +                                                                                                                                               
                  '    UNIX_TIMESTAMP(imd.actual_start) as actualStart,                 ' +                                                                                                                                             
                  '    UNIX_TIMESTAMP(imd.actual_finish) as actualFinish,               ' +                                                                                                                                              
                  '    UNIX_TIMESTAMP(imd.target_finish) as targetFinish                ' +     
                  '    from initiative_meta_data imd                                    ' + 
                  '    where metric_id = ' +  metric_id  ;

      connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting : %s ",err );
                var planStart       = new Date(rows[0].planStart * 1000);
                var planFinish      = new Date(rows[0].planFinish * 1000);
                var actualStart     = new Date(rows[0].actualStart * 1000);
                var actualFinish    = new Date(rows[0].actualFinish * 1000);
                var targetFinish    = new Date(rows[0].targetFinish * 1000);
                var startDtArray = [];
                var endDtArray = [];
                startDtArray.push(planStart);
                startDtArray.push(actualStart);
                endDtArray.push(planFinish);
                endDtArray.push(actualFinish);
                endDtArray.push(targetFinish);


                var startDt = new Date(Math.min.apply(null,startDtArray));
                var endDt = new Date(Math.max.apply(null,endDtArray));

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

                sql = ' SELECT distinct case when mm.year is null then Year(CURDATE()) else mm.year end as year,   ' +
                          '    case when mm.month is null then Month(CURDATE()) else mm.month end as month, m.metric_id, m.label, ' +
                          '    case (select count(*) from metrics where parent_metric_id = m.metric_id)' +
                          '       when  0 then \'FALSE\' ' +
                          '       ELSE \'TRUE\' ' +
                          '    END as HasChildDash, ' +
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
                          '    imd.value_proposition,                                                                                                                                            ' + 
                          '    imd.long_note,                                                                                                                                            ' +
                          '    imd.strategic_priority                                                                                                                                        '+
                          '  FROM metrics m ' + 
                                  '     LEFT join metric_measurements_daily_average mm on m.metric_id = mm.metric_id and DATE_ADD(MAKEDATE(mm.year, 1), INTERVAL (mm.month)-1 MONTH)  between \'' + beginDtStr + '\' AND  \'' + endDtStr + '\' ' +
                                  '   LEFT join initiative_meta_data imd on m.metric_id = imd.metric_id ' +
                                  '  WHERE  m.metric_id = '  + metric_id  +
                                  '  order by imd.plan_start, m.metric_id asc' ;

                connection.query(sql,function(err,rows)
                {
                    if(err)
                        console.log("Error Selecting : %s ",err );
     
                    res.send(rows);
           
                 });
           
         });


    });
};
