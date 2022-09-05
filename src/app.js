import imagesloaded from 'imagesloaded'

import start from './startApp'
import layout from './layout'
import STATE from './state'

import world from './content/world-110m.json'
import countryNames from './content/world-country-names.json'
import mapTopo from './content/mapTopo.json'
import mapGeo from './content/mapGeo.json'
import renderGlobe from './d3_globe'

const logStyle = `
  color: #bada55;
  background: black;
  border-radius: 4px;
  padding: 4px 12px;
`

const APP = start({ inner: layout() })
APP.render()
STATE.globeContainer = document.querySelector('#globeContainer')
if (!STATE.isApp) {
  const sections = STATE.appContainer.querySelectorAll('[data-type=maplocation]')
  sections.forEach((s, i) => {
    if (i === 0) {
      s.style.padding = '60vh auto 30vh auto'
      s.style.margin = '100px auto'
      return
    }
    s.style.margin = '60vh auto 30vh auto'
  })
  console.log('%c D3 GLOBE: Waiting to render', logStyle)
  setTimeout(() => {
    renderGlobe({ world, names: countryNames, mapTopo, mapGeo })
    STATE.rendered = true
    console.log('%c D3 GLOBE: Render complete', logStyle)
  }, 1000)
}

console.log({ STATE })

const imageList = STATE.appContainer.querySelectorAll('img')
imagesloaded(imageList, loaded => {
  loaded.elements.forEach(e => {
    e.style.opacity = 1
    e.parentNode.style.height = 'auto'
    e.parentNode.style.background = 'none'
  })
})
