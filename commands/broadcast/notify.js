const roles = require("./allowed_roles.json").roles;

module.exports = {
  name: "notify",
  run: (bot, message, args) => {
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
      matching_roles.forEach((role) => {
        gMember.removeRole(role)
        .then((role) => {
          jlRoles.push(role.name);
        }).catch((e) => {})
      })
    } else {
      // join by default
      // just look at the args because even if the first one is j then you can't join the role j
      matching_roles.forEach((role) => {
        gMember.addRole(role)
        .then((role) => {
          jlRoles.push(role.name);
        }).catch((e) => {})
      })
    }
    message.reply(`${type} ${jlRoles}.`)
  }
}
