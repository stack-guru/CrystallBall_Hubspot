var cc = DataStudioApp.createCommunityConnector();

// [START get_schema]
function getFields() {
  var fields = cc.getFields();
  var types = cc.FieldType;
  //var aggregations = cc.AggregationType;

  fields
    .newDimension()
    .setIsHidden(false)
    .setId('title')
    .setName('Title')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setIsHidden(false)
    .setId('day')
    .setName('Date')
    .setType(types.YEAR_MONTH_DAY);

  fields
    .newDimension()
    .setIsHidden(false)
    .setId('category')
    .setName('Category')
    .setType(types.TEXT);
  
  fields
    .newDimension()
    .setIsHidden(false)
    .setId('url')
    .setName('URL')
    .setType(types.URL);
  
  fields
    .newDimension()
    .setIsHidden(false)
    .setId('description')
    .setName('Description')
    .setType(types.TEXT);
  
  
  return fields;
}

// https://developers.google.com/datastudio/connector/reference#getschema
function getSchema(request) {
  return {schema: getFields().build()};
}
// [END get_schema]