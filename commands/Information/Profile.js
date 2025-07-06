const { ApplicationCommandOptionType, AttachmentBuilder, Colors } = require('discord.js');
const CT = require("../../utils/ConvertTime.js");
const Premium = require("../../schema/Premium.js");
const Profile = require("../../schema/Profile.js");

const { Canvas, loadImage } = require("canvas-constructor/napi-rs");
const { request } = require('undici');

var KColors = {};
for (const c of Object.entries(Colors)) {
    KColors[c[0]] = '#'+c[1].toString(16);
};

module.exports = {
    name: ["profile"],
    description: "View user profile stats",
    category: "Information",
    options: [{
        name: "user",
        description: "Select the user whose profile you want to view",
        type: ApplicationCommandOptionType.User
    }],
    clientPermissions:["AttachFiles"],
    async execute(ci) {
        await ci.deferReply({ ephemeral: false });

        let target = ci.args[0];
        if (!target) target = ci.user;
        if (target && target.bot) {
            await ci.followUp('Bot don\'t have profile! So, I will continue to generating your profile.');
            target = ci.user;
        };

        const { body } = await request(target.displayAvatarURL({ extension: 'png', size: 1024, forceStatic: true }));

        var info = await Premium.findOne({ Id: target.id });
        var profile = await Profile.findOne({ userId: target.id });
        if (!info) info = {};
        if (!profile) profile = {};
        //const listenTime = CT.format(profile.listenTime);

        const background = await loadImage("./assets/image/background.png")
            ;
        const radius = (x=0) =>
            ({ tr: x, tl: x, br: x, bl: x });
            
        const canvas = new Canvas(1000, 625);
        canvas.printRoundedImage(background, 0, 0, canvas.width, canvas.height, radius(10));
        
        // draw black blur rectangular background
        canvas.setColor(KColors.NotQuiteBlack)
        .setGlobalAlpha(0.5)
        .printRoundedRectangle(20, 250, 955, 350, radius(20))
        .setGlobalAlpha(1);

        // draw black blur avatar
        canvas.setColor(KColors.NotQuiteBlack)
        .setGlobalAlpha(0.5)
        .printRoundedRectangle(20, 20, 215, 215, radius(20))
        .setGlobalAlpha(1);

        // draw user plan
        const userPlan = "BASIC";
        canvas.setColor(KColors.DarkGreen)
            .printRoundedRectangle(250, 160, canvas.measureText(userPlan).width + 120, 40, radius(5))
            .setColor(KColors.White)
            .setTextFont('30px Rubik-Medium')
            .printText(userPlan, 265, 190);

        const username = target.globalName ? (target.globalName.length > 18 ? subText(target.globalName, 15) : target.globalName) : (target.username.length > 18 ? subText(target.username, 15) : target.username);

        /*canvas.setColor('black')
        .setGlobalAlpha(0.5)
        .printRoundedRectangle(250, 60, 100 + ctx.measureText(plan).width, 60, radius)
        .setGlobalAlpha(1);*/

        if (target?.globalName) {
            canvas.setColor(KColors.White)
                .setTextFont('55px Rubik-Bold, NotoColorEmoji')
                .printText(username, 250, 70+30);
            canvas.setColor(KColors.Greyple)
                .setTextFont('35px Rubik, NotoColorEmoji')
                .printText('@'+subText(target.username, 18), 250, 70+70);
        } else {
            canvas.setColor(KColors.White)
                .setTextFont('55px Rubik-Bold, NotoColorEmoji')
                .printText(username, 250, 70 + 70);
        }

        /*let listen = "";

        if (profile.listenTime === 0) {
            listen = "No Listen Time";
        } else {
            listen = listenTime;
        }

        let plan = "";
        let expire = "";

        if (info.premium.plan === "lifetime") {
            plan = toOppositeCase(info.premium.plan);
            expire = "Unlimited";
        } else {
            plan = toOppositeCase(info.premium.plan || "FREE");
            if (info.premium.expiresAt < Date.now()) {
                expire = "Never Expired";
            } else {
                expire = info.premium.expiresAt;
            }
        }

        ctx.font = 'bold 30px Rubik-Regular';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(plan, 250.5, 110);

        ctx.font = '30px Rubik-Regular';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Songs Played: ${profile.playedCount.toLocaleString().replaceAll(",", ".")}x`, 250, 150);

        ctx.font = '30px Rubik-Regular';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Commands Used: ${profile.useCount.toLocaleString().replaceAll(",", ".")}x`, 250, 190);

        ctx.font = '30px Rubik-Regular';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`• Total Played: ${profile.playedCount.toLocaleString().replaceAll(",", ".")}x (${listen})`, 250, 230);*/

        const avatar = await loadImage(await body.arrayBuffer());
        canvas.printRoundedImage(avatar, 30, 30, 195.5, 195.5, radius(5));

        // sort
        const sorted = profile.playedHistory.sort((a, b) => b.track_count - a.track_count);
        // 10 
        const top10 = sorted.slice(0, 5)[0] ? sorted.slice(0, 5) : null;

        // desc
        var numb = 0;
        if (!top10) {
            canvas.beginPath()
                .setColor(KColors.LightGrey)
                .setTextAlign('center')
                .setTextFont('italic 30px PTSansCaption')
                .printText('History Not Found!', canvas.width / 2, canvas.height - 200)
                .closePath();
        } else {
            top10.forEach((d, i=0) => {
                canvas.setColor(KColors.White)
                    .setTextFont('30px Rubik-Bold')
                    .printText(`TOP SONGS`, 40, 290);

                const topcolor = [
                    KColors.DarkGold,
                    KColors.DarkGrey,
                    KColors.DarkOrange,
                    KColors.DarkButNotBlack,
                    KColors.DarkButNotBlack
                ];
                canvas.setColor(topcolor[numb++])
                    .printRoundedRectangle(40, 300 + (i * 60),50, 50, radius(5))
                canvas.setColor(KColors.White)
                    .setTextFont("30px Rubik, NotoColorEmoji")
                    .printText((i+1).toString(), 55, 340 + (i * 60))
                canvas.setColor(KColors.LightGrey)
                    .setTextFont('30px Rubik-Medium')
                    .printText(`${d.track_count}x`, 100, 340 + (i * 60));
                if (canvas.measureText(d.track_title).width > 700) {
                    let cutLength = 52;
                    if (d.track_title === d.track_title.toUpperCase()) {
                        cutLength = cutLength - 7;
                    }
                    canvas.setColor(KColors.White)
                        .setTextFont('30px Rubik, NotoColorEmoji')
                        .printText(`${subText(d.track_title, cutLength)}`, (Number(d.track_count) > 9 ? 160 : 145), 340 + (i * 60));
                } else {
                    canvas.setColor(KColors.White)
                        .setTextFont('30px Rubik, NotoColorEmoji')
                        .printText(`${d.track_title}`, (Number(d.track_count) > 9 ? 160 : 145), 340 + (i * 60));
                }
            });
        };

        const credits = `MOONA BOT`;
        canvas.setTextAlign('right')
            .setTextFont('20px Rubik-Bold');

        canvas.setColor(KColors.Blurple)
            .printRoundedRectangle(canvas.width - canvas.measureText(credits).width - 45.5, 0, canvas.measureText(credits).width + 20, 35, { tr: 0, tl: 0, br: 10, bl: 10 })

        canvas.setColor(KColors.White)
            .printText(credits, canvas.width - 35.5, 25);

        const attachment = new AttachmentBuilder(await canvas.png(), { name: 'profile.png' });

        return ci.editReply({ files: [attachment] });
    }
}

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}