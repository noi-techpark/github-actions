// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import core from "@actions/core";
import fs from "fs";
import validate from "./validator/validator.js"

function originTest(path, keyword, fileExt) {
    let entries = fs.readdirSync(path);

    return entries.map((entry) => {
        const entryPath = `${path}/${entry}`;

        if (fs.lstatSync(entryPath).isDirectory()) {
            return originTest(entryPath, keyword, fileExt);
        } else {
            const hasValidExt = [...fileExt].map((ext) => entryPath.endsWith(ext)).reduce((prev, current) => prev || current, false)
            if (!hasValidExt) {
                console.log(`Skipping ${entryPath}`);
                return false;
            }

            console.log(`Checking ${entryPath}`);
            let includesKeyword = fs.readFileSync(entryPath, "utf-8").includes(keyword);

            if (includesKeyword)
                console.log(`Found ${keyword} in ${entryPath}`);

            return includesKeyword
        }
    }).reduce((prev, current) => prev || current, false);
}

function manifestTest() {
    let manifestStr = fs.readFileSync("wcs-manifest.json", "utf-8");
    let validator = validate(manifestStr);
    let errors = validator.errors;
    if (errors) {
        let errorsStr = errors.map((error) => {
            let errorStr = `${error.path ? error.path : "(ROOT)"}: ${error.text}`;
            if (error.params) {
                errorStr += ": ";
                errorStr += Object.values(error.params).join(", ");
            }
            return errorStr
        }).join("\n");

        return errorsStr;
    } else {
        return null;
    }
}

function logoTest() {
    return fs.existsSync("wcs-logo.png");
}

try {
    // Origin Test
    const originTestEnabled = core.getBooleanInput("origin-test-enabled");
    const originTestDirectory = core.getInput("origin-test-directory");
    const originTestKeyword = core.getInput("origin-test-keyword");
    const originTestFileExt = core.getInput("origin-test-file-ext").split(" ");

    if (originTestEnabled) {
        console.log(`Testing for origin is enabled in directory ${originTestDirectory} with keyword ${originTestKeyword}`);
        console.log(`Searching in files with extensions: ${originTestFileExt.join(", ")}`);
    } else {
        console.log(`Testing for origin is not enabled`);
    }

    if (originTestEnabled) {
        if (!originTest(originTestDirectory, originTestKeyword, originTestFileExt)) {
            core.setFailed("No occurrence of origin found");
        }
    }

    // Manifest Test
    const manifestTestEnabled = core.getBooleanInput("origin-test-enabled");

    if (manifestTestEnabled) {
        console.log(`Testing manifest file is enabled`);
    } else {
        console.log(`Testing manifest file is not enabled`);
    }

    if (manifestTestEnabled) {
        let manifestTestReturn = manifestTest();
        if (manifestTestReturn) {
            core.setFailed(manifestTestReturn);
        } else {
            console.log("Manifest file ok");
        }
    }

    // Logo Test
    const logoTestEnabled = core.getBooleanInput("logo-test-enabled");

    if (logoTestEnabled) {
        console.log(`Testing for logo is enabled`);
    } else {
        console.log(`Testing for logo is not enabled`);
    }

    if (logoTestEnabled) {
        if (!logoTest()) {
            core.setFailed("wcs-logo.png does not exist");
        } else {
            console.log("Logo ok");
        }
    }
} catch (error) {
    core.setFailed(error.message);
}
