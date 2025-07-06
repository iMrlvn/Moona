const cron = require('node-cron')
const Premium = require("../../schema/Premium.js");

module.exports = async (client) => {
    cron.schedule('*/60 * * * * *', async () => {
        await Premium.find({ isPremium: true }, handle);
    })
};

async function handle(error, users) {
    if (error) console.error("Load Premium ›", error);

    if (users && users.length) {
        for (let user of users) {
            if (Date.now() >= user.premium.expiresAt) {

                user.isPremium = false
                user.premium.redeemedBy = []
                user.premium.redeemedAt = null
                user.premium.expiresAt = null
                        user.premium.plan = null

                await user.save({ new: true }).catch(() => {})
            }
        }
    }
}