const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {

    let result = await cs.weekly({
        user: message.user,
        guild: message.member.guild,
        amount: 100,

    });
    if (result.error) return message.reply(`You have used weekly recently Try again in ${result.time}`);
    else message.reply(`You have earned $${result.amount}.`)
}

exports.help = {
    name: "weekly",
    data: {
        name: 'weekly',
        description: "a way to earn money, weekly",
        options: []
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}