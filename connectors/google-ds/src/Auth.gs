var cc = DataStudioApp.createCommunityConnector();

// https://developers.google.com/datastudio/connector/reference#getauthtype
function getAuthType() {
  return cc.newAuthTypeResponse()
    .setAuthType(cc.AuthType.KEY)
    .build();

}

// https://developers.google.com/datastudio/connector/reference#isadminuser
function isAdminUser() {
  return true;
}

function setCredentials(request) {
  var key = request.key;
  if (key == null) return { errorCode: 'INVALID_CREDENTIALS'};
  
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('gaa.key', key);
  return {    errorCode: 'NONE'  };
}

function resetAuth() {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.deleteProperty('gaa.key');
}

function isAuthValid() {
  var userProperties = PropertiesService.getUserProperties();
  var key = userProperties.getProperty('gaa.key');

  var url = [
    'https://app.gaannotations.com',
    '/api/v1/google-data-studio/annotations',
    '?',
    'startDate=20010101',
    '&endDate=20010101',
    '&show_manual_annotations=true',
    '&show_csv_annotations=true',
    '&show_api_annotations=true',
  ].join('');
  
  // https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app
    var response = UrlFetchApp.fetch(url, {
      "muteHttpExceptions": true,
      "headers": {
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    return response.getResponseCode() == 200;
}

function getCredentials() {
  var userProperties = PropertiesService.getUserProperties();
  var key = userProperties.getProperty('gaa.key');
  return {  key: key  };
}