CREATE TABLE `dashboard_types` (
  `dashboard_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `dashboard_type_cd` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`dashboard_type_id`),
  UNIQUE KEY `uc_dashboard_types_dashboard_type_cd` (`dashboard_type_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

