/* global topojson */
import * as event from 'd3-selection'
import content from './content'

const { options } = content

import Content from './content/index'
import STATE from './state'

// Creates our initial D3 object
// This will be used to build the whole scene
const d3 = Object.assign(
  {},
  require('d3-geo'),
  require('d3-selection'),
  require('d3-drag'),
  require('d3-transition'),
  require('d3-interpolate'),
  require('d3-timer'),
)

d3.event = event
let mouseX = 0
let mouseY = 0
let autoRotate = null

export default function ({ world, names, mapTopo, mapGeo } = {}) {
  let scrollDirection = 'down'
  let scrollStart = 0
  // set globe size
  let windowWidth = window.innerWidth
  let windowHeight = window.innerHeight
  let locationIndex = null
  // pwd is the detection point to trigger section transitions
  const pwd = windowHeight * 0.85
  const sections = STATE.appContainer.querySelectorAll('[data-type=maplocation]')

  function getTopPosition () {
    return windowHeight * 0.33
  }
  function getLeftPosition () {
    return (windowWidth / 2)
  }
  let cx = getLeftPosition()
  let cy = getTopPosition()

  // Setting projection
  const projection = d3.geoOrthographic()
    .scale(0)
    .rotate([0, 0])
    .translate([cx, cy])
    .clipAngle(90)

  const path = d3.geoPath()
    .projection(projection)
    .pointRadius(10)

  // SVG container
  const svg = d3.select('#globeContainer')
    .append('svg')
    .attr('width', windowWidth)
    .attr('height', windowHeight)
    .attr('class', 'globe')
    .attr('id', 'globe')

  // Create a shadow under the globe
  if (options.globe.dropShadow) {
    const dropShadow = svg.append('defs')
      .append('radialGradient')
      .attr('id', 'dropShadow')
    dropShadow
      .append('stop')
      .attr('offset', '20%')
      .attr('stop-color', '#000')
      .attr('stop-opacity', '0.6')
    dropShadow
      .append('stop')
      .attr('offset', '90%')
      .attr('stop-color', '#000')
      .attr('stop-opacity', '0')
  }

  // Create highlights on the globe
  if (options.globe.innerHighlight) {
    const globeHighlight = svg.append('defs')
      .append('radialGradient')
      .attr('id', 'globeHighlight')
      .attr('cx', '70%')
      .attr('cy', '10%')
    globeHighlight
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(255,255,255, 0.4)')
    globeHighlight
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(255,255,255, 0.2)')
  }

  // Create an inner shadow on the globe
  if (options.globe.innerShadow) {
    const innerShadow = svg.append('defs')
      .append('radialGradient')
      .attr('id', 'innerShadow')
      .attr('cx', '55%')
      .attr('cy', '40%')
    innerShadow
      .append('stop')
      .attr('offset', '80%')
      .attr('stop-color', '#000')
      .attr('stop-opacity', '0')
    innerShadow
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#000')
      .attr('stop-opacity', '0.6')
  }

  // country names are missing from world data, find them by matching id to name and filter anything missing
  const countries = topojson.feature(world, world.objects.countries).features
    .map(country => {
      const foundName = names.find(n => parseInt(n.id, 10) === parseInt(country.id, 10))
      const output = country
      const nameToUse = (foundName ? foundName.name : '')
      output.name = nameToUse
      return output
    })
    .filter(country => country.name)

  const countryById = countries.reduce((output, country) => {
    const update = output
    update[country.id] = country.name
    return update
  }, {})


  const locations = Content.parts
    .reduce((output, p, i) => {
      const update = output
      const { country, focus, highlights, origin } = p.map
      update.push(JSON.parse(JSON.stringify(p.map)))
      update[i].origin = origin || false
      if (!country) {
        update[i].country = false
      } else {
        update[i].country = countries
          .filter(c => c.name.toLowerCase().includes(country))[0]
      }
      if (!focus) {
        update[i].focus = false
      } else {
        update[i].focus = focus.map(h => countries.filter(c => c.name.toLowerCase().includes(h))[0])
      }
      if (!highlights) {
        update[i].highlights = false
      } else {
        update[i].highlights = highlights.map(h => countries.filter(c => c.name.toLowerCase().includes(h))[0])
      }
      return update
    }, [/* headerLocation */])


  // Adds shadow under the globe
  svg.append('ellipse')
    .attr('class', 'dropshadow noclicks')
    .attr('cx', cx)
    .attr('cy', cy * 1.1)
    .attr('rx', projection.scale() * 0.90)
    .attr('ry', projection.scale() * 0.25)
    .style('fill', 'url(#dropShadow)')

  // Adding water background
  svg.append('path')
    .datum({ type: 'Sphere' })
    .attr('class', `water water__${options.theme} noclicks`)
    .attr('d', path)

    // adding globe grid lines (aka, graticules)
    if (options.globe.graticule) {
      svg.append('path')
        .datum(d3.geoGraticule())
        .attr('class', `graticule graticule__${options.theme}`)
        .attr('d', path)
    }

  // Adds highlight to globe
  svg.append('circle')
    .attr('class', 'highlight noclicks')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', 0)
    .style('fill', 'url(#globeHighlight)')

  // Adds country land areas
  const svgWorld = svg.selectAll('path.land')
    .data(countries)
    .enter()
    .append('path')
    .attr('class', `land land__${options.theme}`)
    .attr('d', path)

  // Adds inner shadow to lower part of globe
  svg.append('circle')
    .attr('class', 'innerShadow noclicks')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', 0)
    .style('fill', 'url(#innerShadow)')

  // Displays country name tooltip when mousing over each country
  function useTooltips () {
    const countryTooltip = d3
      .select('#globeContainer')
      .append('div')
      .attr('class', 'countryTooltip')
      .style('background-color', options.tooltips.background)
      .style('border-color', options.tooltips.border)
      .style('color', options.tooltips.color)
    if (!STATE.isMobile) {
      svgWorld
        .on('mouseover', d => {
          countryTooltip
            .text(countryById[d.id])
            // separate event listener to get mouse position
            .style('left', `${mouseX}px`)
            .style('top', `${mouseY}px`)
            .style('display', 'block')
            .style('opacity', 1)
            .style('transform', 'translate(-50%, -150%) scale(1)')
        })
        .on('mouseout', d => {
          countryTooltip
            .style('opacity', 0)
            .style('transform', 'translate(-50%, -150%) scale(0)')
        })
        .on('mousemove', d => {
          countryTooltip
            .style('left', `${mouseX}px`)
            .style('top', `${mouseY}px`)
        })
    }
  }

  // !LEGACY! This is a hangover from the integration into other pages
  // fade the whole map in when a section is in the visible space
  // and fade it out when scrolling past the last/first section
  // provides smoother, more integrated implementation
  function fadeInOut () {
    const isBelow = sections[0].getBoundingClientRect().top > pwd
    const lastSection = sections[sections.length - 1].getBoundingClientRect()
    const isAbove = (lastSection.top + lastSection.height) < (windowHeight * 0.3)
    const isActive = !(isBelow || isAbove)

    if (!isActive) {
      locationIndex = null
      stopAutoRotate()
    }
    STATE.globeContainer.setAttribute('data-active', isActive)
  }

  function renderPoints (points) {
    d3.selectAll('.points').remove()
    if (!points) return
    const pointsData = points.map(f => f.geometry)
    svg.selectAll('.points')
      .data(pointsData)
      .enter()
      .append('path')
      .classed('points', true)
      .attr('d', path.pointRadius(options.points.radius))
      .attr('fill', options.points.fill)
      .attr('stroke', options.points.stroke)
  }

  // An auto rotate function is stored in hte autoRotate variable
  // it's use is restricted to non-mobile devices to improve performance
  function startAutoRotate () {
    if (STATE.isMobile || !autoRotate) return
    autoRotate.restart(rotateGlobe)
  }

  function stopAutoRotate () {
    if (STATE.isMobile || !autoRotate) return
    autoRotate.stop()
  }
  // Main function to control the globe view
  function setGlobeView () {
    scrollDirection = window.scrollY > scrollStart ? 'down' : 'up'
    scrollStart = window.scrollY
    stopAutoRotate()
    // fade the globe in or out if is not in the active viewport
    fadeInOut()
    // Itterate over all sections
    sections.forEach(s => {
      const section = s
      const thisIndex = parseInt(section.getAttribute('data-index'), 10)

      // only do something if this section is not currently active/visible
      if (thisIndex === locationIndex) return
      const { top, height } = section.getBoundingClientRect()
      const bottom = top + (height / 2)
      if ((top < pwd && top > 0)) {
        section.style.opacity = 1
        section.style.transform = `scale(1)`
      } else {
        section.style.opacity = 0.6
        section.style.transform = `scale(0.6)`
      }


      if (scrollDirection === 'up' && (bottom < windowHeight)) {
        // this is the active section while scrolling back up the page
        locationIndex = thisIndex
        transition()
        return
      }
      if (!(top < pwd && top > 0)) return
      // this is the active section while scrolling down through the page
      locationIndex = thisIndex
      transition()
    })
    const useAuto = Content.parts[locationIndex] && Content.parts[locationIndex].autorotate
    if (useAuto) {
      startAutoRotate()
    }
  }

  // Country focus on option select
  function transition () {
    const { focus, highlights, points } = locations[locationIndex]
    const focusedCountry = locations[locationIndex].country
    if (!focusedCountry) return
    const p = d3.geoCentroid(focusedCountry)
    renderPoints(points)

    d3.transition()
      .duration(2000)
      .tween('scale', () => {
        const r = d3.interpolate(projection.rotate(), [-p[0], -p[1]])
        const scaleTweenFrom = projection.scale()
        const scaleTweenTo = (Math.min(windowWidth, windowHeight) * locations[locationIndex].scale)
        const scaleTween = d3.interpolate(scaleTweenFrom, scaleTweenTo)

        return t => {
          projection
            .rotate(r(t))
            .scale(scaleTween(t))
          svg
            .selectAll('.highlight')
            .attr('r', scaleTween(t))
          svg
            .selectAll('.innerShadow')
            .attr('r', scaleTween(t))
          svg.selectAll('.dropshadow')
            .attr('cx', cx)
            .attr('cy', (cy + scaleTween(t)) * 1.03)
            .attr('rx', scaleTween(t) * 0.90)
            .attr('ry', scaleTween(t) * 0.1)
          svg
            .selectAll('path')
            .attr('d', path)
            // toggle focus class based on it's id
            .classed('focused', d => focus && focus.filter(h => h.id === d.id).length)
            .style('fill', d => {
              if (focus && focus.filter(h => h.id === d.id).length) {
                return options.land.focus
              } else if (highlights && highlights.filter(h => h.id === d.id).length) {
                return options.land.highlight
              }
              return ''
            })
            .classed('highlight', d => highlights && highlights.filter(h => h.id === d.id).length)
        }
      })
  }

  // Auto rotate
  function rotateGlobe () {
    const rotation = projection.rotate()
    rotation[0] += 0.25
    projection.rotate(rotation)
    svg.selectAll("path.land").attr("d", path)
    svg.selectAll("path.graticule").attr("d", path)
  }

  // Update on window resize
  let resizeTimer = null
  function resizeGlobe () {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {

      windowWidth = window.innerWidth
      windowHeight = window.innerHeight
      cx = getLeftPosition()
      cy = getTopPosition()
      projection.translate([cx, cy])
      d3.select('#globe')
        .attr('width', windowWidth)
        .attr('height', windowHeight)
      svg
        .selectAll('.highlight')
        .attr('cx', cx)
        .attr('cy', cy)
      svg
        .selectAll('.innerShadow')
        .attr('cx', cx)
        .attr('cy', cy)
      transition()
    }, 1000)
  }

  // stores the mouse co-ordinates for tool tip positioning
  function positionTooltip (e) {
    mouseX = e.x
    mouseY = e.y
  }

  // kick everything off
  // there are some features that should not render on mobile devices to improve performance
  if (!STATE.isMobile) {
    if (options.tooltips.use) {
      useTooltips()
    }
    // sets then immediately stops the auto rotate. 
    // it will be started if the active section has an auto-rotate property
    autoRotate = d3.timer(rotateGlobe)
    stopAutoRotate()
  }
  window.addEventListener('scroll', setGlobeView)
  window.addEventListener('mousemove', positionTooltip)

  if (!STATE.isMobile) window.addEventListener('resize', resizeGlobe)

  setGlobeView()
}

