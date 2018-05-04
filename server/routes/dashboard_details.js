var mysqlLib = require('../../mysqlLib');






exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var id = req.params.id;
        var year = req.params.year;
        var metric_id = req.params.metric_id;

        var sqlback = '';
        if (metric_id === 'undefined'){
            sqlback =     '  FROM dashboards d ' +
                          '   join dashboard_metric_assoc dma on d.dashboard_id = dma.dashboard_id ' +
                          '   join metrics m on m.metric_id = dma.metric_id '  + 
                          '   LEFT join metric_measurements_daily_average mm on m.metric_id = mm.metric_id and mm.year = ' + year +
                          '   LEFT join initiative_meta_data imd on m.metric_id = imd.metric_id ' +
                          ' where d.dashboard_id = ' + id  +
                          ' order by dma.sequence asc ' ;
        } else {
            sqlback =     '  FROM metrics m ' +
                          '     LEFT join dashboard_metric_assoc dma on dma.metric_id = (select parent_metric_id from metrics where metric_id = m.metric_id ) ' +
                          '     LEFT join dashboards d on d.dashboard_id = dma.dashboard_id ' +
                          '     LEFT join metric_measurements_daily_average mm on m.metric_id = mm.metric_id and mm.year = ' + year +
                          '   LEFT join initiative_meta_data imd on m.metric_id = imd.metric_id ' +
                          '  WHERE  m.parent_metric_id = '  + metric_id  +
                          '         and  d.dashboard_id = ' + id  ;

        }           
        
        var sqlfront = ' SELECT distinct ' + id + ' as dashboard_id' + ', case when mm.year is null then Year(CURDATE()) else mm.year end as year,  m.metric_id, m.label, ' +
                  '    case (select count(*) from metrics where parent_metric_id = m.metric_id)' +
                  '       when  0 then \'FALSE\' ' +
                  '       ELSE \'TRUE\' ' +
                  '    END as HasChildDash, ' +
                  '    d.description as dashboard_description, ' +
                  '    m.definition, ' +
                  '    m.display_type as displaytype, ' +        
                  '    m.type as viewtype, ' +           
                  '    m.calculation_interval, ' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 1) as janval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 1),\'GRAY\') as janmeasure, ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 1) as janDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 1) as janExternalDashboard,' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 2) as febval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 2),\'GRAY\') as febmeasure, ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 2) as febDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 2) as febExternalDashboard,' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 3) as marval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 3),\'GRAY\') as marmeasure, ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 3) as marDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 3) as marExternalDashboard,' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 4) as aprval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 4),\'GRAY\') as aprmeasure,   ' + 
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 4) as aprDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 4) as aprExternalDashboard,' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 5) as mayval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 5),\'GRAY\') as maymeasure, ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 5) as mayDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 5) as mayExternalDashboard,' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 6) as junval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 6),\'GRAY\') as junmeasure, ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 6) as junDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 6) as junExternalDashboard,' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 7) as julval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 7),\'GRAY\') as julmeasure, ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 7) as julDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 7) as julExternalDashboard,' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 8) as augval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 8),\'GRAY\') as augmeasure,  ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 8) as augDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 8) as augExternalDashboard,' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 9) as sepval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 9),\'GRAY\') as sepmeasure, ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 9) as sepDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 9) as sepExternalDashboard,' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 10) as octval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 10),\'GRAY\') as octmeasure, ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 10) as octDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 11) as octExternalDashboard,' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 11) as novval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 11),\'GRAY\') as novmeasure, ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 11) as novDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 11) as novExternalDashboard,' +
                  '    (select value from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 12) as decval, ' +
                  '    ifnull((select measurement from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 12),\'GRAY\') as decmeasure ,    ' +
                  '    (select discussion_point_id from metric_measurements_daily_average where metric_id = m.metric_id and year = mm.year and month = 12) as decDiscussionPointId,' +
                  '    (select url from metric_external_dashboards where metric_id = m.metric_id and year = mm.year and month = 12) as decExternalDashboard,' +
                  '    (select value  from metric_measurements_ytd_average where metric_id = m.metric_id and year = mm.year ) as ytdval, ' + 
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
