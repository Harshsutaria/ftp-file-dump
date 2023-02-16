const ftp = require("basic-ftp");
const fs = require("fs");

const fileName = `data_files/`;

async function downloadFile(fileName) {
  console.log(fileName);
  let destinationDirectory = `${__dirname}/xlx/`;
  const client = new ftp.Client();
  try {
    await client.access({
      host: "ftp.tapclicks.com",
      user: "ftp_integration_test",
      password: "6k0Sb#EXT6jw",
    });

    //if the directory doesn`t exists then prepare the same
    if (!fs.existsSync(destinationDirectory)) {
      fs.mkdir(destinationDirectory, (err) => {
        if (err) console.log("error occured");
      });
    }

    let result = await client.list(fileName);
    result = result.map((x) => x.name);

    //filtering out the april and Advertisers file
    result = result.filter(
      (x) => !x.includes("-04") && !x.includes("Advertisers")
    );

    for (let i of result) {
      const write = fs.createWriteStream(`${__dirname}/xlx/${i}`, "utf-8");
      await client.downloadTo(write, `${fileName}/${i}`);
    }
  } catch (err) {
    console.log(err);
  }
  client.close();
}

// downloadFile(fileName);
