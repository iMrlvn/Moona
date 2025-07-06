const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Premium = require("../../schema/Premium.js");
const Profile = require("../../schema/Profile.js");
const Canvas = require("@napi-rs/canvas");

const formatTime = require("../../utils/FormatTime.js");

module.exports = {
    name: ["profile"],
    description: "View your premium profile!",
    category: "Premium",
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });
        
        const info = await Premium.findOne({ Id: ci.user.id });
        const timeLeft = formatTime(info.premium.expiresAt - Date.now());
        const profile = await Profile.findOne({ userId: ci.user.id });
        const listenTime = formatTime(profile.listenTime);

        const canvas = Canvas.createCanvas(1000, 625);
		const ctx = canvas.getContext('2d');

        const placer = await Canvas.loadImage("./assets/image/chart.png");
        ctx.drawImage(placer, 5, 5, canvas.width, canvas.height);

        // draw black blur background
        ctx.fillStyle = '#000001';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(20, 250, 955, 350);
        ctx.globalAlpha = 1;

        ctx.font = 'bold 50px Verdana';
        ctx.fillStyle = '#ffffff';
        ctx.fillText("Profile", 250, 70);

        let listen = "";

        if (profile.listenTime === 0) {
            listen = "No Listen Time";
        } else {
            listen = listenTime;
        }

        let plan = "";
        let expire = "";

        if (info.premium.plan === "lifetime") {
            plan = toOppositeCase(info.premium.plan);
            expire = "Never";
        } else {
            plan = toOppositeCase(info.premium.plan || "Free");
            if (info.premium.expiresAt < Date.now()) {
                expire = "Never";
            } else {
                expire = timeLeft;
            }
        }

        ctx.font = 'bold 25px Verdana';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• ${ci.user.tag} | ${plan} (${expire})`, 280, 110);

        ctx.font = '25px Verdana';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Songs Played: ${profile.playedCount}`, 250, 150);

        ctx.font = '25px Verdana';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Commands Used: ${profile.useCount}`, 250, 190);

        ctx.font = '25px Verdana';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Listen Time: ${listen}`, 250, 230);

        // sort
        const sorted = profile.playedHistory.sort((a, b) => b.track_count - a.track_count);
        // 10 
        const top10 = sorted.slice(0, 5);

        ctx.font = 'bold 25px Verdana';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Top 5 Songs`, 50, 290);

        ctx.font = '25px Verdana';
        ctx.fillStyle = '#ffffff';
        // desc
        top10.map((d, i) => {
            // font exceeds canvas height
            if (ctx.measureText(d.track_title).width > 700) {
                const title = d.track_title.substring(0, 50);
                ctx.fillText(`${i + 1} | Played: ${d.track_count} • ${title}...`, 50, 340 + (i * 60));
            } else {
                ctx.fillText(`${i + 1} | Played: ${d.track_count} • ${d.track_title}`, 50, 340 + (i * 60));
            }
        });

        ///
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        // stoke style bold
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#FB97F1';
        ctx.stroke();
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(ci.user.displayAvatarURL({ format: 'png' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'chart.png' });

        return ci.editReply({ files: [attachment] });
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}