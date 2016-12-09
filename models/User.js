/**
 * Created by jace on 2016/12/6.
 */

var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');
module.exports = mongoose.model('User', usersSchema);