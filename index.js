const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");

///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve the index.html file
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Start the server and add error handling
app.listen(port, () => {
    logger(`Server is running on port ${port}...`, "[ Starting ]");
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        logger(`Permission denied. Cannot bind to port ${port}.`, "[ Error ]");
    } else {
        logger(`Server error: ${err.message}`, "[ Error ]");
    }
});

/////////////////////////////////////////////////////////
//========= Create start bot and make it loop =========//
/////////////////////////////////////////////////////////

// Initialize global restart counter
global.countRestart = global.countRestart || 0;

function startBot(message) {
    if (message) logger(message, "[ Starting ]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "WasiX.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    // Add more detailed error logging
    child.on("error", (error) => {
        logger(`Bot process error: ${error.stack || error.message}`, "[ Error ]");
    });

    // Add stdout and stderr handling for better debugging
    if (child.stdout) {
        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
    }

    if (child.stderr) {
        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    }

    child.on("close", (codeExit) => {
        if (codeExit !== 0) {
            logger(`Bot exited with code ${codeExit}`, "[ Exit ]");
            
            if (global.countRestart < 5) {
                global.countRestart += 1;
                logger(`Restarting... (${global.countRestart}/5)`, "[ Restarting ]");
                startBot();
            } else {
                logger(`Bot stopped after ${global.countRestart} restarts.`, "[ Stopped ]");
                logger("To see detailed errors, check the logs above or run the bot with 'node WasiX.js' directly", "[ Debug ]");
            }
        } else {
            logger("Bot process exited with code 0 (normal exit)", "[ Exit ]");
        }
    });
};

////////////////////////////////////////////////
//========= Check update from Github =========//
////////////////////////////////////////////////

// Load package.json info locally instead of from GitHub
try {
    const packageInfo = require('./package.json');
    logger(packageInfo.name, "[ NAME ]");
    logger(`Version: ${packageInfo.version}`, "[ VERSION ]");
    logger(packageInfo.description, "[ DESCRIPTION ]");
    
    // Try to check for updates, but don't stop the bot if it fails
    axios.get("https://raw.githubusercontent.com/codedbypriyansh/WasiX-Bot/main/package.json")
        .then((res) => {
            // Only log if successful, don't stop the bot if there's an error
            if (res.data && res.data.version) {
                logger(`Remote version: ${res.data.version}`, "[ UPDATE INFO ]");
            }
        })
        .catch((err) => {
            // Just log the error but continue with bot startup
            logger(`Update check failed: ${err.message}`, "[ Update Error ]");
        });
} catch (err) {
    // If local package.json can't be read, just log and continue
    logger(`Failed to load package info: ${err.message}`, "[ Error ]");
}

// Start the bot
startBot();