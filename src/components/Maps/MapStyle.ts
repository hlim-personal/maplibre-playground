export const MapStyle: any = {
    version: 8,
    sources: {
        "osm": {
            "type": "raster",
            "tiles": ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            "tileSize": 256,
            "attribution": "&copy; OpenStreetMap Contributors",
            "maxzoom": 19,

        }
    },
    layers: [
        {
            "id": "osm",
            "type": "raster",
            "source": "osm"
        }
    ],
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf"
};