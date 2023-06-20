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
