CREATE TABLE `dashboard_metric_assoc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dashboard_id` int(11) NOT NULL,
  `metric_id` int(11) NOT NULL,
  `sequence` int(11)  DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_metric_id_dashboard_metric_assoc` (`metric_id`),
  KEY `FK_dashboard_id_dashboard_metric_assoc` (`dashboard_id`),
  CONSTRAINT `FK_metric_id_dashboard_metric_assoc` FOREIGN KEY (`metric_id`) REFERENCES `metrics` (`metric_id`),
  CONSTRAINT `FK_dashboard_id_dashboard_metric_assoc` FOREIGN KEY (`dashboard_id`) REFERENCES `dashboards` (`dashboard_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

