const roles = require("./allowed_roles.json").roles;
const arrayThings = require("../../util/arrayThings");

module.exports = {
  name: "notify",
  desc: "join or leave roles",
  example: "notify, notify j forma, notify l kavat forma",
  run: (bot, message, args) => {
    if (args.length === 0) {
      let ret = [];
      for (let i = 0; i < roles.length; i += 5) {
        let role4 = [];
        for (let j = 0; j < 5 && i + j < roles.length; j++) {
          // if (roles[i + j].startsWith("xb1") || roles[i + j].startsWith("ps4")) continue;
          if (message.guild.roles.find((r) => r.name.toLowerCase() === roles[i+ j].toLowerCase()))
            role4.push(roles[i + j]);
        }
        if (role4.length > 0)
          ret.push(role4);
      }
      return message.reply("Allowed Roles:```js\n(notice that roles for other platforms just have the plaform name before them)\n" + arrayThings.array2dtable(ret) + "```");
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
      gMember.removeRoles(matching_roles).then(() => {
        message.reply(`${type} ${matching_roles.array().map((role) => role.name)}.`)
      }).catch((e) => {
        console.error(e);
        message.reply(`Sorry, we hit an error`);
      })
      /*
      matching_roles.forEach((role) => {
        gMember.removeRole(role)
        .then((role) => {
          jlRoles.push(role.name);
        }).catch((e) => {})
      })
      */
    } else {
      // wait i can just do addroles.....
      // join by default
      // just look at the args because even if the first one is j then you can't join the role j
      gMember.addRoles(matching_roles).then(() => {
        message.reply(`${type} ${matching_roles.array().map((role) => role.name)}.`)
      }).catch((e) => {
        console.error(e);
        message.reply(`Sorry, we hit an error`);
      })
      /*
      matching_roles.forEach((role) => {
        gMember.addRole(role)
        .then((role) => {
          jlRoles.push(role.name);
        }).catch((e) => {})
      })
      */
    }
  }
}
