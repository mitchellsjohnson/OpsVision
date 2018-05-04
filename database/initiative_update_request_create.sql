CREATE TABLE initiative_update_request (
  initiative_update_request_id int(11) NOT NULL AUTO_INCREMENT,
  metric_id int(11) NOT NULL,
  percent_complete decimal(18,4) NOT NULL,
  status  varchar(10) NOT NULL,
  status_dt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status_month int(11) NOT NULL,
  status_year int(11) NOT NULL,
  initiative_short_note  varchar(1000)  NULL,
  discussion_point_detail  varchar(8000)  NULL,
  comment  varchar(8000)  NULL,  
  status_submitted_by  varchar(100) NOT NULL,
  status_approved_by  varchar(100) NULL,
  initiative_update_request_status_cd varchar(10) NOT NULL,
  approved_dt timestamp NULL,
  created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by varchar(100) NOT NULL,
  updated timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  updated_by varchar(100) DEFAULT NULL,
  PRIMARY KEY (initiative_update_request_id),
  KEY FK_metric_id_initiative_update_request (metric_id),
  CONSTRAINT FK_metric_id_initiative_update_request FOREIGN KEY (metric_id) REFERENCES metrics (metric_id)
) ENGINE=InnoDB AUTO_INCREMENT=1018462 DEFAULT CHARSET=latin1;

