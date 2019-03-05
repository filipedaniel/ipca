
// Global variables configs
var config = {};
config.authentication = {
  salt: 10,
  jwtKey: 'ipca-as'
},
config.mongodb = {
  port : '27017',
  connection : 'mongodb://localhost',
  databaseName : 'ipca-as-tp2'
}
config.defaultVariables = {
  paginationLimit : 10
}
//config.baseUrl= '/api/v1';
module.exports = config;
