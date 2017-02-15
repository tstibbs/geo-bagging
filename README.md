[![Build Status](https://travis-ci.org/tstibbs/geo-bagging.svg?branch=master)](https://travis-ci.org/tstibbs/geo-bagging)
[![Coverage Status](https://coveralls.io/repos/github/tstibbs/geo-bagging/badge.svg?branch=master)](https://coveralls.io/github/tstibbs/geo-bagging?branch=master)
[![GitHub issues](https://img.shields.io/github/issues/tstibbs/geo-bagging.svg)](https://github.com/tstibbs/geo-bagging/issues)
[![bitHound Overall Score](https://www.bithound.io/github/tstibbs/geo-bagging/badges/score.svg)](https://www.bithound.io/github/tstibbs/geo-bagging)
[![GitHub license](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://raw.githubusercontent.com/tstibbs/geo-bagging/master/LICENSE)
[![Build Status](https://saucelabs.com/buildstatus/tstibbs)](https://saucelabs.com/beta/builds/5e191601dd4c46cd9c06b041910365ed)
[![Build Status](https://saucelabs.com/browser-matrix/tstibbs.svg)](https://saucelabs.com/beta/builds/5e191601dd4c46cd9c06b041910365ed)

## What is this?
This project creates a map showing markers from a number of difference data sources showing historical POIs (e.g. trig points, milestones, follies). Some of this information is already available in map form, but this project aims to bring these datasources together and present the information on one interface. 

Note this started as an excuse to learn about a few javascript libraries that I'd not had a reason to use (e.g. leaflet). Therefore I'm sure there are simpler ways to achieve some of these things.

## How can I try it?
[Map showing many markers with a category-based selector](https://tstibbs.github.io/geo-bagging/examples/index.html?datasources=milestones,hills)

[Mini-map that can be embedded into another page](https://tstibbs.github.io/geo-bagging/examples/mini.html)

## Why are the marker icons so bad?
I'm not good with colours or icons; I'd welcome any contributions.

## Unit tests
There are some basic unit tests covering some of the functionality. To run these go here https://tstibbs.github.io/geo-bagging/test/qunit_suite/test.html or run these commands:
```
npm install
npm test
```

## [trigpointing.uk](http://trigpointing.uk)
There is some basic integration with T:UK. Whilst the scope of this project is beyond just trig points, this integration is here as a demonstration of what is possible.

Firstly, you can replace the mini map that shows on a trig point's details page with one from this project. Run the following (e.g. in Chrome press F12 and then paste this code into the console):
```
$.getScript("https://tstibbs.github.io/geo-bagging/integration/trigpointing_embed.js");
```

There is also some integration to allow you to display the results of a T:UK search on this map. To do this, you simply need to do a search on trigpointing.uk, then run the following (e.g. in Chrome press F12 and then paste this code into the console):
```
$.getScript("https://tstibbs.github.io/geo-bagging/integration/trigpointing.js");
```
After a short delay it should redirect you to this site and display the results of your search. Note that for now the integration between the two sites relies on passing a bunch of stuff in the URL so you will need to keep the search to something that returns a smallish number of results (maybe a few 10s) to ensure the URL doesn't get truncated by your browser. Searches for 'name contains' will usually give you a small number (try 'castle' or 'tor').

## Licence
Please see [here](Licences.md) for important information regarding the licence of this project.
