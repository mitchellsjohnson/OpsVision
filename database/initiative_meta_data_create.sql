CREATE TABLE `initiative_meta_data` (
  `initiative_meta_data_id` int(11) NOT NULL AUTO_INCREMENT,
  `metric_id` int(11) NOT NULL,
  `plan_start` datetime DEFAULT NULL,
  `plan_finish` datetime DEFAULT NULL,
  `target_finish` datetime DEFAULT NULL,
  `actual_start` datetime DEFAULT NULL,
  `actual_finish` datetime DEFAULT NULL,
  `strategic_priority` varchar(200) DEFAULT NULL,
  `value_proposition` varchar(8000) DEFAULT NULL,
  `short_note` varchar(1000) DEFAULT NULL,
  `long_note` varchar(8000) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`initiative_meta_data_id`),
  KEY `FK_initiative_meta_data_metric_id` (`metric_id`),
  CONSTRAINT `FK_initiative_meta_data_metric_id` FOREIGN KEY (`metric_id`) REFERENCES `metrics` (`metric_id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=latin1;

