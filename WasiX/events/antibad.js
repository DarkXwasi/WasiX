module.exports.config = {
  name: "antibad",
  version: "2.2.0",
  hasPermssion: 1,
  credits: "Waseem Abbasi",
  description: "Auto warn & remove members if they use bad words",
  commandCategory: "group",
  usages: "antibad on/off",
  cooldowns: 2
};

// 🔥 Expanded Gali List
const badwords = [
  "bhosdike","madarchod","behenchod","chutiya","harami",
  "kutte","randi","fuck","motherfucker","bsdk","gandu",
  "mc","mkc","bkl","bhen ke lode","chudwa","lund","gaand",
  "chod","gashti","raand","tatte","launde","betichod","lodu",
  "loda","lode","gaandfat","kutta","dog","slut","whore","bitch","hoe"
];

let antibadStatus = {};
let warnings = {};

// 👑 Owner exempt UID
const OWNER_UID = "100091680625364";

module.exports.handleEvent = async function({ api, event }) {
  if (!event.body) return;
  const threadID = event.threadID;
  const userID = event.senderID;
  const msg = event.body.toLowerCase();

  // Check if antibad enabled
  if (!antibadStatus[threadID]) return;

  // Ignore owner
  if (userID === OWNER_UID) return;

  // Check gali
  if (badwords.some(word => msg.includes(word))) {
    if (!warnings[threadID]) warnings[threadID] = {};
    if (!warnings[threadID][userID]) warnings[threadID][userID] = 0;

    warnings[threadID][userID]++;

    // ⚠️ First warning
    if (warnings[threadID][userID] === 1) {
      return api.sendMessage(
        `⚠️ @${event.senderID}\nTumhari zubaan par control rakho.\nYe pehla warning hai – agla step seedha removal hoga.`,
        threadID,
        event.messageID
      );
    } 
    // 🚫 Second time remove
    else if (warnings[threadID][userID] >= 2) {
      try {
        api.removeUserFromGroup(userID, threadID, (err) => {
          if (err) {
            api.sendMessage("⚠️ User ko remove karne me error aaya.", threadID);
          } else {
            api.sendMessage(
              `🚫 @${event.senderID}\nTumhari galiyan bardasht se bahar ho gayi.\nIs wajah se tumhe group se nikal diya gaya hai.`,
              threadID
            );
          }
        });
        warnings[threadID][userID] = 0; // reset
      } catch (e) {
        console.log(e);
      }
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;

  if (args[0] === "on") {
    antibadStatus[threadID] = true;
    return api.sendMessage("✅ Anti-badword system ON kar diya gaya.", threadID);
  } 
  else if (args[0] === "off") {
    antibadStatus[threadID] = false;
    return api.sendMessage("❌ Anti-badword system OFF kar diya gaya.", threadID);
  } 
  else {
    return api.sendMessage("ℹ️ Use: antibad on/off", threadID);
  }
};