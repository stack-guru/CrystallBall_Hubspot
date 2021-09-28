var cc = DataStudioApp.createCommunityConnector();

// [START get_config]
// https://developers.google.com/datastudio/connector/reference#getconfig
function getConfig() {
  var config = cc.getConfig();

  config.setDateRangeRequired(true);

  return config.build();
}
// [END get_config]
