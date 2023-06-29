import { exec } from "child_process";
import fs from "fs";
import https from "https";

const validatorUrl = "https://webcomponents.opendatahub.com/validator/validator.js";
const schemaUrl = "https://webcomponents.opendatahub.com/schemas/wcs-manifest-schema.json";

https.get(validatorUrl, (res) => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync("validator/validator.js", data);
  })
}).on('error', err => {
  console.log(err.message);
})

https.get(schemaUrl, (res) => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync("schemas/wcs-manifest-schema.json", schemaStr);
  })
}).on('error', err => {
  console.log(err.message);
})

// console.log("Downloading validator.js");
// const validatorRes = await fetch("https://webcomponents.opendatahub.com/validator/validator.js");
// const validatorStr = await validatorRes.text();
// fs.writeFileSync("validator/validator.js", validatorStr);

// console.log("Downloading wcs-manifest-schema.json");
// const schemaRes = await fetch("https://webcomponents.opendatahub.com/schemas/wcs-manifest-schema.json");
// const schemaStr = await schemaRes.text();
// fs.writeFileSync("schemas/wcs-manifest-schema.json", schemaStr);

console.log("Installing node modules...");
exec("npm ci", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});