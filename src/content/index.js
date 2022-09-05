// All content is stored and used from this file
// Recomend multiple parts are created as separate files
// and imported to keep this file streamlined

// Data for custom points must be in geoJSON format, generate data
// http://geojson.io

import importAllImages from '../functions/importAllImages'
import parts from './parts.json'
import options from './options'

const Content = {
  options,
  allImages: importAllImages(require.context('./images', false, /\.js/)),
  parts,
}

export default Content
