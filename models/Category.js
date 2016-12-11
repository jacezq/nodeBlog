/**
 * Created by jace on 2016/12/6.
 */

var mongoose = require('mongoose');
var categoryies = require('../schemas/categoryies');
module.exports = mongoose.model('Category', categoryies);