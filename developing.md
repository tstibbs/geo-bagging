## Running the UI

```
cd ui
npm install
npm run dev
```

## Updating the source data

The data for the various sources needs to be transformed in order that we don't send a huge amount of data to the browser, and only send what we need. The transformation scripts are written in javascript and run in [node.js](https://nodejs.org). You will need to install a version of node.js that supports ES6 - v7.4.0 is sufficient, though it may work in some earlier versions too.

1. `cd converters`
1. `npm install`
1. `node all`

### Non distributed data sources

_These datasources are not distributed with this project due to licencing restrictions, but the code is distributed as an example of how to obtain the data for personal use._

#### `nt`

1. `node nt.js`

#### `trigs`

1. Visit [trigpointing.uk/trigs/](http://trigpointing.uk/trigs/)
1. Click `Download Trigpoints`
1. Select "Download file format": `CSV`
1. Select "Customise for": (pick a blank)
1. Click `Download`
1. Place downloaded file into `converters/tmp-data-processing/input-data/trigs` (deleting any other files)
1. `node trigs.js`
