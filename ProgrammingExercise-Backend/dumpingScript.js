const dao = require("./dao");
const xlsx = require("xlsx");
let file = xlsx.readFile(
  "/home/vsspl/fileWrite/ProgrammingExercise-Backend/xlx/28.csv"
);

/**
 * logger function
 */
const log = {
  info: console.log,
};

function readFromCsv() {
  let data = [];

  const sheets = file.SheetNames;

  for (let i = 0; i < 2; i++) {
    const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      data.push(res);
    });
  }

  return data;
}

async function main() {
  log.info("inside main method");
  const data = readFromCsv();
  const advertise = [9656, 8876, 9518, 9528, 8334];

  for (let i of data) {
    log.info("i is", i);
    if (advertise.includes(i["Advertiser ID"])) {
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
      // process.exit(1);
    }
  }
}

main();
