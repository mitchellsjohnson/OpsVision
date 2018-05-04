CREATE TABLE `metric_measurements_daily_average` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_id` int(11) DEFAULT NULL,
  `metric_id` int(11) NOT NULL,
  `value` decimal(18,4) NOT NULL,
  `measurement` varchar(255) NOT NULL,
  `discussion_point_id` int(11) DEFAULT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_metric_measurements_metric_id_month_year` (`metric_id`,`month`,`year`),
  KEY `FK_metric_id_metric_measurements` (`metric_id`),
  KEY `FK_discussion_point_id_FK_metric_id_metric_measurements` (`discussion_point_id`),
  CONSTRAINT `FK_discussion_point_id_FK_metric_id_metric_measurements` FOREIGN KEY (`discussion_point_id`) REFERENCES `discussion_points` (`discussion_point_id`),
  CONSTRAINT `FK_metric_id_metric_measurements` FOREIGN KEY (`metric_id`) REFERENCES `metrics` (`metric_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1013662 DEFAULT CHARSET=latin1;

