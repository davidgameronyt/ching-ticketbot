const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    ChannelType
} = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Statische Dateien aus dem Dashboard/Public Ordner bereitstellen
app.use('/public', express.static(path.join(__dirname, 'dashboard', 'public')));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const dataPath = path.join(__dirname, 'data.json');
const BAD_WORDS = ['nigger', 'neger', 'hurensohn', 'bastard'];

// Funktion zum Laden/Speichern von Daten
function getBotData() {
    if (!fs.existsSync(dataPath)) return { currentFunk: 'Unbekannt' };
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveBotData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
}

client.once('ready', async () => {
    console.log(`✅ Agent 007 ist online als ${client.user.tag}`);

    // Slash Commands registrieren
    const commands = [
        {
            name: 'f',
            description: 'Zeigt den aktuellen Funk an und pingt @everyone',
        },
        {
            name: 'neuerfunk',
            description: 'Setzt einen neuen Funkwert und pingt @everyone',
            options: [
                {
                    name: 'wert',
                    description: 'Der neue Funkwert (z.B. 472.76)',
                    type: 3, // String
                    required: true,
                }
            ]
        }
    ];

    try {
        await client.application.commands.set(commands);
        console.log('✅ Slash Commands wurden registriert.');
    } catch (err) {
        console.error('❌ Fehler beim Registrieren der Commands:', err);
    }

    const guild = client.guilds.cache.first();
    if (!guild) return;

    // 1. Rolle "anfragen perms" automatisch finden oder erstellen
    let anfragenPerms;
    const roleIdFromEnv = process.env.ROLE_ANFRAGEN_PERMS;

    if (roleIdFromEnv) {
        anfragenPerms = guild.roles.cache.get(roleIdFromEnv);
    }

    if (!anfragenPerms) {
        anfragenPerms = guild.roles.cache.find(r => r.name === 'anfragen perms');
    }

    if (!anfragenPerms) {
        anfragenPerms = await guild.roles.create({
            name: 'anfragen perms',
            color: '#ffffff',
            reason: 'Automatische Erstellung durch Ching Ticketbot',
        });
        console.log('✅ Rolle "anfragen perms" wurde automatisch erstellt.');
    } else {
        console.log(`✅ Rolle "anfragen perms" gefunden (${anfragenPerms.id}).`);
    }

    // 2. Sicherheits-Check: Webhook-Lockdown
    const rolesToLock = guild.roles.cache.filter(role =>
        role.name !== 'Rang 11' &&
        role.name !== 'Rang 12' &&
        !role.permissions.has(PermissionsBitField.Flags.Administrator) &&
        role.name !== '@everyone'
    );

    for (const [id, role] of rolesToLock) {
        if (role.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) {
            try {
                await role.setPermissions(role.permissions.remove(PermissionsBitField.Flags.ManageWebhooks));
                console.log(`🔒 Webhook-Berechtigung für Rolle ${role.name} entfernt.`);
            } catch (err) {
                console.error(`❌ Fehler beim Ändern der Rolle ${role.name}:`, err);
            }
        }
    }

    // 3. @everyone Privacy Check
    const everyone = guild.roles.everyone;
    if (everyone.permissions.has(PermissionsBitField.Flags.ViewChannel)) {
        await everyone.setPermissions(everyone.permissions.remove(PermissionsBitField.Flags.ViewChannel));
        console.log('🔒 @everyone Sichtbarkeit eingeschränkt.');
    }
});

// Auto-Moderation
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const content = message.content.toLowerCase();
    if (BAD_WORDS.some(word => content.includes(word))) {
        try {
            await message.delete();
            await message.channel.send(`${message.author}, Beleidigungen werden hier nicht geduldet!`);
        } catch (err) { console.error('❌ Fehler bei Auto-Moderation:', err); }
    }
});

// Interaktionen (Buttons & Slash Commands)
client.on('interactionCreate', async (interaction) => {
    const { guild, user, member } = interaction;

    // Slash Commands
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        if (commandName === 'f') {
            const data = getBotData();
            await interaction.reply({
                content: `@everyone\n**Funk-Status:** Der aktuelle Funk ist: \`${data.currentFunk}\``
            });
        }

        if (commandName === 'neuerfunk') {
            const newValue = interaction.options.getString('wert');
            const data = getBotData();
            data.currentFunk = newValue;
            saveBotData(data);
            await interaction.reply({
                content: `@everyone\n**Neuer Funk!** Der Funk wurde auf \`${newValue}\` geändert.`
            });
        }
        return;
    }

    // Buttons
    if (interaction.isButton()) {
        const { customId } = interaction;

        if (customId === 'ticket_clip') {
            const channel = await guild.channels.create({
                name: `clip-${user.username}`,
                type: ChannelType.GuildText,
                parent: process.env.CATEGORY_CLIP,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                ],
            });
            await interaction.reply({ content: `Dein Clip-Channel wurde erstellt: ${channel}`, ephemeral: true });
        }

        if (customId === 'ticket_bewerbung') {
            await interaction.reply({ content: 'Deine Bewerbung wurde registriert. Das Team (@anfragen perms) wurde informiert.', ephemeral: true });
        }

        if (customId === 'ticket_beschwerde') {
            const ticketChannel = guild.channels.cache.get(process.env.TICKET_CHANNEL_ID);
            if (!ticketChannel) return interaction.reply({ content: 'Fehler: Ticket-Kanal nicht gefunden.', ephemeral: true });

            const anfragenRole = guild.roles.cache.find(r => r.name === 'anfragen perms');

            const thread = await ticketChannel.threads.create({
                name: `beschwerde-${user.username}`,
                autoArchiveDuration: 60,
                type: ChannelType.PrivateThread,
                reason: `Beschwerde-Ticket von ${user.username}`,
            });

            await thread.members.add(user.id);

            if (anfragenRole) {
                // Ein Mention im ersten Post fügt Leute mit der Rolle zwar nicht direkt hinzu,
                // aber sie können den Thread sehen/beitreten, wenn sie ViewChannel Berechtigung im Eltern-Kanal haben.
                await thread.send(`Hallo ${user}, ein Teammitglied ${anfragenRole} wird sich in Kürze melden. Beschreibe bitte dein Anliegen.`);
            } else {
                await thread.send(`Hallo ${user}, bitte beschreibe dein Anliegen.`);
            }

            await interaction.reply({ content: `Dein Beschwerde-Ticket wurde erstellt: ${thread}`, ephemeral: true });
        }

        if (customId === 'role_request') {
            const role1 = guild.roles.cache.find(r => r.name === 'Rang 1');
            const roleChing = guild.roles.cache.find(r => r.name === 'CHING Mitglied');
            if (role1 && roleChing) {
                await member.roles.add([role1, roleChing]);
                await interaction.reply({ content: 'Rollen erhalten!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Fehler: Rollen fehlen auf dem Server.', ephemeral: true });
            }
        }
    }
});

// Express API für Verifizierung
app.get('/api/verify', async (req, res) => {
    const { code } = req.query;

    if (!code) return res.status(400).send('Kein Code erhalten.');

    try {
        // 1. Token erhalten
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.REDIRECT_URI,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        // 2. User Info holen
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const discordUser = userResponse.data;
        const guild = client.guilds.cache.get(process.env.GUILD_ID);

        if (!guild) return res.status(500).send('Server nicht gefunden.');

        const member = await guild.members.fetch(discordUser.id);
        const role = guild.roles.cache.get(process.env.ROLE_VERIFIED); // Hier musst du eine ID in .env festlegen

        if (member && role) {
            await member.roles.add(role);
            res.send('✅ Verifizierung erfolgreich! Du kannst dieses Fenster jetzt schließen.');
        } else {
            res.status(400).send('Mitglied oder Rolle nicht gefunden.');
        }

    } catch (err) {
        console.error('❌ Fehler bei der Verifizierung:', err.response?.data || err.message);
        res.status(500).send('Fehler bei der Verifizierung.');
    }
});

app.listen(port, () => console.log(`🌍 API läuft auf Port ${port}`));

client.login(process.env.DISCORD_TOKEN);
