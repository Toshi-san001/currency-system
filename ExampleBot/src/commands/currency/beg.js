const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {

    let result = await cs.beg({
        user: message.author,
        guild: message.guild,
        minAmount: 100,
        maxAmount: 400

    });
    if (result.error) return message.channel.send(`You have begged recently Try again in ${result.time}`);
    else message.channel.send(`You have earned $${result.amount}.`)
}

exports.help = {
    name: "beg",
    description: "a way to earn money, beg",
    example: "beg",
    usage: "beg"
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}