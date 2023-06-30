// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import core from "@actions/core";
import fs from "fs";
import validate from "./validator/validator.js"

function dbg(str) {
    core.debug(str);
}

function info(str) {
    core.info(str);
}

function warn(str) {
    core.warn(str);
}

function error(str) {
    core.error(str);
}

let failedTests = [];
function setFailed(failedTest) {
    error(`Test failed: ${failedTest}`);
    failedTests.push(failedTest);
}

function setSucceeded(succeededTest) {
    info(`Test succeeded: ${succeededTest}`);
}

function originTest(path, keyword, fileExt) {
    let entries = fs.readdirSync(path);

    return entries.map((entry) => {
        const entryPath = `${path}/${entry}`;

        if (fs.lstatSync(entryPath).isDirectory()) {
            return originTest(entryPath, keyword, fileExt);
        } else {
            const hasValidExt = [...fileExt].map((ext) => entryPath.endsWith(ext)).reduce((prev, current) => prev || current, false)
            if (!hasValidExt) {
                dbg(`Skipping ${entryPath}`);
                return false;
            }

            dbg(`Checking ${entryPath}`);
            let includesKeyword = fs.readFileSync(entryPath, "utf-8").includes(keyword);

            if (includesKeyword)
                info(`Found ${keyword} in ${entryPath}`);

            return includesKeyword
        }
    }).reduce((prev, current) => prev || current, false);
}

function manifestTest() {
    let manifestStr = fs.readFileSync("wcs-manifest.json", "utf-8");
    let validator = validate(manifestStr);
    let errors = validator.errors;
    if (errors) {
        errors.forEach((error) => {
            let errorStr = `${error.path ? error.path : "(ROOT)"}: ${error.text}`;
            if (error.params) {
                errorStr += ": ";
                errorStr += Object.values(error.params).join(", ");
            }
            
            error(errorStr);
        });

        return false;
    } else {
        return true;
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
        info(`Testing for origin is enabled in directory ${originTestDirectory} with keyword ${originTestKeyword}`);
        info(`Searching in files with extensions: ${originTestFileExt.join(", ")}`);
    } else {
        warn(`Testing for origin is not enabled`);
    }

    if (originTestEnabled) {
        if (!originTest(originTestDirectory, originTestKeyword, originTestFileExt)) {
            setFailed("Orign Test")
        } else {
            setSucceeded("Origin Test")
        }
    }

    // Manifest Test
    const manifestTestEnabled = core.getBooleanInput("origin-test-enabled");

    if (manifestTestEnabled) {
        info(`Testing manifest file is enabled`);
    } else {
        warn(`Testing manifest file is not enabled`);
    }

    if (manifestTestEnabled) {
        if (!manifestTest()) {
            setFailed("Manifest test")
        } else {
            setSucceeded("Manifest Test")
        }
    }

    // Logo Test
    const logoTestEnabled = core.getBooleanInput("logo-test-enabled");

    if (logoTestEnabled) {
        info(`Testing for logo is enabled`);
    } else {
        warn(`Testing for logo is not enabled`);
    }

    if (logoTestEnabled) {
        if (!logoTest()) {
            error("wcs-logo.png does not exist")
            setFailed("Logo test");
        } else {
            setSucceeded("Logo test");
        }
    }

    if (failedTests.length > 0) {
        core.setFailed(`Failed tests: ${failedTests.join(", ")}`);
    }
} catch (error) {
    core.setFailed(error.message);
}
