// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import core from "@actions/core";
import fs from "fs";

function originTest(path, keyword) {
    console.log(`Reading entries of path: ${path}`);
    let entries = fs.readdirSync(path);

    return entries.map((entry) => {
        const entryPath = `${path}/${entry}`;

        if (fs.lstatSync(entryPath).isDirectory()) {
            return originTest(entryPath, keyword);
        } else {
            console.log(`Checking for occurence of ${keyword} in ${entryPath}`);
            let includesKeyword = fs.readFileSync(entryPath, "utf-8").includes("origin");
            if (includesKeyword) console.log(`Found ${keyword} in ${entryPath}`);
            return includesKeyword
        }
    }).reduce((prev, current) => { return prev ||current }, false);
}

try {
    const originTestEnabled = core.getBooleanInput("origin-test-enabled");
    const originTestDirectory = core.getInput("origin-test-directory");
    const originTestKeyword = core.getInput("origin-test-keyword");

    if (originTestEnabled) {
        console.log(`Testing for origin is enabled in directory ${originTestDirectory} with keyword ${originTestKeyword}`);
    } else {
        console.log(`Testing for origin is not enabled`);
    }

    if (originTestEnabled) {
        if (!originTest(originTestDirectory, originTestKeyword)) core.setFailed("No occurrence of origin found");
    }
} catch (error) {
    core.setFailed(error.message);
}
