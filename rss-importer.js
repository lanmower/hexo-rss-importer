/* jshint node: true */
'use strict';

// const rssMigrator = require('hexo-migrator-rss');

exports.start = function (hexo) {

  hexo.on('ready', function() {
    var CronJob = require('cron').CronJob;
    new CronJob('0 0,15,30,45 * * * *', function() {
      console.log('You will see this message every 15 minutes - ', moment().format('h:mmA'));
    });
  });

};