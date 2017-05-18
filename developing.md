## Running the UI

Open `examples/index.html` in your web browser. Note that in some web browsers loading any of the data sources will not work, as the UI makes ajax calls to load files, which is sometimes blocked. Chrome allows you to get around this by running it like this:
```
chrome.exe --allow-file-access-from-files
```

## Re-generating the source data
The data for the various sources needs to be transformed in order that we don't send a huge amount of data to the browser, and only send what we need. The transformation scripts are written in javascript and run in [node.js](https://nodejs.org). You will need to install a version of node.js that supports ES6 - v7.4.0 is sufficient, though it may work in some earlier versions too. The processes are slightly inconsistent at the moment. The instructions below are broken down by datasource, and assume you are in the `converters` directory. You will need to run `npm install` first.

### hills
1. `node hills_download.js`
1. `node hills.js`
### milestones
1. `node milestones_download.js`
1. `node milestones.js`
### follies
1. Visit http://www.follies.org.uk/follymaps.htm
1. Click the 'View larger map' button on the right
1. Click the menu icon
1. Select 'Download KML'
1. Click 'Export to a .KML file'
1. Click ok
1. Place downloaded file in `follies-input` and name it `Follies.kml`.
1. Obtain the saxon jar for version 9.1.0.8 or greater (https://repo1.maven.org/maven2/net/sourceforge/saxon/saxon/9.1.0.8/saxon-9.1.0.8.jar).
1. `java -jar saxon-9.1.0.8.jar -xsl:follies-extract.xslt -s:follies-input/Follies.kml -o:follies-input/out.xml`
1. `node follies.js`
### defence
1. `node defence_download.js`
1. Obtain the saxon jar for version 9.1.0.8 or greater (https://repo1.maven.org/maven2/net/sourceforge/saxon/saxon/9.1.0.8/saxon-9.1.0.8.jar).
1. `java -jar saxon-9.1.0.8.jar -xsl:defence-extract.xslt -s:defence-input/doc.kml -o:defence-input/out.xml`
1. `node defence.js`
### nt
*Note this data is not distributed with this project due to licencing restrictions, but the code is provided as an example of how you might obtain the data if it was available.*
1. `node nt.js`
