'use strict';

const should = require('chai').should,
  expect = require('chai').expect,
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  mockery = require('mockery'),
  rssImporter = require('../rss-importer.js'),
  fakehexoFactory = require('./fake-hexo-factory.js');

let fakeHexo,
  importer;

describe("RSS Importer", function () {

  this.timeout(10000);

  context("no config", function () {

    beforeEach(function () {
      fakeHexo = fakehexoFactory.create();
      importer = rssImporter.start(fakeHexo);
    });

    it("will not start cron", function () {
      expect(fakeHexo.triggerOn('ready')).to.be.undefined;
    });
  });

  context("no allowed script config", function () {

    beforeEach(function () {
      fakeHexo = fakehexoFactory.create({
        rss_importer: {
          feeds: []
        }
      });
      importer = rssImporter.start(fakeHexo);
    });

    it("will not start cron", function () {
      expect(fakeHexo.triggerOn('ready')).to.be.undefined;
    });
  });

  context("test is an allowed script config", function () {

    beforeEach(function () {
      fakeHexo = fakehexoFactory.create({
        rss_importer: {
          feeds: [],
          runCommand: 'test'
        }
      });
      importer = rssImporter.start(fakeHexo);
    });

    it("will process cron", function () {
      expect(fakeHexo.triggerOn('ready')).to.not.be.undefined;
    });
  });

  context("stub Cron & Node-CMD", function () {

    const cron = require('cron');
    let cronStubbed = false,
      cmdOutputs = [],
      eventCallback;

    beforeEach(function (done) {
      mockery.enable();
      var cronMock = {
        CronJob: function (timer, callback) {
          callback();
          cronStubbed = true;
        }
      };
      mockery.registerMock('cron', cronMock);
      var cmdMock = {
        run: function (string) {
          cmdOutputs.push(string);
          return string;
        }
      };
      mockery.registerMock('node-cmd', cmdMock);
      fakeHexo = fakehexoFactory.create({
        rss_importer: {
          feeds: [{
            url: 'https://github.com/danmactough/node-feedparser/raw/master/test/feeds/rss2sample.xml',
            limit: 1
          }],
          runCommand: 'test'
        }
      });
      fakeHexo.isReady(function(){
        done();
      });
      rssImporter.start(fakeHexo);
      eventCallback = fakeHexo.triggerOn('ready');
    });

    it("will execute migration commands", function () {
      expect(cronStubbed).to.be.true;
      expect(cmdOutputs).to.deep.equal([
        'hexo migrate rss https://github.com/danmactough/node-feedparser/raw/master/test/feeds/rss2sample.xml --limit 1 ',
        'hexo generate'
      ]);
    });

    after(function(){
      mockery.disable();
    });
  });

});