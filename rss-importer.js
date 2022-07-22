/* jshint node: true */
'use strict';

const moment = require('moment');
let exec = require('child_process').exec;
function os_func() {
  this.execCommand = function (cmd) {
      return new Promise((resolve, reject)=> {
         exec(cmd, (error, stdout, stderr) => {
           if (error) {
              reject(error);
              return;
          }
          resolve(stdout)
         });
     })
 }
}
var os = new os_func();
exports.start = function(hexo) {

  hexo.on('ready', async function() {

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
    let job = async function() {

      const cmd = require('node-cmd');
      hexo.log.i('You will see this message every ' + interval + ' minutes - ', moment().format('h:mmA'));

      let preventDuplicatesFlag = ' ';
      if (hexo.config.rss_importer.preventDuplicates) {
        preventDuplicatesFlag += '--skipduplicate';
      }
      let creatorflag = '';

      let run = async (input)=>{
        console.log(input);
        return os.execCommand(input);
      }
      for (let i = 0; i < hexo.config.rss_importer.feeds.length; i++) {
        let feed = hexo.config.rss_importer.feeds[i];
        if (feed.creator) {
          creatorflag += '--creator ' +feed.creator;
        }
        await run('hexo migrate rss ' + feed.url + ' --limit ' + feed.limit + preventDuplicatesFlag+ ' ' + creatorflag)
      }
      await run('hexo generate');
      await run('cp -r public/* ~/mutagen/client/public/');
      await run('cd ~/mutagen/client && node uploader.js');

    }
    let cron = new CronJob('0 */' + interval + ' * * * *', job, null, true, 'America/Toronto');
    job();
    return cron;
  });

};
