const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    console.log('🚀 Setup-Prozess mit lokalen Bildern gestartet...');

    const logoPath = path.join(__dirname, 'dashboard', 'public', 'logo.png');

    // Prüfen ob das Logo existiert
    if (!fs.existsSync(logoPath)) {
        console.error('❌ Fehler: Logo nicht gefunden unter ' + logoPath);
        process.exit(1);
    }

    const logoFile = new AttachmentBuilder(logoPath, { name: 'logo.png' });

    // 1. Support & Ticket Embed (in den TICKET_CHANNEL_ID)
    const ticketChannelId = process.env.TICKET_CHANNEL_ID;
    if (ticketChannelId) {
        try {
            const ticketChannel = await client.channels.fetch(ticketChannelId);

            const supportEmbed = new EmbedBuilder()
                .setTitle('CHING Ticket & Support')
                .setDescription('Wähle einen Bereich aus, um ein Ticket zu erstellen oder Rollen zu erhalten.')
                .setImage('attachment://logo.png')
                .setColor('#D4AF37'); // Gold

            const supportRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('ticket_clip').setLabel('CLIP Channel').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('ticket_bewerbung').setLabel('BEWERBUNG').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId('ticket_beschwerde').setLabel('BESCHWERDE').setStyle(ButtonStyle.Danger),
                    new ButtonBuilder().setCustomId('role_request').setLabel('ROLLENANFRAGE').setStyle(ButtonStyle.Secondary)
                );

            await ticketChannel.send({ embeds: [supportEmbed], components: [supportRow], files: [logoFile] });
            console.log('✅ Support-Embed (mit Bild) erfolgreich gesendet!');
        } catch (err) {
            console.error('❌ Fehler beim Support-Embed:', err.message);
        }
    }

    // 2. Verifizierung Embed (in den VERIFY_CHANNEL_ID)
    const verifyChannelId = process.env.VERIFY_CHANNEL_ID;
    if (verifyChannelId) {
        try {
            const verifyChannel = await client.channels.fetch(verifyChannelId);

            const verifyEmbed = new EmbedBuilder()
                .setTitle('Sicherheits-Verifizierung')
                .setDescription('Klicke auf den Button unten, um dich zu verifizieren und Zugriff auf den Server zu erhalten.')
                .setImage('attachment://logo.png')
                .setColor('#ffffff'); // Weiß

            const verifyRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Jetzt verifizieren')
                        .setURL('https://chingverify.netlify.app')
                        .setStyle(ButtonStyle.Link)
                );

            await verifyChannel.send({ embeds: [verifyEmbed], components: [verifyRow], files: [logoFile] });
            console.log('✅ Verify-Embed (mit Bild) erfolgreich gesendet!');
        } catch (err) {
            console.error('❌ Fehler beim Verify-Embed:', err.message);
        }
    }

    console.log('🏁 Alle Setups abgeschlossen!');
    process.exit();
});

client.login(process.env.DISCORD_TOKEN);
