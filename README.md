# LANMOWER fixed commandline calls

# Hexo RSS Importer
Regularly scan for new articles from syndications and import them into your blog

## Install
``` bash
$ npm install hexo-rss-importer --save
```

## Configuration
In order to activate Hexo RSS Importer for your blog you need to update your _config.yml.

At the bare minimum there needs to be a list of feeds which you wish you import.
```yml
rss_importer:
  reventDuplicates: true
  feeds:
    - url: https://github.com/danmactough/node-feedparser/raw/master/test/feeds/rss2sample.xml
      limit: 1
```
By default the Hexo RSS Importer will search for updates every 15 minutes.

Let's say you want it to run once every day and you want it to import 3 posts.

```yml
rss_importer:
  preventDuplicates: true
  interval: 1440
  feeds:
    - url: https://github.com/danmactough/node-feedparser/raw/master/test/feeds/rss2sample.xml
      limit: 3
```
## Options
`preventDuplicates` [boolean] - Without this flag the importer will import posts it has already imported

`interval` [number] - Time between imports in minutes

`feeds` [array] - List of feeds to be imported.

   `url` [string] - The URL of the RSS feed which is to be imported. Part of each `feed`.

   `limit` [number] - The number of posts to be imported at a time from this `feed`.
