const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    const channelId = process.env.VERIFY_CHANNEL_ID;
    const channel = await client.channels.fetch(channelId);

    const embed = new EmbedBuilder()
        .setTitle('CHING Ticket & Support')
        .setDescription('Wähle einen Bereich aus, um ein Ticket zu erstellen oder Rollen zu erhalten.')
        .setImage(process.env.IMAGE_URL)
        .setColor('#D4AF37'); // Gold

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('ticket_clip').setLabel('CLIP Channel').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('ticket_bewerbung').setLabel('BEWERBUNG').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('ticket_beschwerde').setLabel('BESCHWERDE').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('role_request').setLabel('ROLLENANFRAGE').setStyle(ButtonStyle.Secondary)
        );

    await channel.send({ embeds: [embed], components: [row] });
    console.log('✅ Embeds wurden gesendet!');
    process.exit();
});

client.login(process.env.DISCORD_TOKEN);
