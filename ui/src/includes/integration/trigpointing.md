## [trigpointing.uk](http://trigpointing.uk)

There is some basic integration with T:UK. Whilst the scope of this project is beyond just trig points, this integration is here as a demonstration of what is possible.

The integration allows you to display your T:UK search results on a map, and can also replace the mini-map on the individual trig details pages.

The simplest way is to save the following link into your bookmarks. Then when you are on the T:UK page you can simply click on your bookmark to embed the map from this project into the page you're on. Refreshing the page will reset it back to how it was before clicking the bookmark. Drag this link into your bookmarks/favourites: <a href="javascript:(function()%7Bvar%20s%3Ddocument.createElement(%22script%22)%3Bs.src%3D%22https%3A%2F%2Ftstibbs.github.io%2Fgeo-bagging%2Fintegration%2Ftrigpointing.js%22%3Bdocument.body.appendChild(s)%3B%7D)()">Add map to T:UK</a>

Or if that doesn't work, you can open the developer console (usually by pressing `F12`) and execute the following code:

```
$.getScript("https://tstibbs.github.io/geo-bagging/integration/trigpointing.js");
```

### Other

The full map (showing data sources other than just trig points): https://tstibbs.github.io/geo-bagging/

Requests for support: https://github.com/tstibbs/geo-bagging/discussions

Bug reports: https://github.com/tstibbs/geo-bagging/issues
