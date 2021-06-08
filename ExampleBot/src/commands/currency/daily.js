const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {

    let result = await cs.daily({
        user: message.author,
        guild: message.guild,
        amount: 100,

    });
    if (result.error) return message.channel.send(`You have used daily recently Try again in ${result.time}`);
    else message.channel.send(`You have earned $${result.amount}.`)
}

exports.help = {
    name: "daily",
    description: "a way to earn money, daily",
    example: "daily",
    usage: "daily"
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}