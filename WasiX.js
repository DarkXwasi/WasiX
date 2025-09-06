//================== Dependencies ==================//
const moment = require("moment-timezone");
const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require("WasiX-fca"); 
const axios = require("axios");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules;

//================== Global Objects ==================//
global.client = {
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    eventRegistered: [],
    handleSchedule: [],
    handleReaction: [],
    handleReply: [],
    mainPath: process.cwd(),
    configPath: "",
    getTime: function (option) {
        switch (option) {
            case "seconds": return `${moment.tz("Asia/Kolkata").format("ss")}`;
            case "minutes": return `${moment.tz("Asia/Kolkata").format("mm")}`;
            case "hours": return `${moment.tz("Asia/Kolkata").format("HH")}`;
            case "date": return `${moment.tz("Asia/Kolkata").format("DD")}`;
            case "month": return `${moment.tz("Asia/Kolkata").format("MM")}`;
            case "year": return `${moment.tz("Asia/Kolkata").format("YYYY")}`;
            case "fullHour": return `${moment.tz("Asia/Kolkata").format("HH:mm:ss")}`;
            case "fullYear": return `${moment.tz("Asia/Kolkata").format("DD/MM/YYYY")}`;
            case "fullTime": return `${moment.tz("Asia/Kolkata").format("HH:mm:ss DD/MM/YYYY")}`;
        }
    }
};

global.data = {
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: [],
    allUserID: [],
    allCurrenciesID: [],
    allThreadID: []
};

global.utils = require("./utils");
global.nodemodule = {};
global.config = {};
global.configModule = {};
global.moduleData = [];
global.language = {};

//================== Load Config ==================//
let configValue;
try {
    global.client.configPath = join(global.client.mainPath, "config.json");
    configValue = require(global.client.configPath);
    logger.loader("Found file config: config.json");
} catch {
    if (existsSync(global.client.configPath.replace(/\.json/g,"") + ".temp")) {
        configValue = readFileSync(global.client.configPath.replace(/\.json/g,"") + ".temp");
        configValue = JSON.parse(configValue);
        logger.loader(`Found: ${global.client.configPath.replace(/\.json/g,"") + ".temp"}`);
    } else return logger.loader("config.json not found!", "error");
}

for (const key in configValue) global.config[key] = configValue[key];
logger.loader("Config Loaded!");

writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), 'utf8');

//================== Load Language ==================//
const langFile = readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, { encoding: 'utf-8' })
    .split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (!global.language[head]) global.language[head] = {};
    global.language[head][key] = value;
}

global.getText = function (...args) {
    const langText = global.language;    
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
    let text = langText[args[0]][args[1]];
    for (let i = args.length - 1; i > 0; i--) {
        const regEx = RegExp(`%${i}`, 'g');
        text = text.replace(regEx, args[i + 1]);
    }
    return text;
}

//================== Load AppState ==================//
let appStateFile, appState;
try {
    appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
    appState = require(appStateFile);
    logger.loader(global.getText("WasiX", "foundPathAppstate"));
} catch {
    return logger.loader(global.getText("WasiX", "notFoundPathAppstate"), "error");
}

//================== Login & Start Bot ==================//
function onBot({ models: botModel }) {
    const loginData = { appState };
    login(loginData, async (loginError, loginApiData) => {
        if (loginError) return logger(JSON.stringify(loginError), "ERROR");
        loginApiData.setOptions(global.config.FCAOption);
        writeFileSync(appStateFile, JSON.stringify(loginApiData.getAppState(), null, '\x09'));
        global.client.api = loginApiData;
        global.config.version = '1.2.14';
        global.client.timeStart = new Date().getTime();

        //================== Load Commands ==================//
        const listCommand = readdirSync(global.client.mainPath + '/WasiX/commands')
            .filter(command => command.endsWith('.js') && !global.config.commandDisabled.includes(command));

        for (const command of listCommand) {
            try {
                const module = require(global.client.mainPath + '/WasiX/commands/' + command);
                if (!module.config || !module.run || !module.config.commandCategory) 
                    throw new Error(global.getText('WasiX', 'errorFormat'));
                if (global.client.commands.has(module.config.name || '')) 
                    throw new Error(global.getText('WasiX', 'nameExist'));
                global.client.commands.set(module.config.name, module);
                logger.loader(global.getText('WasiX', 'successLoadModule', module.config.name));
            } catch (error) {
                logger.loader(global.getText('WasiX', 'failLoadModule', command, error), 'error');
            }
        }

        //================== Load Events ==================//
        const events = readdirSync(global.client.mainPath + '/WasiX/events')
            .filter(ev => ev.endsWith('.js') && !global.config.eventDisabled.includes(ev));

        for (const ev of events) {
            try {
                const event = require(global.client.mainPath + '/WasiX/events/' + ev);
                if (typeof event === "function") event();
                if (event.handleEvent && typeof event.handleEvent === "function") {
                    global.client.eventRegistered.push(ev);
                }
                logger.loader(global.getText('WasiX', 'successLoadModule', ev));
            } catch (error) {
                logger.loader(global.getText('WasiX', 'failLoadModule', ev, error), 'error');
            }
        }
    });
}

//================== Export Bot ==================//
module.exports = { onBot };