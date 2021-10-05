var cc = DataStudioApp.createCommunityConnector();

// [START get_data]
// https://developers.google.com/datastudio/connector/reference#getdata
function getData(request) {
  request.configParams = validateConfig(request.configParams);

  var requestedFields = getFields().forIds(
    request.fields.map(function(field) {
      return field.name;
    })
  );

  try {
    var apiResponse = fetchDataFromApi(request);
    var normalizedResponse = normalizeResponse(request, apiResponse);
    var data = getFormattedData(normalizedResponse, requestedFields);
  } catch (e) {
    cc.newUserError()
      .setDebugText('Error fetching data from API. Exception details: ' + e)
      .setText(
        'The connector has encountered an unrecoverable error. Please try again later, or file an issue if this error persists.'
      )
      .throwException();
  }

  return {
    schema: requestedFields.build(),
    rows: data
  };
}

/**
 * Validates config parameters and provides missing values.
 *
 * @param {Object} configParams Config parameters from `request`.
 * @returns {Object} Updated Config parameters.
 */
function validateConfig(configParams) {
  configParams = configParams || {};
  configParams.api_key = configParams.api_key;

  return configParams;
}

/**
 * Gets response for UrlFetchApp.
 *
 * @param {Object} request Data request parameters.
 * @returns {string} Response text for UrlFetchApp.
 */
function fetchDataFromApi(request) {
  return getAnnotations(getCredentials().key, request.dateRange.startDate, request.dateRange.endDate);
}

/**
 * Parses response string into an object. Also standardizes the object structure
 * for single vs multiple packages.
 *
 * @param {Object} request Data request parameters.
 * @param {string} responseString Response from the API.
 * @return {Object} Contains package names as keys and associated download count
 *     information(object) as values.
 */
function normalizeResponse(request, responseString) {
  var response = JSON.parse(responseString);
  return response;
}


/**
 * Formats the parsed response from external data source into correct tabular
 * format and returns only the requestedFields
 *
 * @param {Object} parsedResponse The response string from external data source
 *     parsed into an object in a standard format.
 * @param {Array} requestedFields The fields requested in the getData request.
 * @returns {Array} Array containing rows of data in key-value pairs for each
 *     field.
 */
function getFormattedData(response, requestedFields) {
  var data = [];
  response.annotations.map(function(annotation) {
    var formattedData = formatData(requestedFields, annotation);
    data = data.concat(formattedData);
  });
  return data;
}
// [END get_data]

/**
 * Formats a single row of data into the required format.
 *
 * @param {Object} requestedFields Fields requested in the getData request.
 * @param {string} packageName Name of the package who's download data is being
 *    processed.
 * @param {Object} dailyDownload Contains the download data for a certain day.
 * @returns {Object} Contains values for requested fields in predefined format.
 */
function formatData(requestedFields, annotation) {
  var row = requestedFields.asArray().map(function(requestedField) {
    switch (requestedField.getId()) {
      case 'title':
        return annotation.event_name;
      case 'day':
        return annotation.show_at.substr(0,10).replace(/-/g, '');
      case 'category':
        return annotation.category;
      case 'url':
        return annotation.url;
      case 'description':
        return annotation.description;
      case 'user_name':
        return annotation.user_name;
      case 'google_analytics_property_name':
        return (annotation.google_analytics_property_name == null ? 'All Properties' : annotation.google_analytics_property_name);
      default:
        return '';
    }
  });
  return {values: row};
}
