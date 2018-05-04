var mysqlLib = require('../../mysqlLib');



exports.view = function(req, res){

  mysqlLib.getConnection(function(err,connection){
        var channel_splitscreen_id = req.params.channel_split_screen_id;
 
        
        var sql = ' SELECT cs.channel_splitscreen_cd, cleft.channel_cd as leftChannelCd,            ' +
                  '  cright.channel_cd as rightChannelCd                                            ' +
                  '  FROM channel_splitscreens cs                                                   ' +
                  '  join channels cleft on cleft.channel_id = cs.channel_id_left                   ' +
                  '  join channels cright on cright.channel_id = cs.channel_id_right                ' +
                  '  where cs.channel_splitscreen_id = ' + channel_splitscreen_id;   
 
        connection.query(sql,function(err,rows)
        {
         
            if(err)
                console.log("Error Selecting FROM channel_splitscreen_broadcasts (view) : %s ",err );
     
            if (!rows || rows.length == 0) {
                res.json({});
            } else {
                var row = rows[0];
                var leftUrl = '/broadcasts/' + row.leftChannelCd;
                var rightUrl = '/broadcasts/' + row.rightChannelCd;
                var viewData = {
                    channelCode: row.channel_splitscreen_cd,
                    leftUrl: leftUrl,
                    rightUrl: rightUrl
                };
                
                res.render('broadcasts/splitscreen_broadcast', {
                    page_title: ' OpsVision - Splitscreen',
                    view: viewData
                });
            }
           
         });

    });
};
