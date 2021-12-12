'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./keystone6-document-gallery-block.cjs.prod.js");
} else {
  module.exports = require("./keystone6-document-gallery-block.cjs.dev.js");
}
