// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

const core = require("@actions/core");
const fs = require("fs");

try {
    const originTestEnabled = core.getInput("originTestEnabled");
    console.log(`Testing for origin is${originTestEnabled ? " " : " not "}enabled`);

    const workingDirectory = core.getInput("workingDirectory");

    let entries = fs.readdirSync(workingDirectory);

    console.log(entries);
} catch (error) {
    core.setFailed(error.message);
}