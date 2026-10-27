const {SlashCommandBuilder} = require('discord.js');
const {getName, getCode} = require('country-list');
// Gets and stores all countries in the world, with an option of "Prefer not to say"
const countries = ["Prefer Not To Say", ...getName()];

function getFlagEmoji (countryCode) {
    if (!countryCode) return '';
    // Converts the standart letters into Regional Indicatior emojis
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

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
                .setDescription('Type here to search for your country, or select "Prefer Not To Say".')
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
            // Adding the verified role to user and removing unverified role from user.
            if (verifiedRole) await interaction.member.roles.add(verifiedRole);
            if (unverifiedRole) await interaction.member.roles.remove(unverifiedRole);

            let flag = '';
            if (nationality !== "Prefer Not To Say") {
                const countryCode = getCode(nationality);
                if (countryCode) {
                    flag = getFlagEmoji(countryCode);
                }
            }

            try {
                // Creates new nickname to user with their name and nationality emoji (if revealed by user)
                const newNickname = flag ? `${name} - ${flag}` : `${name} - 🌍`;

                //Discord limits nicknames on 32 characters. This prevents nicknames going over that limit and crashing the bot.
                const safeNickname = newNickname.substring(0, 32);

                await interaction.member.setNickname(safeNickname);
            } catch (error) {
                console.log(`Could not change nickname for ${interaction.user.tag}`)
            }

            await interaction.reply({
                content: `**✅ You have been verified successfully!**\nWelcome to VMC **${name}** from **${nationality}** ${flag}`,
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