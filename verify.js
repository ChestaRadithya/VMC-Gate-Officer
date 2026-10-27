const {SlashCommandBuilder} = require('discord.js');
const {getCountries} = require('country-list.js');
// Gets and stores all countries in the world, with an option of "Prefer not to say"
const countries = ["Prefer Not To Say", ...getCountries()];

module.exports = {
    // Discord Command Structure
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('To fully access VMC, Verify yourself with this command')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('You can enter either your real or online name here')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nationality')
                .setDescription('Type here to search for your country, or select "Prefer Not To Say" if you would like to keep it private')
                .setAutocomplete(true)
                .setRequired(true)),
    
    // Autocomplete Logic
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const filtered = countries.filter(choice =>
            choice.toLowerCase().includes(focusedValue.toLowerCase())
        );

        await interaction.respond(
            filtered.slice(0, 25).map(choice => ({name: choice, value: choice}))
        );
    },

    // Execution Logic
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const nationality = interaction.options.getString('nationality');

        const verifiedRoleId = '1561262488849227786'
        const unverifiedRoleId = '1561262622215770123'

        const verifiedRole = interaction.guild.roles.cache.get(verifiedRoleId);
        const unverifiedRole = interaction.guild.roles.cache.get(unverifiedRoleId);

        try {
            // Adding the verified role to user
            if (verifiedRole) {
                await interaction.member.roles.add(verifiedRole);
            }
            // Remove unverified role frome user
            if (unverifiedRole) {
                await interaction.member.roles.remove(unverifiedRole);
            }

            // Set User's nickname after verification
            try {
                await interaction.member.setNickname(`${name} - ${nationality}`);
            } catch (nicknameError) {
                console.log(`Could not change nickname for ${interaction.user.tag}`);
            }

            await interaction.reply({
                content: `**✅ You have been verified successfully!**\nWelcome to VMC ${name} from ${nationality}`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'An error occured while verifying a member. Please ensure the bot has the correct permissions.',
                ephemeral: true
            });
        }
    }
};