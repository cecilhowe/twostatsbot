// mandatory things
// this one includes the discord library for discord specific things
const Discord = require('discord.js');

// this one tells the bot what prefix the commands use and it hides
// your super secret token. the password is password.
// each item in the list between these mustache brackets is an entry in the config file
// and this allows you to change things in the config without changing it here too. you're welcome
// commented out for heroku reasons (TURN OFF FOR HEROKU)
//    const { prefix, token } = require('./config.json');

// this gives the bot proper life and define secret stuff. these are stored on heroku instead of the config file
    const bot = new Discord.Client();
    const prefix = process.env.prefix;

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
        'statSave': [
            'Save versus `#statList#` ( Difficulty: \`#statThrow#\` )  *!*',
            'Roll `#statThrow#` to save versus `#statList#`  *!*',
            'You\'ll need to roll a `#statThrow#` or more to save versus `#statList#`  *!*'
        ]
    });


// mandatory includsies
    // do a thing once the bot is running good and warm
    // tell cecil how many server couches Two Stat Bot sleeps on
    bot.once('ready', () => {
        console.log (`Two Stat Bot is fine and how are you thank you for asking!\nCurrently installed on ${bot.guilds.size} servers and can talk to ${bot.users.size} people!\nThis robotomottabus uses the ${prefix} symbol to use any commands. For help, tweet your problems to @negative_cone!`);
        // set the bot's activity; in discord this shows as Playing: Bolded Term
        bot.user.setActivity('fake elfgames!');
    });

// tell cecil when a new server installs this boterino
    bot.on('guildCreate', guild => {
        console.log(`${bot.users.size} players join the fight! Two Stat Bot is now running on ${bot.guilds.size} servers.`);
    });

// tell cecil when a server yeets the bot
    bot.on('guildDelete', guild => {
        console.log(`${bot.users.size} dads stepped out back for a cigarette. Now serving ${bot.guilds.size} servers.`)
    });

// begin listening for commands!
    bot.on('message', message => {

        // if the message has no +, is a bot, or is a dm the bot keeps the fuck quiet
        if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;



        // get two stats in public
        // first it checks to see if the message has a + in it, and if it does it looks two see what command follows.
        // for this first one, it looks for +two stats and if the message says +two stats, it sends two stats to the channel
        // and says who they belong to. message.author.username is the name of the person who asked for the stats.
        if (message.content === `${prefix}two stats`) {
            message.delete([0]).catch(() => null);
            message.channel.send(`\`${message.author.username}\` ${grammar.flatten('#statSentence#')}`);
        }

        // get two stats in private
        // checks for the same shit as the first one, but instead of +two stats it wants +whisper stats. if it gets what it wants
        // the bot sends a private message to whomstever asked for it.
        else if (message.content === `${prefix}whisper stats`) {
            message.delete([0]).catch(() => null);
            message.author.send(`${grammar.flatten('#statWhisper#')}`);
        }

        // roll d6 once
        else if (message.content === `${prefix}roll`) {
            message.delete([0]).catch(() => null);
            message.channel.send(`\`${message.author.username}\` ${grammar.flatten('#statRoll#')}`);
        }

        // +! command; does a save
        else if (message.content === `${prefix}!`) {
            message.delete([0]).catch(() => null);
            message.channel.send(`Quick! \`${message.author.username}\`! ${grammar.flatten('#statSave#')}`);
        }

        // get help
        else if (message.content === `${prefix}help`) {
            message.delete([0]).catch(() => null);

            // make embed
            
            const embedInfo = {
                "title": "About Two Stats Bot",
                "description": "\nTwo Stat Bot is an exercise in making tabletop adventure game bots that use tracery for discord bots. Tracery is by Kate Compton.(number of) servers currently have this bot installed.```Please give Two Stats Bot permission to manage messages in whichever channel you want it to live; this allows it to delete command messages and keep the log clear!```For help and other information, I can be reached on twitter: @negative_cone\nty, lyu\n-cecil\n\n",
                "color": 10594673,
                "author": {
                  "name": "Two Stats Bot Information & Help !",
                  "icon_url": ""
                },
                "fields": [
                  {
                    "name": "**Commands**",
                    "value": "Use ``+`` to execute these commands:"
                  },
                  {
                    "name": "``+two stats``",
                    "value": "Get two random stats*!*",
                    "inline": true
                  },
                  {
                    "name": "``+roll``",
                    "value": "Roll 1d6*!*",
                    "inline": true
                  },
                  {
                    "name": "+!",
                    "value": "Save versus*!*",
                    "inline": true
                  },
                  {
                    "name": "+help",
                    "value": "See this message again for some reason. ¯\\_(ツ)_/¯",
                    "inline": true
                  }
                ]
              };


            message.author.send({ embedInfo });
        }
        // bot information
      //  else if (message.content === `${prefix}info`) {
      //      message.delete([0]).catch(() => null);
      //      message.author.send(`Two Stat Bot is an exercise in making tabletop adventure game bots that use tracery for discord bots. Tracery is by Kate Compton.\n\`${bot.guilds.size}\` servers currently have this bot installed.\nFor help and other information, I can be reached on twitter: @negative_cone\nty, lyu\n-cecil`)
      //  }
    });



// log yourself in mates
  bot.login(process.env.token);
//    bot.login(token);