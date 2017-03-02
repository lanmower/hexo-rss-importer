'use strict';

var should = require('chai').should(),
  rssImporter = require('../rss-importer.js'),
  fakehexoFactory = require('./fake-hexo-factory.js'),
  fakeHexo,
  importer;

describe("RSS Importer", function () {

  this.timeout(10000);

  context("no config", function () {

    beforeEach(function () {
      fakeHexo = fakehexoFactory.create();
      importer = rssImporter.start(fakeHexo);
    });

    it("will not start cron with no config", function () {
      should.not.exist(importer);
    });
  });

  context("first config setup", function () {

    beforeEach(function () {
      fakeHexo = fakehexoFactory.create({
        rss_importer: {
          feeds: []
        }
      });
      importer = rssImporter.start(fakeHexo);
    });

    it("will not start cron with no config", function () {
      should.not.exist(importer);
    });
  });

});