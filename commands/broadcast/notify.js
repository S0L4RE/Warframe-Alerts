const roles = require("../../broadcast/allowed_roles.json").roles;
const Arr2Tbl = require("../../util/arrayThings").array2dtable;

module.exports = {
  name: "notify",
  desc: "join or leave roles",
  example: "notify j forma, notify l kavat forma",
  run: (bot, message, args) => {
    if (args.length === 0) {
      const platforms = ["xb1", "ps4", ""];
      let ret = [];
      for (platform of platforms) {
        for (let i = 0; i < roles.length; i += 5) {
          let role4 = [];
          for (let j = 0; j < 5 && i + j < roles.length; j++) {
              if (message.guild.roles.find((r) => r.name.toLowerCase() === platform + roles[i+ j].toLowerCase()))
                role4.push(platform + roles[i + j]);
          }
          if (role4.length > 0)
            ret.push(role4);
        }
      }
      if (ret.length == 0) {
        return message.reply("There are no roles that this bot can assign in the server!");
      }
      return message.channel.send("Allowed Roles:```js\n" + Arr2Tbl(ret) + "```");
    }
    let gRoles = message.guild.roles;
    let gMember = message.member;
    let jlRoles = [];
    let type = "Joined";
    args = args.map((arg) => arg.toLowerCase());
    let matching_roles = gRoles.filter((role) => {
      let lname = role.name.toLowerCase();
      return roles.includes(lname) && args.includes(lname);
    });
    if (args[0] === "l") {
      type = "Left";
      matching_roles = matching_roles.filter((role) => gMember.roles.has(role.id));
      gMember.removeRoles(matching_roles).then(() => {
        message.reply(`${type} \`${matching_roles.array().map((role) => role.name).join("`, `")}\`.`) // bring this out front
      }).catch((e) => {
        console.error(e);
        message.reply(`Sorry, we hit an error`);
      })
    } else {
      // wait i can just do addroles.....
      // join by default
      // just look at the args because even if the first one is j then you can't join the role j
      matching_roles = matching_roles.filter((role) => !gMember.roles.has(role.id));
      gMember.addRoles(matching_roles).then(() => {
        message.reply(`${type} \`${matching_roles.array().map((role) => role.name).join("`, `")}\`.`) // bring this out front
      }).catch((e) => {
        console.error(e);
        message.reply(`Sorry, we hit an error`);
      })
    }
  }
}
