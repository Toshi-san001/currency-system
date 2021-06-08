/**
 * @author Silent-Coder
 * @license Apache-2.0
 * @copyright Silent-Coder
 * @file index.js
 */

'use strict';
const db = require("mongoose");
const cs = require("./models/currency");
const inv = require('./models/inventory');
const Discord = require("discord.js")

/**
 * @class CurrencySystem
 */
class CurrencySystem {
    constructor() {
        this.wallet = 0;
        this.bank = 0;
    }

    setDefaultWalletAmount(amount) {
        if (parseInt(amount)) this.wallet = amount || 0;
    }
    setDefaultBankAmount(amount) {
        if (parseInt(amount)) this.bank = amount || 0;
    }
    setMongoURL(password) {
        if (!password.startsWith("mongodb+srv")) throw new TypeError("Invalid MongoURL");
        let connected = true;
        db.connect(password, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch(e => {
            connected = false;
            throw new TypeError(`${e}`);
        }).then(() => {
            if (connected === true) console.info("Connected to DB successfully.")
        });
    };

    async gamble(settings) {

        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        const money = settings.amount;
        const result = Math.floor(Math.random() * 10);
        const balance = data.wallet;
        let lastGamble = data.lastGamble;
        let cooldown = settings.cooldown || 5;
        cooldown = cooldown * 1000;
        if (!parseInt(money)) return {
            error: true,
            type: 'amount'
        };
        if (isNaN(parseInt(money))) return {
            error: true,
            type: 'nan'
        };
        if (parseInt(money) > balance || !balance || balance === 0) return {
            error: true,
            type: 'low-money',
            neededMoney: balance - parseInt(money)
        };
        if (parseInt(money) < settings.minAmount || 0) return {
            error: true,
            type: 'gamble-limit',
            minAmount: settings.minAmount || 0
        };
        if (lastGamble !== null && cooldown - (Date.now() - lastGamble) / 1000 > 0) return {
            error: true,
            type: 'time',
            second: parseSeconds(Math.floor(cooldown - (Date.now() - lastGamble) / 1000))
        };

        if (result < 5) {
            data.lastGamble = Date.now();
            data.wallet = data.wallet - parseInt(money);
            return {
                error: false,
                type: 'lost',
                amount: parseInt(money),
                wallet: data.wallet
            };
        } else if (result > 5) {
            data.lastGamble = Date.now();
            data.wallet = (data.wallet + parseInt(money));
            return {
                error: false,
                type: 'won',
                amount: parseInt(money),
                wallet: data.wallet
            };
        };
        saveUser(data);
    };


    async withdraw(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        const money = settings.amount;
        const bank = data.bank;

        if (!money) return {
            error: true,
            type: 'money'
        };
        if (money.includes('-')) return {
            error: true,
            type: 'negative-money'
        };
        if (bank < parseInt(money)) return {
            error: true,
            type: 'low-money'
        };

        if (money === 'all') {
            if (bank === 0) return {
                error: true,
                type: 'no-money'
            }
            data.wallet = data.wallet + data.bank;
            data.bank = 0;
            await saveUser(data);
            return {
                error: false,
                type: 'all-success'
            }

        } else {

            data.wallet = data.wallet + parseInt(money);
            data.bank = data.bank - parseInt(money);
            await saveUser(data);
            return {
                error: false,
                type: 'success',
                amount: parseInt(money)
            };
        }
    };

    /**
     * 
     * @param {object} settings  
     */


    async deposite(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        const money = settings.amount;
        const wallet = data.wallet;

        if (!money) return {
            error: true,
            type: 'money'
        };
        if (money.includes('-')) return {
            error: true,
            type: 'negative-money'
        };
        if (parseInt(money) > wallet) return {
            error: true,
            type: 'low-money'
        };


        if (money === 'all') {

            if (wallet === 0) return {
                error: true,
                type: 'no-money'
            }

            data.bank = data.wallet + data.bank;
            data.wallet = 0;
            await saveUser(data);
            return {
                error: false,
                type: 'all-success'
            }


        } else {

            data.wallet = data.wallet - parseInt(money);
            data.bank = data.bank + parseInt(money);
            await saveUser(data);
            return {
                error: false,
                type: 'success',
                amount: parseInt(money)
            };

        }
    };

    /**
     * 
     * @param {object} settings  
     */


    async balance(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        return {
            bank: data.bank,
            wallet: data.wallet
        }
    };

    /**
     * 
     * @param {object} settings  
     */


    async leaderboard(guildid, sortBy = 'bank') {
        let data = await cs.find({
            guildID: guildid
        }).sort([
            [sortBy, 'descending']
        ]).exec();
        return data;
    };
    async globalLeaderboard(sortBy = 'bank') {
        let data = await cs.find().sort([
            [sortBy, 'descending']
        ]).exec();
        return data;
    };

    /**
     * 
     * @param {object} settings  
     */


    async work(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        let lastWork = data.lastWork;
        let timeout = settings.cooldown;
        if (lastWork !== null && timeout - (Date.now() - lastWork) / 1000 > 0) return {
            error: true,
            type: 'time',
            time: parseSeconds(Math.floor(timeout - (Date.now() - lastWork) / 1000))
        };
        else {

            let amountt = Math.floor(Math.random() * settings.maxAmount || 100) + 1;
            data.lastWork = Date.now();
            data.wallet = data.wallet + amountt;
            await saveUser(data);
            let result = Math.floor((Math.random() * settings.replies.length));
            return {
                error: false,
                type: 'success',
                workType: settings.replies[result],
                amount: amountt
            };

        };
    };
    /**
     * 
     * @param {object} settings  
     */


    async monthly(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        let monthly = data.lastMonthly;
        let timeout = 2.592e+6;
        if (monthly !== null && timeout - (Date.now() - monthly) / 1000 > 0) return {
            error: true,
            type: 'time',
            time: parseSeconds(Math.floor(timeout - (Date.now() - monthly) / 1000))
        };
        else {
            data.lastMonthly = Date.now();
            data.wallet = data.wallet + settings.amount;
            await saveUser(data);

            return {
                error: false,
                type: 'success',
                amount: settings.amount
            };

        };
    };
    /**
     * 
     * @param {object} settings  
     */


    async weekly(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        let weekly = data.lastWeekly;
        let timeout = 604800;
        if (weekly !== null && timeout - (Date.now() - weekly) / 1000 > 0) return {
            error: true,
            type: 'time',
            time: parseSeconds(Math.floor(timeout - (Date.now() - weekly) / 1000))
        };
        else {
            data.lastWeekly = Date.now();
            data.wallet = data.wallet + settings.amount;
            await saveUser(data);

            return {
                error: false,
                type: 'success',
                amount: settings.amount
            };

        };
    };

    /**
     * 
     * @param {object} settings  
     */


    async quaterly(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        let quaterly = data.lastQuaterly;
        let timeout = 21600;
        if (quaterly !== null && timeout - (Date.now() - quaterly) / 1000 > 0) return {
            error: true,
            type: 'time',
            time: parseSeconds(Math.floor(timeout - (Date.now() - quaterly) / 1000))
        };
        else {
            data.lastQuaterly = Date.now();
            data.wallet = data.wallet + settings.amount;
            await saveUser(data);

            return {
                error: false,
                type: 'success',
                amount: settings.amount
            };

        };
    };
    /**
     * 
     * @param {object} settings  
     */


    async daily(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        let daily = data.lastDaily;
        let timeout = 86400;
        if (daily !== null && timeout - (Date.now() - daily) / 1000 > 0) return {
            error: true,
            type: 'time',
            time: parseSeconds(Math.floor(timeout - (Date.now() - daily) / 1000))
        };
        else {
            data.lastDaily = Date.now();
            data.wallet = data.wallet + settings.amount;
            await saveUser(data);

            return {
                error: false,
                type: 'success',
                amount: settings.amount
            };

        };
    };

    /**
     * 
     * @param {object} settings  
     */


    async hourly(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        let lastHourly = data.lastHourly;
        let timeout = 3600;
        if (lastHourly !== null && timeout - (Date.now() - lastHourly) / 1000 > 0) return {
            error: true,
            type: 'time',
            time: parseSeconds(Math.floor(timeout - (Date.now() - lastHourly) / 1000))
        };
        else {
            data.lastHourly = Date.now();
            data.wallet = data.wallet + settings.amount;
            await saveUser(data);

            return {
                error: false,
                type: 'success',
                amount: settings.amount
            };

        };
    };

    /**
     * 
     * @param {object} settings  
     */


    async rob(settings) {
        if (!settings.guild) settings.guild = {
            id: null
        }
        let user1 = await findUser(settings)
        if (!user1) user1 = await makeUser(this, settings);

        let user2 = await cs.findOne({
            userID: settings.user2.id,
            guildID: settings.guild.id || false
        });
        if (!user2) user2 = await makeUser(this, settings, true)

        let lastRob = user1.lastRob;
        let timeout = settings.cooldown;

        if (lastRob !== null && timeout - (Date.now() - lastRob) / 1000 > 0) return {
            error: true,
            type: 'time',
            time: parseSeconds(Math.floor(timeout - (Date.now() - lastRob) / 1000))
        };

        if (user1.wallet < settings.minAmount) return {
            error: true,
            type: 'low-money',
            minAmount: settings.minAmount
        };
        if (user2.wallet < settings.minAmount) return {
            error: true,
            type: 'low-wallet',
            user2: settings.user2,
            minAmount: settings.minAmount
        };

        let random = Math.floor(Math.random() * 1000) + 1; // random number 200-1, you can change 200 to whatever you'd like
        if (random > user2.wallet) random = user2.wallet;

        // 5 here is percentage of success.
        if (testChance(settings.successPercentage || 5)) {
            // Success!

            user2.wallet = user2.wallet - random;
            user1.wallet = user1.wallet + random;
            await saveUser(user1);
            await saveUser(user2);
            return {
                error: false,
                type: 'success',
                user2: settings.user2,
                minAmount: settings.minAmount,
                amount: random
            };

        } else {
            // Fail :(

            user2.wallet = user2.wallet + random;
            user1.wallet = user1.wallet - random;
            await saveUser(user1);
            await saveUser(user2);
            return {
                error: true,
                type: 'caught',
                user2: settings.user2,
                minAmount: settings.minAmount,
                amount: random
            };
        };

    };
    /**
     * 
     * @param {object} settings  
     */


    async beg(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);

        let beg = data.lastBegged; // XDDDD
        let timeout = 240;
        if (beg !== null && timeout - (Date.now() - beg) / 1000 > 0) return {
            error: true,
            type: 'time',
            time: parseSeconds(Math.floor(timeout - (Date.now() - beg) / 1000))
        };
        else {
            let amountt = Math.floor(Math.random() * (settings.maxAmount || 400)) + (settings.minAmount || 200)
            data.lastBegged = Date.now();
            data.wallet = data.wallet + amountt;
            await saveUser(data);

            return {
                error: false,
                type: 'success',
                amount: amountt
            };

        };
    };
    /**
     * 
     * @param {object} settings  
     */


    async addMoney(settings) {
        let data = await findUser(settings);
        if (!data) data = await makeUser(this, settings);
        if (String(settings.amount).includes("-")) return {
            error: true,
            type: 'negative-money'
        };
        let amount = parseInt(settings.amount) || 0;
        let wheretoPutMoney = data.wallet;
        if (settings.wheretoPutMoney === "bank") wheretoPutMoney = data.bank;
        else if (settings.wheretoPutMoney === "wallet") wheretoPutMoney = data.wallet;
        if (wheretoPutMoney === data.wallet) data.wallet += amount;
        if (wheretoPutMoney === data.bank) data.bank += amount;
        await saveUser(data);
        return {
            error: false,
            type: 'success'
        };
    };

    /**
     * 
     * @param {object} settings  
     */


    async removeMoney(settings) {
        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);
        if (String(settings.amount).includes("-")) return {
            error: true,
            type: 'negative-money'
        };
        let amount = parseInt(settings.amount) || 0;
        let wheretoPutMoney = data.wallet;
        if (settings.wheretoPutMoney === "bank") wheretoPutMoney = data.bank;
        else if (settings.wheretoPutMoney === "wallet") wheretoPutMoney = data.wallet;

        if (wheretoPutMoney === data.wallet) data.wallet -= amount;
        if (wheretoPutMoney === data.bank) data.bank -= amount;
        await saveUser(data);
        return {
            error: false,
            type: 'success'
        };
    };

    /**
     * 
     * @param {object} settings  
     */
    async transferMoney(settings) {
        if (!settings.guild) settings.guild = {
            id: null
        }
        let user1 = await findUser(settings)
        if (!user1) user1 = await makeUser(this, settings);

        let user2 = await cs.findOne({
            userID: settings.user2.id,
            guildID: settings.guild.id || false
        });
        if (!user2) user2 = await makeUser(this, settings, true)
        let money = parseInt(settings.amount)
        if (user1.wallet < money) return {
            error: true,
            type: 'low-money'
        };

        user1.wallet = user1.wallet - money;
        user2.wallet = user2.wallet + money;
        saveUser(user1);
        saveUser(user2);
        return {
            error: false,
            type: 'success',
            money: money,
            user2: settings.user2
        };
    }
    async buy(message, settings) {
        let inventoryData = await getInventory(settings);
        if (!inventoryData) inventoryData = await makeInventory(settings);

        let data = await findUser(settings)
        if (!data) data = await makeUser(this, settings);
        console.log(data.inventory)
       // console.log(inventoryData.inventory)
        let thing = parseInt(settings.item);
        if (!thing) return {
            error: true,
            type: 'Invalid-Item'
        };
        thing = thing - 1;
        if (!inventoryData.inventory[thing]) return {
            error: true,
            type: 'Invalid-Item'
        };

        message.channel.send(`Please type \`yes\` to confirm paying $${inventoryData.inventory[thing].price}`)
        let col = await message.channel.awaitMessages(msg => msg.author.id == message.author.id, {
            max: 1
        });
        if (col.first().content.toLowerCase() === 'yes') {
            if (data.wallet < inventoryData.inventory[thing].price) return message.channel.send(`**You don't have enough balance to buy this item!**`)
            else {
                data.wallet -= inventoryData.inventory[thing].price;
                let done = false;
                for (let i = 0; i < inventoryData.inventory.length; i++) {
                    for (let j = 0; j < data.inventory.length; j++) {
                        if (inventoryData.inventory[i].name === data.inventory[j].name) {
                            data.inventory[j].amount++
                            done = true;
                            console.log('added amount')
                        }
                    }
                }


                if (done == false) {
                    console.log('made item')
                    data.inventory.push({
                        name: inventoryData.inventory[thing].name,
                        amount: 1
                    });
                }

                await saveUser(data);
                await saveUser(inventoryData)
                console.log(data)
                message.channel.send(`**Successfully bought  \`${inventoryData.inventory[thing].name}\` for $${inventoryData.inventory[thing].price}**`)
            }

        } else message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription('**Purchase Cancelled!**'))
    }
    /* async addItem(settings) {
        let user1 = await findUser(settings)
        if (!user1) user1 = await makeUser(this, settings);

        let user2 = await cs.findOne({
            userID: settings.user2.id,
            guildID: settings.guild.id
        });
        if (!user2) user2 = await makeUser(this, settings, true)
        
    }; */
};


module.exports = CurrencySystem;
async function findUser(settings) {
    if (!settings.guild) settings.guild = {
        id: null
    }
    let find = await cs.findOne({
        userID: settings.user.id,
        guildID: settings.guild.id || null
    });
    return find;
};
async function getInventory(settings) {
    if (!settings.guild) settings.guild = {
        id: null
    }
    let find = await inv.findOne({
        guildID: settings.guild.id || null
    });
    return find;
};
async function makeInventory(settings) {
    if (!settings.guild) settings.guild = {
        id: null
    }
    const inventory = new inv({
        guildID: settings.guild.id || null,
        inventory: []
    });
    await saveUser(inventory);
    return inventory;
};
async function makeUser(that, settings, user2 = false) {
    if (!settings.guild) settings.guild = {
        id: null
    }
    let user = settings.user.id
    if (user2) user = settings.user2.id;
    const newUser = new cs({
        userID: user,
        guildID: settings.guild.id || fanulllse,
        wallet: that.wallet || 0,
        bank: that.bank || 0
    });
    await saveUser(newUser);
    return newUser;

};
async function saveUser(data) {
    await data.save().catch(e => {
        throw e;
    });
};
// This is for Rob Command
function testChance(successPercentage) {
    let random2 = Math.random() * 10;
    return ((random2 -= successPercentage) < 0);
}

function parseSeconds(seconds) {
    let days = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);

    if (days) {
        return `${days} day, ${hours} hours, ${minutes} minutes`
    } else if (hours) {
        return `${hours} hours, ${minutes} minutes, ${seconds} seconds`
    } else if (minutes) {
        return `${minutes} minutes, ${seconds} seconds`
    }

    return `${seconds} second(s)`
}