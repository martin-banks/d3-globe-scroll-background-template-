/* eslint no-console: ['warn', {allow: ['error', 'warn', 'info']}] */

import STATE from './state'

// This factory function runs basic set up functionswhen instantiated
// It also returns an object with a render method to add templated content to DOM

function start ({ inner = '' } = {}) {
 
  // if a mobile device is detected a boolean is stored on
  // the main container as a flag for device specific styling
  STATE.appContainer.setAttribute('data-mobile', STATE.isMobile)
  const pageTemplate = () => {
    if (STATE.isLongform) return 'longform'
    if (STATE.isStandard) return 'standard'
    if (STATE.nca) return 'nca'
    return 'test'
  }
  STATE.appContainer.setAttribute('data-pagetemplate', pageTemplate())

  // the STATE object is logged to the console for reference / debugging throuhgh development

  const render = () => {
    // Render content into the main container
    STATE.appContainer.innerHTML = inner
  }

  return { render }
}

export default start
