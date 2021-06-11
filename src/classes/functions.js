const db = require("mongoose");
const cs = require("../models/currency");
const inv = require('../models/inventory');

let wallet;
let bank;

function setDefaultWalletAmount(amount) {
    if (parseInt(amount)) wallet = amount || 0;
}

function setDefaultBankAmount(amount) {
    if (parseInt(amount)) bank = amount || 0;
}

function connect(that) {
    let connected = true;
    db.connect(that, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch(e => {
        connected = false;
        throw new TypeError(`${e}`);
    }).then(() => {
        if (connected === true) console.info("Connected to DB successfully.")
    });
}
async function gamble(settings) {

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
    await saveUser(data);
};


async function withdraw(settings) {
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


async function deposite(settings) {
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


async function balance(settings) {
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


async function leaderboard(guildid, sortBy = 'bank') {
    let data = await cs.find({
        guildID: guildid
    }).sort([
        [sortBy, 'descending']
    ]).exec();
    return data;
};
async function globalLeaderboard(sortBy = 'bank') {

    let array = await cs.find();
    var output = [];
    array.forEach(function (item) {
        var existing = output.filter(function (v, i) {
            return v.userID == item.userID;
        });
        if (existing.length) {
            var existingIndex = output.indexOf(existing[0]);
            output[existingIndex].bank = output[existingIndex].bank + item.bank
            output[existingIndex].wallet = output[existingIndex].wallet + item.wallet
        } else {
            output.push(item);
        }
    });
    output.sort([
        [sortBy, 'descending']
    ]).exec()
    return output;
};

/**
 * 
 * @param {object} settings  
 */


async function work(settings) {
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


async function monthly(settings) {
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


async function weekly(settings) {
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


async function quaterly(settings) {
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


async function daily(settings) {
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


async function hourly(settings) {
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


async function rob(settings) {
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


async function beg(settings) {
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


async function addMoney(settings) {
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


async function removeMoney(settings) {
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
async function transferMoney(settings) {
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
};
async function getUserItems(settings) {
    let data = await findUser(settings)
    if (!data) data = await makeUser(this, settings);
    return {
        error: false,
        inventory: data.inventory
    };
};
async function getShopItems(settings) {
    let data = await getInventory(settings)
    if (!data) data = await makeInventory(this, settings);
    return {
        error: false,
        inventory: data.inventory
    };
};

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
};

// This is for Rob Command
function testChance(successPercentage) {
    let random2 = Math.random() * 10;
    return ((random2 -= successPercentage) < 0);
};
// Basic Functions
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
        guildID: settings.guild.id || null,
        wallet: that.wallet || 0,
        bank: that.bank || 0
    });
    await saveUser(newUser);
    return newUser;

};
async function saveUser(data) {
    await sleep(500)
    await data.save(function (err) {
        if (err) throw err;
    });
};

function updateInventory(mongoURL, newData, settings, collection = "inventory-currencies") {
    if (!settings.guild) settings.guild = {
        id: null
    };
    let query = {
        guildID: settings.guild.id || null,
    };
    if (settings.user) query = {
        userID: settings.user.id,
        guildID: settings.guild.id || null,
    }
    require('mongodb').MongoClient(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).connect(function (err, db) {
        if (err) throw err;
        db.db(mongoURL.split('/')[mongoURL.split('/').length - 1]).collection(collection).updateOne(query, {
            $set: {
                inventory: newData
            }
        }, function (err, res) {
            if (err) throw err;
            db.close();
        });
    });
};

function sleep(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
};
module.exports = {
    setDefaultWalletAmount,
    setDefaultBankAmount,
    connect,
    gamble,
    withdraw,
    deposite,
    balance,
    leaderboard,
    globalLeaderboard,
    work,
    monthly,
    weekly,
    quaterly,
    daily,
    hourly,
    rob,
    beg,
    addMoney,
    removeMoney,
    transferMoney,
    getUserItems,
    getShopItems,
    findUser,
    makeUser,
    saveUser,
    getInventory,
    makeInventory,
    updateInventory,
    sleep
}