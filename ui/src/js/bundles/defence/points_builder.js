import AbstractPointsBuilder from '../abstract_points_builder';

var Builder = AbstractPointsBuilder.extend({
    parse: function(point) {
        //[Longitude,Latitude,Id,Type,Purpose,Category,Style,Link,location,Condition,description,imageLinks]
        var lng = point[0];
        var lat = point[1];
        var id = point[2];
        var type = point[3];
        var purpose = point[4];
        var category = point[5];
        var style = point[6]
        var url = point[7];
        var location = point[8];
        var condition = point[9];
        var description = point[10];
        var imageLinks = point[11];

        var extraInfos = [
            ['Style', style],
            ['Position', location],
            ['Notes', description],
            ['Purpose', purpose]
        ];
        if (!style.includes(type) || category != null) { //if type is included in style and category is null, don't display
            var typeString = type
            if (category != null) {
                typeString += " / " + category
            }
            extraInfos.push(['Type', typeString])
        }
        extraInfos.push(['Images', this.buildImageLinks(imageLinks)]);
        this.addMarker(id, lat, lng, url, id, extraInfos, null, [purpose, type, condition]);
    },
});

export default Builder
