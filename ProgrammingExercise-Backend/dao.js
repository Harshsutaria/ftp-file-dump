const postgres = require("../ProgrammingExercise-Backend/utils/postgresDB/postgres-singledb");
const constants = require("./constants/service-constants");
/**
 * logger function
 */
const log = {
  info: console.log,
};

/**
 * Container for DAO.
 */
const dao = {};

/**
 * This method is implemented in-order to dump campaign data
 * @param {Object} body
 * @returns {Promise<boolean>} status
 */
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

/**
 * This method is implemented in-order to dump campaign log data
 * @param {Object} body
 * @returns {Promise<boolean>} status
 */
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
    status = true;
    //update the body object here
    body = prepPayload(body, result);
    await dao.insertOrUpdateCampaignLogData(body);
  }

  return status;
};

/**
 * This method is implemented in-order to dump order data
 * @param {Object} body
 * @returns {Promise<boolean>} status
 */
dao.dumpOrder = async function (body) {
  log.info("INSIDE DUMPING ORDER DATA");
  let status = false;

  //trying to fetch camping data
  const result = await dao.getOrder(body["Order ID"], body["Campaign ID"]);

  //if data is not present then dump the same
  if (!result) {
    status = true;
    await dao.insertOrder(body);
  }

  return status;
};

/**
 * This method is implemented in-order to dump order log data
 * @param {Object} body
 * @returns {Promise<boolean>} status
 */
dao.dumpOrderLogData = async function (body) {
  log.info("INSIDE DUMPING ORDER LOG  DATA");
  let status = false;

  //trying to fetch camping data
  const result = await dao.getOrderLogData(body);

  log.info("result is", result);

  //if data is not present then dump the same
  if (!result) {
    status = true;
    await dao.insertOrUpdateOrderLogData(body);
  } else {
    log.info("UPDATING THE RESPONSE");
    status = true;
    //update the body object here
    body = prepPayload(body, result);
    await dao.insertOrUpdateOrderLogData(body);
  }

  return status;
};

/**
 * This method is implemented in-order to dump creative data
 * @param {Object} body
 * @returns {Promise<boolean>} status
 */
dao.dumpCreative = async function (body) {
  log.info("INSIDE DUMPING CAMPAIGN DATA");
  let status = false;

  //trying to fetch camping data
  const result = await dao.getCreative(body["Creative ID"], body["Order ID"]);

  //if data is not present then dump the same
  if (!result) {
    status = true;
    await dao.insertCreative(body);
  }

  return status;
};

/**
 * This method is implemented in-order to dump creative log data
 * @param {Object} body
 * @returns {Promise<boolean>} status
 */
dao.dumpCreativeLogData = async function (body) {
  log.info("INSIDE DUMPING CREATIVE LOG  DATA");
  let status = false;

  //trying to fetch camping data
  const result = await dao.getCreativeLogData(body);

  log.info("result is", result);

  //if data is not present then dump the same
  if (!result) {
    status = true;
    await dao.insertOrUpdateCreativeLogData(body);
  } else {
    log.info("UPDATING THE RESPONSE");
    status = true;
    //update the body object here
    body = prepPayload(body, result);
    await dao.insertOrUpdateCreativeLogData(body);
  }

  return status;
};

/**
 * This method is  implemented in-order to fetch campaign data based on id
 * @param  {number} campaignId
 * @returns {Promise<Object>} campaignData
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
 * This method is  implemented in-order to insert campaign data
 * @param  {Object} body
 * @returns {Promise<boolean>} status
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

  return data ? true : false;
};

/**
 * This method is  implemented in-order to fetch campaign log data
 * @param  {Object} body
 * @returns {Promise<Object>} campaignLogData
 */
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
 * This method is  implemented in-order to fetch campaign data based on id
 * @param  {Object} body
 * @returns {Promise<Object>} campaignLogData
 */
dao.getOrderLogData = async function (body) {
  log.info("FETCH ORDER LOG DATA METHOD WITH", JSON.stringify(body));

  let result;
  let data;

  //trying to prepare sql query
  let sql = `select * from ${constants.PG_YASHI_ORDER_DATA} where order_id = ${
    body["Order ID"]
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

  return result;
};

/**
 * This method is  implemented in-order to insert/update campaign log data
 * @param  {Object} body
 * @returns {Promise<boolean>} status
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

  return data ? true : false;
};

/**
 * This method is  implemented in-order to insert/update order log data
 * @param  {Object} body
 * @returns {Promise<boolean>} status
 */
dao.insertOrUpdateOrderLogData = async function (body) {
  log.info("INSERT OR UPDATE OrdersLogData METHOD WITH", body);

  let data;

  //trying to prepare sql query
  let sql = `insert into ${constants.PG_YASHI_ORDER_DATA}(order_id ,log_date,impression_count,click_count,viewed_count_25,viewed_count_50,viewed_count_75,viewed_count_100) values($1,$2,$3,$4,$5,$6,$7,$8)
  on conflict(order_id ,log_date) do update set impression_count=$3 , click_count=$4 ,  viewed_count_25=$5 , viewed_count_50=$6 ,viewed_count_75=$7 , viewed_count_100 = $8`;

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

  return data ? true : false;
};

/**
 * This method is  implemented in-order to insert creative data
 * @param  {Object} body
 * @returns {Promise<boolean>} status
 */
dao.insertCreative = async function (body) {
  log.info("INSERT CREATIVE METHOD WITH", body);

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

  return data ? true : false;
};

/**
 * This method is  implemented in-order to insert/update creative log data
 * @param  {Object} body
 * @returns {Promise<boolean>} status
 */
dao.insertCreativeLogData = async function (body) {
  log.info("INSERT CreativeLogData METHOD WITH", body);

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

  return data ? true : false;
};

/**
 * This method is implemented to fetch orders based on orderId , campaignId
 * @param  {number} orderId
 * @param  {number} campaignId
 * @returns {Promise<Object>} order
 */
dao.getOrder = async function (orderId, campaignId) {
  log.info("FETCH ORDER METHOD WITH", orderId);

  let data;
  let result;

  //trying to prepare sql query
  let sql = `select * from ${constants.PG_YASHI_ORDER} where yashi_order_id = ${orderId} and campaign_id = ${campaignId}`;

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
 * This method is implemented in-order to insert order
 * @param  {Object} body
 * @returns {Promise<boolean>} order
 */
dao.insertOrder = async function (body) {
  log.info("INSERT ORDER METHOD WITH", body);

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

  return data ? true : false;
};

/**
 * This method is implemented to fetch orders based on orderId , campaignId
 * @param  {number} creativeId
 * @param  {number} orderId
 * @returns {Promise<Object>} creative
 */
dao.getCreative = async function (creativeId, orderId) {
  log.info("FETCH CREATIVE METHOD WITH", creativeId);

  let data;
  let result;

  //trying to prepare sql query
  let sql = `select * from ${constants.PG_YASHI_CREATIVE} where yashi_creative_id = ${creativeId} and order_id = ${orderId}`;

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
 * This method is implemented to fetch creative log data
 * @param  {Object} body
 * @returns {Promise<Object>} creativeLogData
 */
dao.getCreativeLogData = async function (body) {
  log.info("FETCH CREATIVE LOG DATA METHOD WITH", JSON.stringify(body));

  let result;
  let data;

  //trying to prepare sql query
  let sql = `select * from ${
    constants.PG_YASHI_CREATIVE_DATA
  } where creative_id = ${
    body["Creative ID"]
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
 * This method is implemented in-order to insert/update creativeLogData
 * @param  {Object} body
 * @returns {Promise<Object>} creative
 */
dao.insertOrUpdateCreativeLogData = async function (body) {
  log.info("INSERT OR UPDATE creativeLogData METHOD WITH", body);

  let data;

  //trying to prepare sql query
  let sql = `insert into ${constants.PG_YASHI_CREATIVE_DATA}(creative_id ,log_date,impression_count,click_count,viewed_count_25,viewed_count_50,viewed_count_75,viewed_count_100) values($1,$2,$3,$4,$5,$6,$7,$8)
  on conflict(creative_id ,log_date) do update set impression_count=$3 , click_count=$4 ,  viewed_count_25=$5 , viewed_count_50=$6 ,viewed_count_75=$7 , viewed_count_100 = $8`;

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

/**
 * This method is implemented in-order to update views/stats based on the existing record
 * @param  {Object} body
 * @param  {Object} result
 * @returns {Promise<Object>} body
 */

function prepPayload(body, result) {
  body["Impressions"] += result["impression_count"];
  body["Clicks"] += result["click_count"];
  body["25% Viewed"] += result["viewed_count_25"];
  body["50% Viewed"] += result["viewed_count_50"];
  body["75% Viewed"] += result["viewed_count_75"];
  body["100% Viewed"] += result["viewed_count_100"];
  log.info("body is", body);
  return body;
}

/**
 * This function is implemented in-order to return iso date
 * @param {number} date
 * @returns {string} date
 */
function ExcelDateToJSDate(date) {
  return new Date(Math.round((date - 25569) * 86400 * 1000)).toISOString();
}

module.exports = dao;
