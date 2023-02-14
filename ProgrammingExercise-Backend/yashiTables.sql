
/*Table structure for table zz__yashi_cgn */

CREATE TABLE zz__yashi_cgn (
  campaign_id  serial primary key not null,
  yashi_campaign_id INTEGER  DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  yashi_advertiser_id INTEGER  DEFAULT NULL,
  advertiser_name VARCHAR(100) DEFAULT NULL
)

/*Table structure for table zz__yashi_cgn_data */

CREATE TABLE zz__yashi_cgn_data (
  id serial primary key NOT NULL ,
  campaign_id INTEGER  DEFAULT NULL,
  log_date VARCHAR DEFAULT NULL,
  impression_count INTEGER DEFAULT NULL,
  click_count INTEGER DEFAULT NULL,
  viewed_count_25 INTEGER DEFAULT NULL,
  viewed_count_50 INTEGER DEFAULT NULL,
  viewed_count_75 INTEGER DEFAULT NULL,
  viewed_count_100 INTEGER DEFAULT NULL,
  unique (campaign_id , log_date)
) 

/*Table structure for table zz__yashi_order 
  same campoaign same order id
*/

CREATE TABLE zz__yashi_order (
  order_id serial primary key NOT NULL ,
  campaign_id INTEGER  DEFAULT NULL,
  yashi_order_id INTEGER DEFAULT NULL,
  name VARCHAR(200) DEFAULT null
  ) 

/*Table structure for table zz__yashi_order_data */

CREATE TABLE zz__yashi_order_data (
  id serial primary key NOT NULL ,
  order_id INTEGER  DEFAULT NULL,
  log_date VARCHAR DEFAULT NULL,
  impression_count INTEGER DEFAULT NULL,
  click_count INTEGER DEFAULT NULL,
  viewed_count_25 INTEGER DEFAULT NULL,
  viewed_count_50 INTEGER DEFAULT NULL,
  viewed_count_75 INTEGER DEFAULT NULL,
  viewed_count_100 INTEGER DEFAULT NULL,
  unique (order_id , log_date)
) 


/*Table structure for table zz__yashi_creative */

CREATE TABLE zz__yashi_creative (
  creative_id serial primary key  NOT NULL ,
  order_id INTEGER DEFAULT NULL,
  yashi_creative_id INTEGER DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  preview_url VARCHAR(255) DEFAULT NULL
) 

/*Table structure for table zz__yashi_creative_data */

CREATE TABLE zz__yashi_creative_data (
  id serial primary key NOT NULL ,
  creative_id INTEGER  DEFAULT NULL,
  log_date VARCHAR DEFAULT NULL,
  impression_count INTEGER DEFAULT NULL,
  click_count INTEGER DEFAULT NULL,
  viewed_count_25 INTEGER DEFAULT NULL,
  viewed_count_50 INTEGER DEFAULT NULL,
  viewed_count_75 INTEGER DEFAULT NULL,
  viewed_count_100 INTEGER DEFAULT NULL,
  unique (creative_id , log_date)
) 