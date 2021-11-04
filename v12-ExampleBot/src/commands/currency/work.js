    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    exports.run = async (client, message, args) => {

        let result = await cs.work({
            user: message.author,
            guild: message.guild,
            maxAmount: 100,
            replies: ['Programmer', 'Builder', 'Waiter', 'Busboy', 'Chief', 'Mechanic'],
            cooldown: 25 //25 seconds,

        });
        if (result.error) return message.channel.send(`You have already worked recently Try again in ${result.time}`);
        else message.channel.send(`You worked as a ${result.workType} and earned $${result.amount}.`)
    }

    exports.help = {
        name: "work",
        description: "to earn money",
        example: "work",
        usage: "work"
    };

    exports.conf = {
        aliases: ["wk", "wr"],
        cooldown: 5 // This number is a seconds, not a milliseconds.
        // 1 = 1 seconds.
    }