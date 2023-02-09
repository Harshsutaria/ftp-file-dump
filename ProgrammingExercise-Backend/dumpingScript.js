const dao = require("./dao");
const xlsx = require("xlsx");
const dir = `/home/vsspl/fileWrite/ProgrammingExercise-Backend/xlx/`;
const fs = require("fs");

/**
 * logger function
 */
const log = {
  info: console.log,
};

/**
 * This method is implemented in-order to read the data from the csv files
 * @returns {Object[]}
 */
function readFromCsv() {
  //only considering data rows where below are the advertiser id
  const advertise = [9656, 8876, 9518, 9528, 8334];

  //trying to list out the files on the directory
  const fileList = fs.readdirSync(dir);

  //initializing the variable to store the file data
  const data = [];

  // iterating over the fileList to dump data
  for (const i of fileList) {
    //trying to read file data
    const file = xlsx.readFile(`${dir}/${i}`);
    // using utility method to convert each rows into the json object
    const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
    //inserting the data into the Data array
    temp.forEach((res) => {
      //adding base validations for advertise
      if (advertise.includes(res["Advertiser ID"])) {
        data.push(res);
      }
    });
  }

  return data;
}

/**
 * This method is implemented in-order to dump data from the csv files into respective tables
 */
async function main() {
  log.info("inside main method");
  const data = readFromCsv();

  console.log("DATA IS", data.length);

  for (let i of data) {
    log.info("i is", i);
    //dumping the campaign
    await dao.dumpCampaign(i);
    //dumping the campaign data
    await dao.dumpCampaignLogData(i);
    // //dumping the order
    await dao.dumpOrder(i);
    // //dumping the order data
    await dao.dumpOrderLogData(i);
    // //dumping the creatives
    await dao.dumpCreative(i);
    // //dumping the creative data
    await dao.dumpCreativeLogData(i);
  }
}

main();
// readFromCsv();
