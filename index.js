const { Client, GatewayIntentBits, Partials, PermissionsBitField } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('./config.js');
const { ChannelType } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel]
});

const TOKEN = 'MTM1MTA2NjE1MjA0MTcwOTYyOA.GhXoJ9.dHqzorKXLv31vqAw8JNNrVxB3z6cinGlOrn0KE'; // Replace with your new token
const commands = [{
    name: 'apollo',
    description: 'Setup the voice channel system',
}, {
    name: 'help',
    description: 'Get information about the bot and its commands'
}, {
    name: 'invite',
    description: 'Get the bot invite link'
}];

const rest = new REST({ version: '9' }).setToken(TOKEN);

client.once('ready', async () => {
    console.log('Bot is ready!');
    try {
        // Register commands globally instead of for a specific guild
        const data = await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log(`Successfully registered ${data.length} commands.`);
    } catch (error) {
        console.error('Error registering commands:', error);
    }
});

// Remove both existing interaction handlers and replace with this single one
client.on('interactionCreate', async interaction => {
    // Handle apollo command
    if (interaction.isCommand() && interaction.commandName === 'apollo') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You need administrator permissions to use this command!', ephemeral: true });
        }

        try {
            // Check if channels already exist
            const existingTrigger = interaction.guild.channels.cache.find(channel => channel.name === 'My Room');
            const existingPanel = interaction.guild.channels.cache.find(channel => channel.name === 'wisdom-panel');

            if (existingTrigger && existingPanel) {
                return interaction.reply({ content: 'The voice system is already set up in this server!', ephemeral: true });
            }

            // Create channels only if they don't exist
            const triggerChannel = existingTrigger || await interaction.guild.channels.create({
                name: 'My Room',
                type: 2,
            });

            const controlChannel = existingPanel || await interaction.guild.channels.create({
                name: 'panel',
                type: 0,
            });

            // Only send the panel message if it's a new channel
            if (!existingPanel) {
                await controlChannel.send({
                    embeds: [{
                        title: '🎭 Wisdom Voice System <a:micro:1358321786307215511>',
                        description: ' <a:join:1358321213843177572> **Join __My Room__ to get started!**\n\n' +
                            '<a:welcome:1358321309871767693> **Welcome to our Advanced Voice System**\n' +
                            '━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
                            '**⚡ Controls:**\n' +
                            '• <:voice1:135815247340319555> `Unlock` - Allow everyone to join\n' +
                            '• <:voice2:1358152471687467228> `Transfer` - Change ownership\n' +
                            '• <:voice3:1358152470081175622> `Lock` - Make channel private\n' +
                            '• <:voice4:1358152468273430718> `Limit` - Set user limit\n' +
                            '• <:voice5:1358152462527238215> `Invite` - Generate invite\n' +
                            '• <:voice6:1358152460979404992> `Rename` - Change channel name\n' +
                            '• <:voice7:1358152459566186567> `Bitrate` - Adjust audio quality\n\n' +
                            '━━━━━━━━━━━━━━━━━━━━━━━━━',
                        color: 0x2b2d31,
                        image: {
                            url: 'https://cdn.discordapp.com/attachments/1354565881937527095/1358959151643889785/for_wisdom_oice.png?ex=67f5bcd5&is=67f46b55&hm=6e2fef6cac78e38efe0a658147068ac55a717944e1dc34175d0e53827d5d6433&'
                        },
                        thumbnail: {
                            url: interaction.guild.iconURL({ dynamic: true })
                        },
                        footer: {
                            text: '© Wisdom Voice System • Created by Apollo',
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('unlock')
                                .setEmoji('1358152473403195555')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('transfer')
                                .setEmoji('1358152471687467228')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('lock')
                                .setEmoji('1358152470081175622')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('limit')
                                .setEmoji('1358152468273430718')
                                .setStyle(ButtonStyle.Secondary)
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('invite')
                                .setEmoji('1358152462527238215')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('rename')
                                .setEmoji('1358152460979404992')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('bitrate')
                                .setEmoji('1358152459566186567')
                                .setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });
            } // <-- Add this closing bracket

            await interaction.reply({ content: 'Setup completed successfully!', ephemeral: true });
        } catch (error) {
            console.error('Setup error:', error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'An error occurred while setting up the channels.', ephemeral: true });
            }
        }
        return;
    }

    // Add help command handler here
    if (interaction.isCommand() && interaction.commandName === 'help') {
        try {
            if (!interaction.replied) {
                await interaction.reply({
                    embeds: [{
                        title: '🎭 Wisdom Voice System Help',
                        description: '**Welcome to Wisdom Voice System!**\n' +
                            'A powerful voice channel management system for your Discord server.\n\n' +
                            '**📌 Main Commands:**\n' +
                            '• `/apollo` - Setup the voice system (Admin only)\n' +
                            '• `/help` - Show this help message\n' +
                            '• `/invite` - Get bot invite link\n' +
                            '**🎮 Voice Commands:**\n' +
                            '• `v$limit <number>` - Set channel user limit (0-99)\n' +
                            '• `v$rename <name>` - Change channel name\n' +
                            '• `v$transfer @user` - Transfer channel ownership\n' +
                            '• `v$bitrate <8-96>` - Set channel bitrate in kbps\n\n' +
                            '**🔧 Quick Controls:**\n' +
                            '• 🔓 Unlock - Allow everyone to join\n' +
                            '• 🔒 Lock - Make channel private\n' +
                            '• 🔗 Invite - Generate channel invite\n' +
                            '• 👑 Transfer - Change channel owner\n' +
                            '• 🔊 Bitrate - Adjust audio quality\n' +
                            '• ✏️ Rename - Change channel name\n' +
                            '• 👥 Limit - Set user limit\n\n' +
                            '**❓ Support:**\n' +
                            '• [Support Server](https://discord.gg/AW2ppwDVts)\n',
                        color: 0x2b2d31,
                        image: {
                            url: 'https://files.shapes.inc/65678d05.png'
                        },
                        thumbnail: {
                            url: client.user.displayAvatarURL()
                        },
                        footer: {
                            text: '© Created by Apollo Belvedere • Wisdom Circle Developers',
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }]
                });
            }
        } catch (error) {
            console.error('Help command error:', error);
            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({ 
                        content: 'An error occurred while displaying the help information.',
                        ephemeral: true
                    });
                } catch (followUpError) {
                    console.error('Error sending error message:', followUpError);
                }
            }
        }
    }

    // Add invite command handler here
    if (interaction.isCommand() && interaction.commandName === 'invite') {
        try {
            const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
            await interaction.reply({
                embeds: [{
                    title: '🎭 Invite Wisdom Voice',
                    description: `Click the button below to add me to your server!\n\n[Click Here](${inviteLink})`,
                    color: 0x2b2d31,
                    thumbnail: {
                        url: client.user.displayAvatarURL()
                    },
                    footer: {
                        text: '© Wisdom Voice System • Created by Apollo',
                        icon_url: client.user.displayAvatarURL()
                    },
                    timestamp: new Date()
                }]
            });
        } catch (error) {
            console.error('Invite command error:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: 'An error occurred while generating the invite link.',
                    ephemeral: true
                });
            }
        }
    }

    // Handle button interactions
    if (interaction.isButton()) {
        try {
            await interaction.deferReply({ ephemeral: true });
            
            const channel = interaction.member.voice.channel;
            if (!channel || !channel.name.startsWith('⭕ WisdomVoice')) {
                return interaction.editReply({ content: 'You must be in your voice channel to use these controls!' });
            }

            switch (interaction.customId) {
                case 'unlock':
                    await channel.permissionOverwrites.edit(interaction.guild.id, { Connect: true });
                    await interaction.editReply({ content: 'Channel unlocked! Everyone can now join.' });
                    break;
                    
                case 'lock':
                    await channel.permissionOverwrites.edit(interaction.guild.id, { Connect: false });
                    await interaction.editReply({ content: 'Channel locked! Only you can add members now.' });
                    break;
                    
                case 'limit':
                    await interaction.editReply({ content: 'Please use `v$limit <number>` to set the user limit.' });
                    break;
                    
                case 'rename':
                    await interaction.editReply({ content: 'Please use `v$rename <name>` to change the channel name.' });
                    break;
                    
                case 'transfer':
                    await interaction.editReply({ content: 'Please use `v$transfer @user` to transfer ownership.' });
                    break;
                    
                case 'invite':
                    const invite = await channel.createInvite({ maxAge: 86400 });
                    await interaction.editReply({ content: `Here's your channel invite: ${invite.url}` });
                    break;
                    
                case 'bitrate':
                    await interaction.editReply({ content: 'Please use `v$bitrate <8-96>` to adjust the bitrate.' });
                    break;
            }
        } catch (error) {
            console.error('Button interaction error:', error);
            if (interaction.deferred) {
                await interaction.editReply({ content: 'An error occurred while processing your request.' });
            } else {
                await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
            }
        }
    }
}); // Login to Discord with your client's token
client.login(TOKEN);

client.on('voiceStateUpdate', async (oldState, newState) => {
    // Handle user joining "My Room"
    if (newState.channel?.name === 'My Room') {
        try {
            // Create new voice channel
            const userChannel = await newState.guild.channels.create({
                name: '⭕ WisdomVoice',
                type: ChannelType.GuildVoice, // Fix: Use correct channel type
                parent: newState.channel.parent, // Add: Put in same category
                permissionOverwrites: [
                    {
                        id: newState.member.id,
                        allow: [
                            PermissionsBitField.Flags.ManageChannels,
                            PermissionsBitField.Flags.MuteMembers,
                            PermissionsBitField.Flags.MoveMembers,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.Connect,
                            PermissionsBitField.Flags.Speak
                        ]
                    },
                    {
                        id: newState.guild.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect]
                    }
                ]
            });

            // Move user to their new channel
            await newState.setChannel(userChannel);
        } catch (error) {
            console.error('Error in voice channel creation:', error);
        }
    }

    // Clean up empty custom channels
    if (oldState.channel && oldState.channel.name.startsWith('⭕ WisdomVoice')) {
        try {
            // Check if channel still exists and is empty
            const channel = await oldState.guild.channels.fetch(oldState.channel.id);
            if (channel && channel.members.size === 0) {
                await channel.delete();
            }
        } catch (error) {
            // Ignore unknown channel errors
            if (error.code !== 10003) {
                console.error('Error deleting channel:', error);
            }
        }
    }
});

// Add at the top of the file, after client initialization
client.on('error', error => {
    console.error('Client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});