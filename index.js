require('dotenv').config();
const {Client, GatewayIntentBits, REST, Routes} = require('discord.js');
const verifyCommang = require('./verify.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', async () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
})