## Running the UI

Open `examples/index.html` in your web browser. Note that in some web browsers loading any of the data sources will not work, as the UI makes ajax calls to load files, which is sometimes blocked. Chrome allows you to get around this by running it like this:

```
chrome.exe --allow-file-access-from-files
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
1. Place downloaded file into `converters/tmp-input/trigs` (deleting any other files)
1. `node trigs.js`
