import styles from './app.sass'
import Content from './content/index'
import config from './config/project.json'
import isMobileDevice from './functions/isMobileDevice';


const { allImages, options } = Content
const templates = {
  kicker (val) {
    return `<h6 style="color: ${options.cards.kicker.color || ''}; text-shadow: ${!options.cards.kicker.shadow ? 'none' : ''}">${val}</h6>`
  },
  title (val) {
    return `<h4 style="color: ${options.cards.title.color || ''}; text-shadow: ${!options.cards.title.shadow ? 'none' : ''}">${val}</h4>`
  },
  subhead (val) {
    return `<h4 style="color: ${options.cards.subhead.color || ''}; text-shadow: ${!options.cards.subhead.shadow ? 'none' : ''}">${val}</h4>`
  },
  text (pars) {
    return pars.map(p => `<p style="color: ${options.cards.caption.color || ''}; text-shadow: ${!options.cards.caption.shadow ? 'none' : ''}">${p}</p>`).join('')
  },
  img (image) {
    const { src, alt, width, caption, type } = image
    const colors = [
      `rgb(${allImages[src].colors.DarkMuted._rgb ? allImages[src].colors.DarkMuted._rgb.join(',') : '20,20,20'})`,
      `rgb(${allImages[src].colors.Vibrant._rgb ? allImages[src].colors.Vibrant._rgb.join(',') : '50,50,50'})`,
    ]

    return `<div 
      class="${[
        'image__wrapper',
        type === 'inset' ? 'image__wrapper--inset' : 'image__wrapper--full',
      ].join(' ')}"
      style="background: linear-gradient(45deg, ${colors.join(', ')}) !important;"
    >
      <img
        src="${allImages[src][`Img${width}`]}"
        alt="${alt || ''}"
      />
      ${caption ? `<p class="caption">${caption}</p>` : '<!-- -->'}
    </div>`
  },
  multiImage (images) {
    return images.map(this.img).join('')
  },
  scrollIcon () {
    console.log({ isMobileDevice: isMobileDevice() })
    return `<div class="scrollToRead scrollToRead__${options.theme}">
    ${isMobileDevice()
      ? `
        <div class="scrollToRead__phone">
          <div class="scrollToRead__phone--dot"></div>
          <div class="scrollToRead__phone--button"></div>
        </div>
      `
      : `
        <div class="scrollToRead__mouse">
          <div class="scrollToRead__mouse--dot"></div>
        </div>
      `
    }

    <div class="scrollToRead__arrow--wrapper">
      <div class="scrollToRead__arrow scrollToRead__arrow--top"></div>
      <div class="scrollToRead__arrow scrollToRead__arrow--bottom"></div>
    </div>
    <p>Scroll to explore</p>
  </div>`
  },
  splash (splash) {
    const { title, intro, image } = splash
    console.log({ image }, allImages[image.src][`Img${image.width}`])
    return `
      <div class="splash__wrapper">
        ${image ? `<img src="${allImages[image.src][`Img${image.width}`]}" alt="${image.alt}" />`: '<!-- -->'}
        <h2 style="color: ${options.splash.title.color}; text-shadow: ${!options.splash.title.shadow ? 'none' : ''}">${title}</h2>
        ${intro ? `<h4 style="color: ${options.splash.intro.color}; text-shadow: ${!options.splash.intro.shadow ? 'none' : ''}">${intro}</h4>` : '<!-- -->'}
        ${this.scrollIcon()}
      </div>
    `
  }
}
// Template content
function sections ({ part, i }) {
  const { title, subhead, text, hide, intro, image, images, splash, kicker } = part
  return `<section
    class="${styles.card} card card__${options.theme}"
    data-index="${i}"
    data-hide="${hide || false}"
    data-type="maplocation"
  >
    ${splash ? templates.splash(splash) : '<!-- -->'}
    <div class="text__wrapper">
      ${image ? templates.img(image) : '<!-- -->'}
      ${kicker ? templates.kicker(kicker) : '<!-- -->'}
      ${title ? templates.title(title) : '<!-- -->'}
      ${subhead ? templates.subhead(subhead) : '<!-- -->'}
      ${intro ? templates.text(intro) : '<!-- -->'}
      ${text ? templates.text(text) : '<!-- -->'}
    </div>
  </section>`
}

function layout () {
  return `<div
    data-project="${config.name}"
    data-template="dt-globe-map"
    data-globe-theme="${Content.options.theme}"
  >
    <div id="globeContainer" class="globeContainer__${Content.options.theme}" data-active=false style="z-index: 0 !important"></div>
    ${Content.parts
      .map((part, i) => sections({ part, i }))
      .join('')
    }
  </div>`
}

export default layout
