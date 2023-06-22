// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import core from "@actions/core";
import fs from "fs";

function originTest(path, keyword, fileExt) {
    let entries = fs.readdirSync(path);

    return entries.map((entry) => {
        const entryPath = `${path}/${entry}`;

        if (fs.lstatSync(entryPath).isDirectory()) {
            return originTest(entryPath, keyword, fileExt);
        } else {
            console.log(fileExt);
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

try {
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
            const msg = "No occurrence of origin found";
            core.error(msg);
            core.setFailed(msg);
        }
    }
} catch (error) {
    core.setFailed(error.message);
}
