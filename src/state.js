import isMobileDevice from './functions/isMobileDevice'
import project from './config/project.json'


const isTestEnv = () => [
  'localhost',
  '127.0.0.1',
].indexOf(window.location.hostname) !== -1

const STATE = {
  version: '1.3',
  rendered: false,
  isMobile: isMobileDevice(),
  appContainer: document.querySelector(`#${project.name}`),
  window: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  isTest: isTestEnv(),
}

export default STATE
