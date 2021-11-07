const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {

    let result = await cs.yearly({
        user: message.author,
        guild: message.guild,
        amount: 27000,

    });
    if (result.error) return message.channel.send(`You have used yearly recently Try again in ${result.time}`);
    else message.channel.send(`You have earned $${result.amount}.`)
}

exports.help = {
    name: "yearly",
    description: "a way to earn money, yearly",
    example: "yearly",
    usage: "yearly"
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}