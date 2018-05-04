CREATE TABLE `metric_project_group` (
  `metric_project_group_id` int(11) NOT NULL AUTO_INCREMENT,
  `project_group` varchar(200) NOT NULL,
  `project` varchar(200) DEFAULT NULL,
  `metric_id` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`metric_project_group_id`),
  CONSTRAINT uc_project_group_project UNIQUE (project_group,project),
  CONSTRAINT `FK_metric_id_metric_project_group` FOREIGN KEY (`metric_id`) REFERENCES `metrics` (`metric_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

