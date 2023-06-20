// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import core from "@actions/core";
import fs from "fs";

function originTest(path, keyword) {
    let entries = fs.readdirSync(path);

    return entries.map((entry) => {
        if (fs.lstatSync(entry).isDirectory) {
            return originTest(entry, keyword);
        } else {
            return fs.readFileSync(entry, "utf-8").includes("origin");
        }
    }).reduce((prev, current) => { return prev ||current }, false);
}

try {
    const originTestEnabled = core.getBooleanInput("origin-test-enabled");
    const originTestKeyword = core.getInput("origin-test-keyword");

    if (originTestEnabled) {
        console.log(`Testing for origin is enabled with keyword ${originTestKeyword}`);
    } else {
        console.log(`Testing for origin is not enabled`);
    }

    const workingDirectory = core.getInput("working-directory");

    if (originTestEnabled) {
        if (!originTest(workingDirectory, originTestKeyword)) core.setFailed("No occurrence of origin found");
    }
} catch (error) {
    core.setFailed(error.message);
}
