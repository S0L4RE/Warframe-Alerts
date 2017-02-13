const roles = require("./allowed_roles.json").roles;

module.exports = {
  name: "rolesetup",
  desc: "set up the alert roles",
  example: "rolesetup",
  run: (bot, message, args) => {
    let addedRoles = [];
    if (message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS") && message.guild.member(bot.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
      for (let idx = 0; idx < roles.length; idx++) {
        let x = message.guild.roles.find((role) => {
          let lname = role.name.toLowerCase();
          let lsearch = roles[idx].toLowerCase();
          // doing lowercase multiple times oh well
          return lname === lsearch;
        });
        if (!x) { // role doesn't exist
          addedRoles.push(roles[idx]);
          setTimeout(function(){message.guild.createRole({name: roles[idx], mentionable: true})}, 5000 * idx);
        }
      }
      message.reply("Creating roles " + addedRoles);
    } else {
      message.reply("Someone is missing manage role permissions, either you or me.");
    }
  }
}
