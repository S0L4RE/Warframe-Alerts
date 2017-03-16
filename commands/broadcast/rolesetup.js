const roles = require("./allowed_roles.json").roles;

module.exports = {
  name: "rolesetup",
  desc: "set up the alert roles",
  example: "rolesetup, rolesetup pc, rolesetup ps4",
  run: (bot, message, args) => {
    let addedRoles = [];
    let filter = ["pc", "xb1", "ps4"];
    if (args.length > 0) {
      filter = args;
    }
    if (message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS") && message.guild.member(bot.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
      for (let idx = 0; idx < roles.length; idx++) {
        let x = message.guild.roles.find((role) => {
          let lname = role.name.toLowerCase();
          let lsearch = roles[idx].toLowerCase();
          // doing lowercase multiple times oh well
          return lname === lsearch;
        });
        if (!x && filter.some((ele) => {
          if (ele === "pc") {
            return !roles[idx].startsWith("xb1") && !roles[idx].startsWith("ps4");
          }
          return roles[idx].startsWith(ele);
        })) { // role doesn't exist
          addedRoles.push(roles[idx]);
          setTimeout(function(){message.guild.createRole({name: roles[idx], mentionable: true})}, 5000 * idx);
        }
      }
      message.reply("Creating roles `" + addedRoles.join("`, `") + "`");
    } else {
      message.reply("Someone is missing manage role permissions, either you or me.");
    }
  }
}
