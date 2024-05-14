## [trigpointing.uk](http://trigpointing.uk)

There is some basic integration with T:UK. Whilst the scope of this project is beyond just trig points, this integration is here as a demonstration of what is possible.

The integration allows you to display your T:UK search results on a map, and can also replace the mini-map on the individual trig details pages.

The simplest way is to use the bookmarklet below:

<a href="javascript:(function()%7Bvar%20s%3Ddocument.createElement(%22script%22)%3Bs.src%3D%22https%3A%2F%2Ftstibbs.github.io%2Fgeo-bagging%2Fintegration%2Ftrigpointing.js%22%3Bdocument.body.appendChild(s)%3B%7D)()">Add map to T:UK</a>

- Either drag the link above into your bookmarks
- Or right-click (or long-press on a mobile device) on the link, select `Copy link address`, then create a new bookmark, with the copied link as the URL of the bookmark

## Desktop Devices

Tested on Chrome on Windows, but likely to work in other modern browsers on other operating systems.

1. When on a T:UK page, click the bookmark created above to load the map view.
1. Refresh the page to return to the original page without the extra map view.

If the bookmarklet doesn't work at all, you can open the developer console (usually by pressing `F12`) and paste the following code, then press enter:

```
$.getScript("https://tstibbs.github.io/geo-bagging/integration/trigpointing.js");
```

## Mobile Devices

Tested in Chrome on Android, but likely to work in other modern browsers on iOS and other devices types.

1. When on a T:UK page, click in to the address bar.
1. Type the name of your bookmarklet (e.g. type "Add map to T:UK" if using the name as it appears above).
1. Select the bookmarklet in the list.

## Other platforms

See note about which browsers are supported: <https://github.com/tstibbs/geo-bagging/#what-browsers-does-this-support>

## Resources

The full map (showing data sources other than just trig points): <https://tstibbs.github.io/geo-bagging/>

Questions and feature suggestions: <https://github.com/tstibbs/geo-bagging/discussions>

Bug reports: <https://github.com/tstibbs/geo-bagging/issues>
