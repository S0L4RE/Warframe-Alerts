const roles = require("./allowed_roles.json").roles;

module.exports = {
  name: "notify",
  run: (bot, message, args) => {
    if (args.length === 0) return message.reply(`Allowed roles are \`\`\`json\n${JSON.stringify(roles, null, 2)}\`\`\``);
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
        message.reply(`${type} ${matching_roles.array().map((role) => r.name)}.`)
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
