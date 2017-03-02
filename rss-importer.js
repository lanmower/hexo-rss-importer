/* jshint node: true */
'use strict';

// const rssMigrator = require('hexo-migrator-rss');
const moment = require('moment');
const cmd = require('node-cmd');

exports.start = function (hexo) {

  hexo.on('ready', function() {

    // Only process when running hexo server command
    if (process.argv.indexOf('server') === -1) {
      return;
    }

    // Config setup is required
    if (!hexo.config || !hexo.config.rss_importer || hexo.config.rss_importer.feeds) {
      return;
    }

    console.log('Starting RSS Importer cronjob');
    var CronJob = require('cron').CronJob;
    // Run every 15 minutes by default
    var interval = hexo.config.rss_importer.interval || 15;

    return new CronJob('0 */' + interval + ' * * * *', function() {

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