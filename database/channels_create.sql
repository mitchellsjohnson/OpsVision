CREATE TABLE `channels` (
  `channel_id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_cd` varchar(40) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `active` tinyint(1) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`channel_id`),
  UNIQUE KEY `uc_channels` (`channel_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

