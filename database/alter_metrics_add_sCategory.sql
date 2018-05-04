
ALTER TABLE metrics
add COLUMN category varchar(100);

ALTER TABLE metrics
add COLUMN metrics_day_limit int;
