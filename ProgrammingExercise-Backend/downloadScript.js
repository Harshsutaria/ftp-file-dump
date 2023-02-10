const ftp = require("basic-ftp");
const fs = require("fs");

async function downloadFile(fileName) {
  console.log(fileName);
  let destinationDirectory = `/home/vsspl/fileWrite/ProgrammingExercise-Backend/xlx/`;
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

    for (let i of result) {
      const write = fs.createWriteStream(
        `/home/vsspl/fileWrite/ProgrammingExercise-Backend/xlx/${i}`,
        "utf-8"
      );
      await client.downloadTo(write, `${fileName}/${i}`);
    }
  } catch (err) {
    console.log(err);
  }
  client.close();
}

// let fileName = `data_files/`;

// downloadFile(fileName);
