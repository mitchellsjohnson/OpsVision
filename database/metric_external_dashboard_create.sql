CREATE TABLE `metric_external_dashboards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `metric_id` int(11) NOT NULL,
  `url` varchar(500) NOT NULL,
  `month` int(11) NULL,
  `year` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_metric_external_dashboards_id_month_year` (`metric_id`,`month`,`year`),
  KEY `FK_metric_id_metric_external_dashboards` (`metric_id`),
  CONSTRAINT `FK_metric_id_metric_external_dashboards` FOREIGN KEY (`metric_id`) REFERENCES `metrics` (`metric_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10787 DEFAULT CHARSET=latin1;

