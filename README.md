# map-tile-compare
A single-page web application for comparing a tile layer with a background satellite layer.

## Demos

* [Edinburgh](https://map-tile-compare.leifgehrmann.com/#https://tiles.leifgehrmann.com/configs/edinburgh_2.json)

## Installing the app

After cloning this repository, run:

```console
$ cd map-tile-compare
$ npm install
$ npm run build
$ npm run serve
```

This should start a localhost server, usually `http://localhost:5000`.

For the page to load you'll need to append a URL to a config file to the URL.

```
http://localhost:5000/#https://example.com/path/to/config.json
```

## Creating a map config

The map data is a compressed JSON string stored in the URL's hash.

Host the following JSON file on a website and update each property to your choosing:

```json
{
  "name": "London",
  "beforeStyle": "mapbox://styles/mapboxUsername/styleId",
  "beforeStyleAccessToken": "xx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxx-xxxxxxxx",
  "beforeStyleBeforeLayerId": "tunnel-street-minor-low",
  "sourceTiles": "https://example.com/tiles/{z}/{x}/{y}.png",
  "sourceTileScheme": "tms",
  "sourceTileSize": 256,
  "sourceMinZoom": 9,
  "sourceMaxZoom": 15,
  "sourceBounds": [-0.234, 51.454, -0.025, 51.562],
  "referencePhotoImageUrl": "https://example.com/previewImage.jpg"
}
```

The table below explains the meaning of each property:

| Property | Description |
|---|---|
| `name` | The name of the map. This is displayed on the splash screen. |
| `beforeStyle` | The mapbox style url for the "before" map, typically the "Satellite" style. |
| `beforeStyleAccessToken` | The mapbox access token for the "before" map style. |
| `beforeStyleBeforeLayerId` | The layer id within the "before" map style where you want to insert your "after" map layer. It's usually the layer immediately above the raster layer. |
| `sourceTiles` | The URL to your map tiles. |
| `sourceTileScheme` | The schema for your map tiles. Either `"xyz"` or `"tms"`. |
| `sourceTileSize` | The image size of your map tiles in pixels. |
| `sourceMinZoom` | The minimum zoom level of your map tiles. |
| `sourceMaxZoom` | The maximum zoom level of your map tiles. |
| `sourceBounds` | The bounding box of your map tiles. In the order of: left-longitude, bottom-latitude, right-longitude, top-latitude. |
| `referencePhotoImageUrl` | The URL to the preview image to display before loading the map. |

After creating the JSON, you have two options:

* Store the JSON to an external host.
* Store the JSON file in the `public/` directory and run `npm run build`. The file can then be accessed via `http://localhost:5000/yourConfig.json`.

Grab the URL to the JSON and append it to the app's host URL:

```
http://locahost:5000/#http://localhost/5000/config.json
```

Your config will now load in the browser!

## Development

```console
$ npm run dev
```

### Linting

```console
$ npm run lint
```

### Tests

To run end to end tests, in one console run:

```console
$ npm run serve
```

Then in a different console, run:

```console
$ export CYPRESS_MAP_TILE_COMPARE_HOST='http://localhost:5000/'
$ npm run test:e2e
```

This should also generate code coverage automatically, which can be viewed in `coverage/`.
