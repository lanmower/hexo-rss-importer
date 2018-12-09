/* jshint node: true */
'use strict';

const moment = require('moment');

exports.start = function(hexo) {

  hexo.on('ready', function() {

    // Config setup is required
    if (!hexo.config || !hexo.config.rss_importer || !hexo.config.rss_importer.feeds) {
      return;
    }

    // Will run only for `hexo server` by default
    let allowedCommand = hexo.config.rss_importer.runCommand || 'server';
    // Only process when running the allowed command as defined by config
    if (process.argv.indexOf(allowedCommand) === -1) {
      return;
    }

    hexo.log.i('Starting RSS Importer cronjob');
    const CronJob = require('cron').CronJob;
    // Run every 15 minutes by default
    let interval = hexo.config.rss_importer.interval || 15;
    let cron = new CronJob('0 */' + interval + ' * * * *', function() {

      const cmd = require('node-cmd');
      hexo.log.i('You will see this message every ' + interval + ' minutes - ', moment().format('h:mmA'));

      let preventDuplicatesFlag = ' ';
      if (hexo.config.rss_importer.preventDuplicates) {
        preventDuplicatesFlag += '--preventDuplicates';
      }

      for (let i = 0; i < hexo.config.rss_importer.feeds.length; i++) {
        let feed = hexo.config.rss_importer.feeds[i];
        cmd.run('hexo migrate rss ' + feed.url + ' --limit ' + feed.limit + preventDuplicatesFlag);
        cmd.run('hexo generate');
      }

    }, null, true, 'America/Toronto');

    return cron;
  });

};
