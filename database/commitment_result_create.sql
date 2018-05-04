CREATE TABLE commitment_results (
  commitment_result_id int(11) NOT NULL AUTO_INCREMENT,
  external_id  int(11) NULL,
  external_project_id  int(11) NULL,
  project varchar(1000) NOT NULL,
  bugid int(11) NOT NULL,
  title varchar(128) NOT NULL,
  status varchar(50) NOT NULL,
  category varchar(50) NOT NULL,
  external_commitment_id  int(11) NULL,
  commitment_name varchar(255) NOT NULL,
  committed_dt  timestamp NULL ,
  min_dt_rolled_to_prod  timestamp NULL ,
  commitment_result varchar(255)  NULL,
  inserted_on timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `inserted_by` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (commitment_result_id),
  KEY bugid (bugid),
  KEY IX_commitment_result_project (project(767))
) ENGINE=InnoDB AUTO_INCREMENT=12974334 DEFAULT CHARSET=latin1;

