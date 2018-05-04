CREATE TABLE `url_types` (
  `url_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `url_type_cd` varchar(20) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`url_type_id`),
  UNIQUE KEY `uc_url_type_cd` (`url_type_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

