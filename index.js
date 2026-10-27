require('dotenv').config();
const {Client, GatewayIntentBits, REST, Routes} = require('discord.js');
const verifyCommand = require('./verify.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', async () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const rest = new REST({version: '10'}).setToken(process.env.TOKEN);
    try {
        console.log('Starter refreshing application (/) commands...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            {body: [verifyCommand.data.toJSON()]},
        );
        console.log('Sucessfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'verify') {
            await verifyCommand.execute(interaction);
        }
    } else if (interaction.isAutocomplete()) {
        if (interaction.commandName === 'verify') {
            await verifyCommand.autocomplete(interaction);
        }
    }
});

client.login(process.env.TOKEN);

// Dummy serer cause this is deployed to Render
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Application is Online!'));
app.listen(port, () => console.log(`Web server listening on port ${port}`))