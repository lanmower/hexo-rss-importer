const rssMigrator = require('hexo-migrator-rss');

exports.start = function (hexo) {

  hexo.on('ready', function() {
    console.log('Well look at that.... ');
  });

}