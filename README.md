# Animated globe on page scroll

D3 globe - animates rotation and zoom to defined locations nominated in content parts



## Configuring globe scenes

The `parts.json` file controls all of the content for the overlays and the rotation, scale and highlight settings on the globe. It consists of an array of object, each object (detailed below) controls each scene.

| Key | Children | Use | type |
|:---|:---|:---|:---|
| Splash | | Intended as the first 'scene', used as the main title and intro | Object |
|  | Title | Main title of the piece | String |
|  | Intro | Introduction to the piece | String |
|  | Image | Small image to display in the splash area (takes src, alt and width properties) | Object |
|  |  |  |  |
| Kicker |  | Short text displayed at the top the content (card) overlay | String |
| Title |  | Title for the overlay card | String |
| Text |  | Caption text for the card, each array entry is a paragraph | Array of Strings |
|  |  |  |  |
| Images |  | Array of objects of images to display in the overlay cards | Array |
|  | Image Object | Image properties (src, alt and width) | Object |
|  |  |  |  |
| Map |  | Settings to update the globe | Object |
|  | country | Name of the country to rotate into central position (lowercase) | String |
|  | scale | Scale (zoom level) of the globe | Float |
|  | focus | Names of countries to highlight as main features | Array of Strings |
|  | highlights | Secondary list of countries to highlight (can have dofferent color) | Array of Strings |
|  | points | Additional markers to render on the globe (generate the object data at [geojson.io](https://geojson.io) | Array of Objects |

__Example of section part json:__

``` json
{
  "splash": {
    "title": "Main title<br />over two decks",
    "intro": false,
    "image": { "src": "placeholder", "alt": "", "width": 200, "type": "splash "}
  },
  "kicker": "Melbourne, Australia",
  "title": "1991",
  "text": [
    "Ex nostrud dolor et ex consequat incididunt irure exercitation fugiat. Occaecat eiusmod id cupidatat consequat culpa velit irure ullamco proident ipsum. Fugiat quis duis sit consequat reprehenderit anim cupidatat occaecat qui ut sint Lorem minim. Qui exercitation elit fugiat id laborum fugiat ipsum. Ea ea et laborum sint consequat cupidatat laboris qui exercitation labore ad non nostrud excepteur. Elit sunt tempor ad tempor sit."
  ],
  "images": false,
  "map": {
    "country": "iceland",
    "scale": 0.5,
    "focus": ["spain"],
    "highlights": ["france"],
    "points": [
      {
        "geometry": {
          "type": "Point",
          "coordinates": [144.93576049804688, -37.815208598896234]
        }
      }
    ]
  }
}

```


## Style options
There are a series of options that be easily set to change some styling options on the globe. The `theme` will make general changes through the template while the more specfic items allow for a fine control to customise within these themes:

```js
{
  theme: 'dark',
  tooltips: {
    use: true,
    background: 'rgba(0,0,0, 0.5)',
    border: 'gold',
    color: 'white'
  },
  points: {
    fill: 'tomato',
    stroke: 'black',
    radius: 10,
  },
  mobileGradients: true,
  initialScale: 0.2,
  globe: {
    innerShadow: true,
    innerHighlight: true,
    dropShadow: true,
    graticule: true,
  },
  land: {
    highlight: 'rgba(255,255,255, 1)',
    focus: 'gold',
  },
  cards: {
    kicker: {
      color: 'tomato',
      shadow: false,
    },
    title: {
      color: 'white',
      shadow: false,
    },
    caption: {
      color: 'white',
      shadow: false,
    },
  },
  splash: {
    title: {
      color: 'gold',
      shadow: false,
    },
    intro: {
      color: 'white',
      shadow: false,
    }
  }
}

```
