const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {
    const user = message.options.getUser('user') || message.user;

    let result = await cs.setBankSpace(user.id, message.member.guild.id,  message.options.getInteger('amount') || 0);
    if (result.error) return message.reply('Please provide number to setBank Limit to.');
    else return message.reply(`Successfully set Bank Limit of ${user.tag} to ${result.amount}`)

}

exports.help = {
    name: "setbankspace",
    data: {
        name: 'setbankspace',
        description: "A way to know the amount  of money in your bank.",
        options: [{
            name: 'user',
            type: 'USER',
            description: 'The user you want to set bank space of..',
            required: true,
        },{
            name: 'amount',
            type: 'INTEGER',
            description: 'Amount fo bank space you want to set.',
            required: true,
        }]
    }
}

exports.conf = {
    aliases: ["sets"],
    cooldown: 5
}