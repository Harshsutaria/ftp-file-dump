const ftp = require("basic-ftp");
const fs = require("fs");

async function downloadFile(fileName, writeStream) {
  console.log(fileName);
  const client = new ftp.Client();
  // client.ftp.verbose = true
  try {
    await client.access({
      host: "ftp.tapclicks.com",
      user: "ftp_integration_test",
      password: "6k0Sb#EXT6jw",
    });
    await client.downloadTo(writeStream, fileName);
  } catch (err) {
    console.log(err);
  }
  client.close();
}

let fileName = `data_files/Yashi_2016-05-28.csv`;
const write = fs.createWriteStream(
  "/home/vsspl/fileWrite/ProgrammingExercise-Backend/28.csv",
  "utf-8"
);

downloadFile(fileName, write);
