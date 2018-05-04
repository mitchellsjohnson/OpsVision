CREATE TABLE `channel_url_assoc` (
  `channel_id` int(11) NOT NULL,
  `url_id` int(11) NOT NULL,
  `priority` int(11) NOT NULL,
  `display_duration_sec` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `FK_channel_url_assoc_channels` (`channel_id`),
  CONSTRAINT `FK_channel_url_assoc_channels` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`channel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

