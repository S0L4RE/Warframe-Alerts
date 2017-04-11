const roles = require("../../broadcast/allowed_roles.json").roles;
const Arr2Tbl = require("../../util/arrayThings").array2dtable;

module.exports = {
  name: "notifysetup",
  desc: "set up roles for alert mentions",
  example: "notifysetup pc, notifysetup ps4 xb1",
  run: (bot, message, args) => {
    let filter = ["pc", "xb1", "ps4"];
    const platforms = filter.filter((ele) => args.includes(ele));
    if (args.length < 1) {
      return message.reply("Provide some platforms to make roles for.");
    }
    if (message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS") && message.guild.member(bot.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
      const plannedRoles = [];
      let thisRow = [];
      for (platform of platforms) {
        if (platform === "pc") platform = "";
        // 2d array of platforms 5 across
        for (let i = 5; i < roles.length + 5; i += 5) {
          const add = roles.slice(i - 5, i).filter((r) => !message.guild.roles.exists((role) => role.name.toLowerCase() === platform + r));
          if (add.length > 0) plannedRoles.push(add.map((r) => platform + r));
        }
      }
      if (plannedRoles.length < 1) return message.channel.send(`There are no \`${platforms.join(" ")}\` roles I can create.`);
      message.channel.sendMessage(`You have provided \`${platforms.join(" ")}\` as arguments. This will create the following roles:
      \`\`\`${Arr2Tbl(plannedRoles)}\`\`\`
Is this ok? Reply with \`yes\` in 10 seconds if this is ok. Anything else will cancel this command.
      `).then((msg) => {
        msg.channel.awaitMessages((response) => response.author.id === message.author.id, {
          max: 1,
          time: 10000,
          errors: ["time"]
        }).then((collected) => {
          const reply = collected.first();
          if (reply.content.toLowerCase() !== "yes") throw new Error(); // go to catch
          msg.edit(`Creating roles... This table will be updated as they are created.
When everything is checked, it is done. Sorry for spacing. \`\`\`${Arr2Tbl(plannedRoles)}\`\`\``);
          let a = 0;
          for (let i = 0; i < plannedRoles.length; i++) {
            for (let j = 0; j < plannedRoles[i].length; j++) {
              setTimeout(() => {
                message.guild.createRole({name: plannedRoles[i][j], mentionable: true}).then((r) => {
                  r.setPermissions([]);
                  plannedRoles[i][j] = "\u2713 " + plannedRoles[i][j];
                  msg.edit(`Creating roles... This table will be updated as they are created.
When everything is checked, it is done. Sorry for spacing. \`\`\`${Arr2Tbl(plannedRoles)}\`\`\``);
                })
              }, ++a * 5000)
            }
          }
        }).catch((error) => {
          return msg.edit("You did not reply with `yes` so I have cancelled this.");
        })
      })
    } else {
      message.reply("Someone is missing manage role permissions, either you or me.");
    }
  }
}
