module.exports = {
  matchRoles: (event, guild) => {
    const roleNames = event.rewards;
    const type = event.platform_type === "pc" ? "" : event.platform_type + "_";
    let matchingRoles = [];
    for (role of roleNames) {
      fr = guild.roles.find((r) => (type + role).toLowerCase().includes(r.name.toLowerCase()));
      if(fr) {
        matchingRoles.push(fr.toString());
      }
    }
    return matchingRoles;
  }
}
