/* jshint node: true */
'use strict';

// const rssMigrator = require('hexo-migrator-rss');
const moment = require('moment');
const cmd = require('node-cmd');

exports.start = function (hexo) {

  hexo.on('ready', function() {

    if (process.argv.indexOf('generate') >= 0 || process.argv.indexOf('migrate') >= 0) {
      return;
    }

    console.log('Starting RSS Importer cronjob');
    var CronJob = require('cron').CronJob;
    // Run every 15 minutes by default
    var interval = hexo.config.rss_importer.interval || 15;

    new CronJob('0 */' + interval + ' * * * *', function() {

      console.log('You will see this message every ' + interval + ' minutes - ', moment().format('h:mmA'));

      var preventDuplicatesFlag = ' ';
      if (hexo.config.rss_importer.preventDuplicates) {
        preventDuplicatesFlag += '--preventDuplicates';
      }

      for (var i = 0; i < hexo.config.rss_importer.feeds.length; i++) {
        var feed = hexo.config.rss_importer.feeds[i];
        cmd.run('hexo migrate rss ' + feed.url + ' --limit ' + feed.limit + preventDuplicatesFlag);
        cmd.run('hexo generate');
      }

    }, null, true, 'America/Toronto');
  });

};