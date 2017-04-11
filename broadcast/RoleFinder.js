module.exports = {
  matchRoles: (event, guild) => {
    const roleNames = event.rewards;
    const type = event.platform_type === "pc" ? "" : event.platform_type;
    let matchingRoles = [];
    for (role of roleNames) {
      // if r startswith and replace i guess
      fr = guild.roles.filter((r) => r.name.startsWith(type) && (type + role).toLowerCase().includes(r.name.replace(type, "").toLowerCase()));
      if(fr.size > 0) {
        fr.forEach((r) => matchingRoles.push(r.toString()));
      }
    }
    return matchingRoles;
  }
}
