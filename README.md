# map-tile-compare
A single-page web application for comparing a tile layer with a background satellite layer

## Running the app

After cloning this repository, run:

```console
$ cd map-tile-compare
$ npm install
$ npm run build
$ npm run serve
```

This should start a localhost server on a unique port, usually `http://localhost:5000`.

For the page to load you'll need to append the compressed data to the end of the URL, like the example below. See the
_Creating a map_ for instructions on how to generate the compressed string.

```
http://localhost:5000/#N4IgdiBcIMoIYFsAOA...
``` 

## Creating a map

The map data is a compressed JSON string stored in the URL's hash.

First, make a copy of the `scripts/example.json` and update each property to your choosing.
The table below explains the meaning of each property:

| Property | Description |
|---|---|
| `n` | The name of the map. This is displayed on the splash screen. |
| `bS` | The mapbox style url for the "before" map, typically the "Satellite" style. |
| `bSAT` | The mapbox access token. |
| `bSBLI` | The layer id within the "before" map style where you want to insert your "after" map layer. It's usually the layer immediately above the raster layer. |
| `sT` | The URL to your map tiles. |
| `sTSc` | The schema for your map tiles. Either `"xyz"` or `"tms"`. |
| `sTSi` | The image size of your map tiles in pixels. |
| `sMin` | The minimum zoom level of your map tiles. |
| `sMax` | The maximum zoom level of your map tiles. |
| `sB` | The bounding box of your map tiles. In the order of: left-longitude, bottom-latitude, right-longitude, top-latitude. |
| `rPIU` | The URL to the preview image to display before loading the map. |

Then run `compress.js` with your JSON file to generate the hash.

```console
$ node scripts/compress.js scripts/example.json
N4IgdiBcIMoIYFsAOA...
$
```

You can also decompress an existing string by running `decompress.js`.

```console
$ node scripts/compress.js N4IgdiBcIMoIYFsAOA...
{
  n: 'Sample Name',
  ... 
}
```

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
