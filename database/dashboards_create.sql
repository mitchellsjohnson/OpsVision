CREATE TABLE `dashboards` (
  `dashboard_id` int(11) NOT NULL AUTO_INCREMENT,
  `dashboard_cd` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `dashboard_type_id` int(11) NOT NULL,  
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`dashboard_id`),
  KEY `FK_dashboard_type_id_dashboards` (`dashboard_type_id`),
  CONSTRAINT `FK_dashboard_type_id_dashboards` FOREIGN KEY (`dashboard_type_id`) REFERENCES `dashboard_types` (`dashboard_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

