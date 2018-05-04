CREATE TABLE `metric_measurements_ytd_average` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_id` int(11) DEFAULT NULL,
  `metric_id` int(11) NOT NULL,
  `value` decimal(18,4) NOT NULL,
  `measurement` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_metric_measurements_yearly_metric_id_month_year` (`metric_id`,`year`),
  KEY `FK_metric_id_metric_measurements_yearly` (`metric_id`),
  CONSTRAINT `FK_metric_id_metric_measurements_yearly` FOREIGN KEY (`metric_id`) REFERENCES `metrics` (`metric_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1002049 DEFAULT CHARSET=latin1;

