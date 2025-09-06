const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "memberEvent",
  eventType: ["log:subscribe", "log:unsubscribe"],
  version: "3.0.0",
  author: "Waseem Abbasi",
  description: "Custom Welcome & Goodbye with random online backgrounds",
};

// Random background generator (Unsplash)
async function getRandomBackground() {
  const url = "https://source.unsplash.com/1000x500/?abstract,dark,neon,galaxy,nature";
  return url; // Har bar nayi random image milti hai
}

module.exports.run = async function({ api, event }) {
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const groupName = threadInfo.threadName;
    const participantIDs = threadInfo.participantIDs;
    const memberCount = participantIDs.length;

    let id, userName;

    // 👥 Banda Add
    if (event.logMessageType === "log:subscribe") {
      for (const uid of event.logMessageData.addedParticipants.map(i => i.userFbId)) {
        id = uid;
        const userInfo = await api.getUserInfo(id);
        userName = userInfo[id].name;

        await generateImage({
          id,
          userName,
          groupName,
          memberCount,
          type: "welcome",
          api,
          event,
        });
      }
    }

    // 👋 Banda Leave
    else if (event.logMessageType === "log:unsubscribe") {
      id = event.logMessageData.leftParticipantFbId;
      const userInfo = await api.getUserInfo(id);
      userName = userInfo[id].name;

      await generateImage({
        id,
        userName,
        groupName,
        memberCount,
        type: "goodbye",
        api,
        event,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

async function generateImage({ id, userName, groupName, memberCount, type, api, event }) {
  const bgUrl = await getRandomBackground();
  const bgImg = await loadImage(bgUrl);
  const avatar = await loadImage(`https://graph.facebook.com/${id}/picture?height=512`);

  const canvas = createCanvas(1000, 500);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Profile Pic Circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(150, 250, 120, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 30, 130, 240, 240);
  ctx.restore();

  ctx.fillStyle = "#ffffff";

  if (type === "welcome") {
    ctx.font = "bold 40px Arial";
    ctx.fillText(`🎉 Welcome ${userName}!`, 300, 230);

    ctx.font = "28px Arial";
    ctx.fillText(`In group: ${groupName}`, 300, 280);
    ctx.fillText(`Member #${memberCount}`, 300, 330);
  } else {
    ctx.font = "bold 34px Arial";
    ctx.fillText(`💀 Shukar hai ek aur lash kam hui`, 300, 240);

    ctx.font = "30px Arial";
    ctx.fillText(`${userName} Romantic left 😂`, 300, 300);
  }

  ctx.font = "22px Arial";
  ctx.fillStyle = "#FFD700";
  ctx.fillText("Credit: WASEEM ABBASI", 700, 480);

  const filePath = path.join(__dirname, "cache", `${type}_${id}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filePath, buffer);

  api.sendMessage(
    {
      body: type === "welcome" ? `🎊 Welcome @${userName} 🎊` : `💔 Goodbye @${userName} 💔`,
      mentions: [{ tag: userName, id }],
      attachment: fs.createReadStream(filePath),
    },
    event.threadID,
    () => fs.unlinkSync(filePath)
  );
}