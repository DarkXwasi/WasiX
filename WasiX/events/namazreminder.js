
const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "namazReminder",
  version: "3.0.0",
  author: "Waseem Abbasi",
  description: "Daily 5 Namaz reminders with Qur’an Ayat + Translation + Random Islamic Image",
};

const TIMEZONE = "Asia/Karachi";

// Qur’an Ayats for each Namaz
const ayats = {
  Fajr: {
    arabic: "وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا",
    english: "And recite the Qur'an at dawn. Indeed, the recitation of dawn is ever witnessed. (17:78)"
  },
  Dhuhr: {
    arabic: "وَأَقِمِ ٱلصَّلَوٰةَ طَرَفَىِ ٱلنَّهَارِ وَزُلَفًۭا مِّنَ ٱلَّيْلِ",
    english: "Establish prayer at the two ends of the day and at the approach of the night. (11:114)"
  },
  Asr: {
    arabic: "وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    english: "By time, indeed mankind is in loss. (103:1-2)"
  },
  Maghrib: {
    arabic: "فَسُبْحَـٰنَ ٱللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ",
    english: "So exalt Allah when you reach the evening and when you reach the morning. (30:17)"
  },
  Isha: {
    arabic: "وَمِنَ ٱلَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةًۭ لَّكَ",
    english: "And during a part of the night, pray Tahajjud as an extra for you. (17:79)"
  }
};

// Random Islamic images (direct links)
const images = [
  "https://i.postimg.cc/3Nrfk6yQ/islamic1.jpg",
  "https://i.postimg.cc/K8q9wT4P/islamic2.jpg",
  "https://i.postimg.cc/7L2z7RkK/islamic3.jpg",
  "https://i.postimg.cc/Fs3zR6GQ/islamic4.jpg",
  "https://i.postimg.cc/T3F6H60J/islamic5.jpg"
];
function getRandomImage() {
  return images[Math.floor(Math.random() * images.length)];
}

// Fetch Bahawalpur timings daily
async function fetchTimings() {
  const res = await axios.get("https://api.aladhan.com/v1/timingsByCity", {
    params: { city: "Bahawalpur", country: "Pakistan", method: 1 }
  });
  const data = res.data.data.timings;
  return {
    Fajr: data.Fajr,
    Dhuhr: data.Dhuhr,
    Asr: data.Asr,
    Maghrib: data.Maghrib,
    Isha: data.Isha
  };
}

module.exports.run = async function({ api, event }) {
  try {
    const timings = await fetchTimings();

    for (const [namaz, time] of Object.entries(timings)) {
      const [hour, minute] = time.split(":");

      cron.schedule(`${minute} ${hour} * * *`, async () => {
        try {
          const ayat = ayats[namaz];
          const imageUrl = getRandomImage();
          const imgPath = path.join(__dirname, "cache", `${namaz}.jpg`);

          // Download random image
          const imgRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
          fs.writeFileSync(imgPath, Buffer.from(imgRes.data, "binary"));

          const text = `🕌 *${namaz} Namaz Reminder*\n⏰ Time: ${time} (${TIMEZONE})\n\n${ayat.arabic}\n_${ayat.english}_\n\n📌 Credit: 𝗪𝗮𝘀𝗲𝗲𝗺 𝗔𝗯𝗯𝗮𝘀𝗶`;

          api.sendMessage(
            {
              body: text,
              attachment: fs.createReadStream(imgPath)
            },
            event.threadID,
            () => {
              if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
            }
          );
        } catch (err) {
          console.error("Image fetch/send error:", err);
        }
      }, { timezone: TIMEZONE });
    }
  } catch (err) {
    console.error("Error fetching namaz timings:", err);
  }
};