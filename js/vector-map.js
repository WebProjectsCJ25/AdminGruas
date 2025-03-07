// Initialize the vector map
var map = new jsVectorMap({
    selector: "#vector-map",
    map: "world_merc",
    zoomOnScroll: false,
    zoomButtons: false,
    selectedMarkers: [1, 3],
    markersSelectable: true,
    markers: [{
        name: "USA",
        coords: [40.71296415909766, -74.00437720027804]
    },
    {
        name: "Germany",
        coords: [51.17661451970939, 10.97947735117339]
    },
    {
        name: "Brazil",
        coords: [-7.596735421549542, -54.781694323779185]
    },
    {
        name: "Russia",
        coords: [62.318222797104276, 89.81564777631716]
    },
    {
        name: "China",
        coords: [22.320178999475512, 114.17161225541399],
        style: {
            fill: '#E91E63'
        }
    }
    ],
    markerStyle: {
        initial: {
            fill: "#e91e63"
        },
        hover: {
            fill: "E91E63"
        },
        selected: {
            fill: "E91E63"
        }
    },


});
