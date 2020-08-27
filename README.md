[![Build Status](https://github.com/tstibbs/geo-bagging/workflows/CI/badge.svg)](https://github.com/tstibbs/geo-bagging/actions?query=workflow%3ACI)
[![GitHub issues](https://img.shields.io/github/issues/tstibbs/geo-bagging.svg)](https://github.com/tstibbs/geo-bagging/issues)
[![GitHub license](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://raw.githubusercontent.com/tstibbs/geo-bagging/master/LICENSE)

## What is this?
This project creates a map showing markers from a number of difference data sources showing historical POIs (e.g. trig points, milestones, follies). Some of this information is already available in map form, but this project aims to bring these datasources together and present the information on one interface. 

Note this started as an excuse to learn about a few javascript libraries that I'd not had a reason to use (e.g. leaflet). Therefore I'm sure there are simpler ways to achieve some of these things.

## How can I try it?
[Map showing many markers with a category-based selector](https://tstibbs.github.io/geo-bagging/)

[Mini-map that can be embedded into another page](https://tstibbs.github.io/geo-bagging/examples/mini.html)

## Why are the marker icons so bad?
I'm not good with colours or icons; I'd welcome any contributions.

## Unit tests
There are some basic unit tests covering some of the functionality. To run these go here https://tstibbs.github.io/geo-bagging/test.html or run these commands:
```
cd ui
npm install
npm run test
```

## Integration with other sites
As a demonstration of some things this project can be used for, some basic integration with trigpointing.uk has been created, see [Integration](ui/src/includes/integration/trigpointing.md) for details.

## Licence
Please see [here](Licences.md) for important information regarding the licence of this project.
