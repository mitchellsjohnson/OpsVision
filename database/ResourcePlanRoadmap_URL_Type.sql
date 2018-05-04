INSERT INTO commandcenter.url_types(
   url_type_cd
  ,description
  ,created
  ,created_by
  ,updated
  ,updated_by
) VALUES (
   'Product_Roadmap'
  ,'A Native URL subtype that is a product roadmap;  full url that will be displayed on a channel or roadmap view.'  -- description - IN varchar(200)
  ,now() -- created - IN timestamp
  ,'msj' -- created_by - IN varchar(100)
  ,now() -- updated - IN timestamp
  ,'msj'  -- updated_by - IN varchar(100)
);

INSERT INTO commandcenter.url_types(
   url_type_cd
  ,description
  ,created
  ,created_by
  ,updated
  ,updated_by
) VALUES (
   'Resource_Plan'
  ,'A Native URL subtype that is a resource plan;  full url that will be displayed on a channel or resource plan view.'  -- description - IN varchar(200)
  ,now() -- created - IN timestamp
  ,'msj' -- created_by - IN varchar(100)
  ,now() -- updated - IN timestamp
  ,'msj'  -- updated_by - IN varchar(100)
);