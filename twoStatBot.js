// mandatory things
// this one includes the discord library for discord specific things
const Discord = require('discord.js');

// this one tells the bot what prefix the commands use and it hides
// your super secret token. the password is password.
// each item in the list between these mustache brackets is an entry in the config file
// and this allows you to change things in the config without changing it here too. you're welcome
//    const { prefix, token } = require('./config.json');

// this gives the bot proper life and define secret stuff
    const client = new Discord.Client();
    const { prefix } = process.env.prefix;

// bring tracery to this picnic
    const tracery = require('tracery-grammar');

// this enables modifiers for tracery like .a and .capitalize but we're not using any of those
// in this script right now, so let's turn it off.
// grammar.addModifiers(tracery.baseEngModifiers);

// this tells the bot what your tracery symbols (words) are called
// and tells it what json file they are in. organize to suit
    const { statList } = require('./statList.json');
    const { statDice } = require('./statDice.json');
    const { statThrow } = require ('./statThrow.json');

// this part turns your word lists into grammar for tracery to use
// 'traceryUse': botUse,
    const grammar = tracery.createGrammar({
        'statList': statList,
        'statDice': statDice,
        'statThrow': statThrow,
        // the actual outputs when commanded
        'statSentence': [
            'has two stats: `#statList#` and `#statList#`  *!*',
            'has two stats: `#statList#` and `#statList#`  *!*',
            'has two stats: `#statList#` and `#statList#`  *!*',
            'has two stats: `#statList#` and `#statList#`  *!*',
            'needs two stats, and we\'ve decided they\'re `#statList#` and `#statList#`  *!*',
            'has... *checks notes*... says here two stats: `#statList#` and `#statList#`  *!*',
            'has but two stats: one is `#statList#` and the other `#statList#`  *!*',
            'has two wolves inside them. Both are stats. One stat is `#statList#` and the other is `#statList#`  *!*'
        ],
        // todo: turn these into external jsons
        'statWhisper' : [
            'Psst*!* Your stats are `#statList#` and `#statList#`  *!*'
        ],
        'statRoll': [
            'rolls a `#statDice#`  *!*'
        ],
        'statRollTwo': [
            'rolls a `#statDice#` and a `#statDice#` *!*'
        ],
        'statRollThree': [
            'rolls a `#statDice#`, a `#statDice#`, and a `#statDice#` *!*'
        ],
        'statRollFour': [
            'rolls `#statDice#`, `#statDice#`, `#statDice#`, and `#statDice#` *!*'
        ],
        'statSave': [
            'Save versus `#statList#` ( Difficulty: \`#statThrow#\` )  *!*',
            'Roll `#statThrow#` to save versus `#statList#`  *!*',
            'You\'ll need to roll a `#statThrow#` or more to save versus `#statList#`  *!*'
        ]
    });


// mandatory includsies
    // do a thing once the bot is running good and warm
    client.once('ready', () => {
        console.log (`Two Stat Bot is fine and how are you thank you for asking!`);
        // tell cecil how many server couches Two Stat Bot sleeps on
        console.log (`Two Stat Bot is installed on ${client.guilds.size} servers and can talk to ${client.users.size} people!`);
        // set the bot's activity; in discord this shows as Playing: Bolded Term
        client.user.setActivity('fake elfgames!');
    });

// tell cecil when a new server installs this boterino
    client.on('guildCreate', guild => {
        console.log(`${client.users.size} players join the fight! Two Stat Bot is now running on ${client.guilds.size} servers.`);
    });

// tell cecil when a server yeets the bot
    client.on('guildDelete', guild => {
        console.log(`${client.users.size} dads stepped out back for a cigarette. Now serving ${client.guilds.size} servers.`)
    });

// begin listening for commands!
    client.on('message', message => {

        // if the message has no + or is a bot or is a dm, the bot keeps the fuck quiet
        if (!message.content.startsWith(prefix) || message.author.bot || message.guild === null) return;

        // get two stats in public
        // first it checks to see if the message has a + in it, and if it does it looks two see what command follows.
        // for this first one, it looks for +two stats and if the message says +two stats, it sends two stats to the channel
        // and says who they belong to. message.author.username is the name of the person who asked for the stats.
        if (message.content === `${prefix}two stats`) {
            message.delete();
            message.channel.send(`\`${message.author.username}\` ${grammar.flatten('#statSentence#')}`);
        }

        // get two stats in private
        // checks for the same shit as the first one, but instead of +two stats it wants +whisper stats. if it gets what it wants
        // the bot sends a private message to whomstever asked for it.
        else if (message.content === `${prefix}whisper stats`) {
            message.delete();
            message.author.send(`${grammar.flatten('#statWhisper#')}`);
        }

        // roll d6 once, twice, thrice, fource
        else if (message.content === `${prefix}roll`) {
            message.delete();
            message.channel.send(`\`${message.author.username}\` ${grammar.flatten('#statRoll#')}`);
        }
        else if (message.content === `${prefix}roll 2`) {
            message.delete();
            message.channel.send(`\`${message.author.username}\` ${grammar.flatten('#statRollTwo#')}`);
        }
        else if (message.content === `${prefix}roll 3`) {
            message.delete();
            message.channel.send(`\`${message.author.username}\` ${grammar.flatten('#statRollThree#')}`);
        }
        else if (message.content === `${prefix}roll 4`) {
            message.delete();
            message.channel.send(`\`${message.author.username}\` ${grammar.flatten('#statRollFour#')}`);
        }

        // +! command; does a save
        else if (message.content === `${prefix}!`) {
            message.delete();
            message.channel.send(`Quick! \`${message.author.username}\`! ${grammar.flatten('#statSave#')}`);
        }

        // get help
        else if (message.content === `${prefix}help`) {
            message.delete();
            message.author.send(`Hi! Here are the Two Stat Bot commands:\nType \`+two stats\` to get your two stats.\nType \`+whisper stats\` to get your stats privately.\nType \`+roll\` to roll 1d6. You can roll up to 4d6 by adding the words \`two\`,\`three\`, or \`four\` to this command.\nType \`+!\` for a challenge`);
        }
        // bot information
        else if (message.content === `${prefix}info`) {
            message.delete();
            message.author.send(`Two Stat Bot is an exercise in making tabletop adventure game bots that use tracery for discord bots. Tracery is by Kate Compton.\n\`${client.guilds.size}\` servers currently have this bot installed.\nFor help and other information, I can be reached on twitter: @negative_cone\nty, lyu\n-cecil`)
        }
    });



// log yourself in mates
    client.login(process.env.token);