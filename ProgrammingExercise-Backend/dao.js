const postgres = require("../ProgrammingExercise-Backend/utils/postgresDB/postgres-singledb");
const constants = require("./constants/service-constants");
/**
 * logger function
 */
const log = {
  info: console.log,
};

/**
 * Container for auth DAO.
 */
const dao = {};

dao.dumpCampaign = async function (body) {
  log.info("INSIDE DUMPING CAMPAIGN DATA");
  let status = false;

  //trying to fetch camping data
  const result = await dao.getCampaign(body["Campaign ID"]);

  //if data is not present then dump the same
  if (!result) {
    status = true;
    await dao.insertCampaign(body);
  }

  return status;
};

dao.dumpCampaignLogData = async function (body) {
  log.info("INSIDE DUMPING CAMPAIGN LOG  DATA");
  let status = false;

  //trying to fetch camping data
  const result = await dao.getCampaignLogData(body);

  log.info("result is", result);

  //if data is not present then dump the same
  if (!result) {
    status = true;
    await dao.insertOrUpdateCampaignLogData(body);
  } else {
    log.info("UPDATING THE RESPONSE");

    //update the body object here
    body["Impressions"] += result["impression_count"];
    body["Clicks"] += result["click_count"];
    body["25% Viewed"] += result["viewed_count_25"];
    body["50% Viewed"] += result["viewed_count_50"];
    body["75% Viewed"] += result["viewed_count_75"];
    body["100% Viewed"] += result["viewed_count_100"];
    log.info("body is", body);
    await dao.insertOrUpdateCampaignLogData(body);
  }

  return status;
};

/**
 * This method is implemented
 * @param  {number} campaignId
 * @returns {Promise<Object>} userInfo
 */
dao.getCampaign = async function (campaignId) {
  log.info("FETCH CAMPAIGN METHOD WITH", campaignId);

  let data;
  let result;

  //trying to prepare sql query
  let sql = `select * from ${constants.PG_YASHI_CNG} where yashi_campaign_id = ${campaignId}`;

  log.info("PREPARING SQL QUERY AS ", sql);

  //trying to create connection with the db
  await postgres.clientConnect(constants.PG_MASTER_DB);

  //trying to execute query
  try {
    data = await postgres.execute(sql);
  } catch (error) {
    log.info("GETTING ERROR WHILE EXECUTING PG QUERY", error);
    throw new Error(error);
  }

  if (Array.isArray(data) && data.length > 0) {
    result = data[0];
  }

  return result;
};

/**
 * This method is implemented
 * @param  {Object} body
 * @returns {Promise<Object>} userInfo
 */
dao.insertCampaign = async function (body) {
  log.info("DUMP CAMPAIGN METHOD WITH", body);

  let data;

  //trying to prepare sql query
  let sql = `insert into ${constants.PG_YASHI_CNG}(yashi_campaign_id , name ,yashi_advertiser_id , advertiser_name) values($1 , $2 , $3 , $4)`;

  log.info("PREPARING SQL QUERY AS ", sql);

  //trying to create connection with the db
  await postgres.clientConnect(constants.PG_MASTER_DB);

  //trying to execute query
  try {
    data = await postgres.executeInsertOrUpdate(sql, [
      body["Campaign ID"],
      body["Campaign Name"],
      body["Advertiser ID"],
      body["Advertiser Name"],
    ]);
  } catch (error) {
    log.info("GETTING ERROR WHILE EXECUTING PG QUERY", error);
    throw new Error(error);
  }

  log.info("result is", data);

  log.info("FINAL RESULT IS", JSON.stringify(data));
};

dao.getCampaignLogData = async function (body) {
  log.info("FETCH CAMPAIGN LOG DATA METHOD WITH", JSON.stringify(body));

  let result;
  let data;

  //trying to prepare sql query
  let sql = `select * from ${constants.PG_YASHI_CNG_DATA} where campaign_id = ${
    body["Campaign ID"]
  } and log_date = '${ExcelDateToJSDate(body["Date"])}'`;

  log.info("PREPARING SQL QUERY AS ", sql);

  //trying to create connection with the db
  await postgres.clientConnect(constants.PG_MASTER_DB);

  //trying to execute query
  try {
    data = await postgres.execute(sql);
  } catch (error) {
    log.info("GETTING ERROR WHILE EXECUTING PG QUERY", error);
    throw new Error(error);
  }

  log.info("result is", data);

  if (Array.isArray(data) && data.length > 0) {
    result = data[0];
  }

  log.info("FINAL RESULT IS", JSON.stringify(result));
  return result;
};

/**
 * This method is implemented
 * @param  {Object} body
 * @returns {Promise<Object>} userInfo
 */
dao.insertOrUpdateCampaignLogData = async function (body) {
  log.info("INSERT CampaignLogData METHOD WITH", body);

  let data;

  //trying to prepare sql query
  let sql = `insert into ${constants.PG_YASHI_CNG_DATA}(campaign_id ,log_date,impression_count,click_count,viewed_count_25,viewed_count_50,viewed_count_75,viewed_count_100) values($1,$2,$3,$4,$5,$6,$7,$8) 
    on conflict(campaign_id ,log_date) do update set impression_count=$3 , click_count=$4 ,  viewed_count_25=$5 , viewed_count_50=$6 ,viewed_count_75=$7 , viewed_count_100 = $8`;

  log.info("PREPARING SQL QUERY AS ", sql);

  //trying to create connection with the db
  await postgres.clientConnect(constants.PG_MASTER_DB);

  //trying to execute query
  try {
    data = await postgres.execute(sql, [
      body["Campaign ID"],
      ExcelDateToJSDate(body["Date"]),
      body["Impressions"],
      body["Clicks"],
      body["25% Viewed"],
      body["50% Viewed"],
      body["75% Viewed"],
      body["100% Viewed"],
    ]);
  } catch (error) {
    log.info("GETTING ERROR WHILE EXECUTING PG QUERY", error);
    throw new Error(error);
  }

  log.info("result is", data);

  log.info("FINAL RESULT IS", JSON.stringify(data));
};

/**
 * This method is implemented in-order to insert some base user Information
 * @param  {Object}  body
 * @returns {Promise<Object>} userInfo
 */
dao.dumpOrders = async function (body) {
  log.info("DUMP CAMPAIGN METHOD WITH", body);

  let data;

  //trying to prepare sql query
  let sql = `insert into ${constants.PG_YASHI_ORDER}(campaign_id ,yashi_order_id ,name) values($1 , $2 , $3)`;

  log.info("PREPARING SQL QUERY AS ", sql);

  //trying to create connection with the db
  await postgres.clientConnect(constants.PG_MASTER_DB);

  //trying to execute query
  try {
    data = await postgres.execute(sql, [
      body["Campaign ID"],
      body["Order ID"],
      body["Order Name"],
    ]);
  } catch (error) {
    log.info("GETTING ERROR WHILE EXECUTING PG QUERY", error);
    throw new Error(error);
  }

  log.info("result is", data);

  log.info("FINAL RESULT IS", JSON.stringify(data));
};

dao.dumpOrdersLogData = async function (body) {
  log.info("DUMP OrdersLogData METHOD WITH", body);

  let data;

  //trying to prepare sql query
  let sql = `insert into ${constants.PG_YASHI_ORDER_DATA}(order_id ,log_date,impression_count,click_count,viewed_count_25,viewed_count_50,viewed_count_75,viewed_count_100) values($1,$2,$3,$4,$5,$6,$7,$8)`;

  log.info("PREPARING SQL QUERY AS ", sql);

  //trying to create connection with the db
  await postgres.clientConnect(constants.PG_MASTER_DB);

  //trying to execute query
  try {
    data = await postgres.execute(sql, [
      body["Order ID"],
      ExcelDateToJSDate(body["Date"]),
      body["Impressions"],
      body["Clicks"],
      body["25% Viewed"],
      body["50% Viewed"],
      body["75% Viewed"],
      body["100% Viewed"],
    ]);
  } catch (error) {
    log.info("GETTING ERROR WHILE EXECUTING PG QUERY", error);
    throw new Error(error);
  }

  log.info("result is", data);

  log.info("FINAL RESULT IS", JSON.stringify(data));
};

dao.dumpCreative = async function (body) {
  log.info("DUMP CREATIVE METHOD WITH", body);

  let data;

  //trying to prepare sql query
  let sql = `insert into ${constants.PG_YASHI_CREATIVE}(order_id ,yashi_creative_id ,name,preview_url) values($1 , $2 , $3 , $4)`;

  log.info("PREPARING SQL QUERY AS ", sql);

  //trying to create connection with the db
  await postgres.clientConnect(constants.PG_MASTER_DB);

  //trying to execute query
  try {
    data = await postgres.execute(sql, [
      body["Order ID"],
      body["Creative ID"],
      body["Creative Name"],
      body["Creative Preview URL"],
    ]);
  } catch (error) {
    log.info("GETTING ERROR WHILE EXECUTING PG QUERY", error);
    throw new Error(error);
  }

  log.info("result is", data);

  log.info("FINAL RESULT IS", JSON.stringify(data));
};

dao.dumpCreativeLogData = async function (body) {
  log.info("DUMP CreativeLogData METHOD WITH", body);

  let data;

  //trying to prepare sql query
  let sql = `insert into ${constants.PG_YASHI_CREATIVE_DATA}(creative_id ,log_date,impression_count,click_count,viewed_count_25,viewed_count_50,viewed_count_75,viewed_count_100) values($1,$2,$3,$4,$5,$6,$7,$8)`;

  log.info("PREPARING SQL QUERY AS ", sql);

  //trying to create connection with the db
  await postgres.clientConnect(constants.PG_MASTER_DB);

  //trying to execute query
  try {
    data = await postgres.execute(sql, [
      body["Creative ID"],
      ExcelDateToJSDate(body["Date"]),
      body["Impressions"],
      body["Clicks"],
      body["25% Viewed"],
      body["50% Viewed"],
      body["75% Viewed"],
      body["100% Viewed"],
    ]);
  } catch (error) {
    log.info("GETTING ERROR WHILE EXECUTING PG QUERY", error);
    throw new Error(error);
  }

  log.info("result is", data);

  log.info("FINAL RESULT IS", JSON.stringify(data));
};

function ExcelDateToJSDate(date) {
  return new Date(Math.round((date - 25569) * 86400 * 1000)).toISOString();
}

module.exports = dao;
