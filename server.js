const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client({ disableEveryone: true });

bot.commands = new Discord.Collection();

bot.on("ready", () => {
  bot.user.setActivity(`Sunucuda ${bot.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} kişi var`, { type: 'PLAYING' })
  const channel = bot.channels.get("KANAL IDSİ");
  if (!channel) return console.error("Böyle bir kanal bulunmuyor");
  channel.join().then(connection => {
    // Yay, it worked!
    console.log("Bağlantı başarılı");
  }).catch(e => {
    console.error(e);
  });
});

let prefix = "!";



bot.on("ready", async () => {
  console.log(`Bot Hazır! ${bot.user.username}`);
  console.log(bot.commands);

  try {
    let link = await bot.generateInvite(["ADMINISTRATOR"]);
    console.log("Davet Linki:", link);
  } catch (e) {
    console.log(e.stack);
  }
});


bot.on("message", async message => {
	if(message.author.bot) return;


	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);

	if(!command.startsWith(prefix)) return;

	let cmd = bot.commands.get(command.slice(prefix.length));
	if(cmd) cmd.run(bot, message, args);

});


const invites = {};
const wait = require('util').promisify(setTimeout);

bot.on('ready', () => {
  bot.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

bot.on('guildMemberAdd', member => {
  member.guild.fetchInvites().then(guildInvites => {
    const ei = invites[member.guild.id];
    invites[member.guild.id] = guildInvites;
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    const inviter = bot.users.get(invite.inviter.id);
    const logChannel = member.guild.channels.find(channel => channel.name === "register-to-server");
    logChannel.send(`${member.user.tag} Sunucuya katıldı. Kullandığı davet linki: ${invite.code} Davet Eden: ${inviter.tag}. Bu kullanıcın ${invite.uses}. daveti`);
  });
});

const invitez = {};
     bot.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invitez[g.id] = guildInvites;
    });
  });
    
  bot.on("guildMemberAdd", async member => {
    let memberChannel = await db.fetch(`pikachucodedavettakip_${member.guild.id}`)
    if (!member.guild.channels.get(memberChannel)) return console.log('memberChannel')
         member.guild.fetchInvites().then(guildInvites => {
    const ei = invitez[member.guild.id];
    invitez[member.guild.id] = guildInvites;
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    const inviter = bot.users.get(invite.inviter.id);
    member.guild.channels.find(channel => channel.name === "register-to-server").send(`**${member.user.tag}** Katıldı davet eden: **${inviter.tag}** Daveti kullanan kişi sayısı: **${invite.uses}**`);
  });
    })



bot.login(process.env.TOKEN);
