const updateFuncs = {
  droprates: require("./drop_rates.js").update,
  language: require("./languages.js").update,
  missiondecks: require("./mission_decks.js").update,
  starchart: require("./star_chart.js").update
}

module.exports = {
  masterUpdate: () => {
    return new Promise((resolve) => {
      Promise.all(Object.values(updateFuncs).map((func) => func())).then((res) => {resolve(res)});
    })
  }
}
