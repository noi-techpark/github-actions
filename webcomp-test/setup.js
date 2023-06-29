const { exec } = require("child_process");
const fs = require("fs");

console.log("Downloading validator.js");
const validatorRes = await fetch("https://webcomponents.opendatahub.com/validator/validator.js");
const validatorStr = await validatorRes.text();
fs.writeFileSync("validator/validator.js", validatorStr);

console.log("Downloading wcs-manifest-schema.json");
const schemaRes = await fetch("https://webcomponents.opendatahub.com/schemas/wcs-manifest-schema.json");
const schemaStr = await schemaRes.text();
fs.writeFileSync("schemas/wcs-manifest-schema.json", schemaStr);

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