CREATE TABLE `urls` (
  `url_id` int(11) NOT NULL AUTO_INCREMENT,
  `url_string` varchar(2000) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `url_type_id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`url_id`),
  KEY `FK_url_url_type_id` (`url_type_id`),
  CONSTRAINT `FK_url_url_type_id` FOREIGN KEY (`url_type_id`) REFERENCES `url_types` (`url_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

