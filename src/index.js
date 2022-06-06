// Target elements
const categoryEl = document.querySelector('.js-category')
const titleEl = document.querySelector('.js-title')
const numberEl = document.querySelector('.js-number')
const actionsEl = document.querySelector('.js-actions')
const linkEl = document.querySelector('.js-link')
const versionEl = document.querySelector('.js-version')

// Category emojis
const topicEmoji = [
  '🖼',
  '📐',
  '🎨',
  '🎥',
  '📊',
  '🔗',
  '⚙️',
  '⚠️',
  '🧩',
  '📋',
  '🏷',
  '📍',
  '📖'
]

/**
 * Remove Markdown links from a string
 * @param {string} title
 */
function cleanTitle(title) {
  const regex = /\[(?<label>[^\]]+)\]\(([^\)]+)\)/g
  return title.replaceAll(regex, '$<label>')
}

/**
 * Set version based on `manifest.json file`
 */
function setVersion() {
  versionEl.textContent = browser.runtime.getManifest().version
}

/**
 * Build criterion URL with anchor
 * @param {object} criterion
 */
function getCriterionUrl(criterion) {
  const url =
    'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/'
  return `${url}#${criterion.topicNumber}.${criterion.criterionNumber}`
}

/**
 * Fetch all criteria from RGAA git repository and format them
 * @returns
 */
async function fetchCriteria() {
  const url =
    'https://raw.githubusercontent.com/DISIC/RGAA/master/v4.1/JSON/criteres.json'
  const response = await fetch(url)
  const result = await response.json()

  const formattedCriteria = []

  result.topics.forEach((t, i) => {
    return formattedCriteria.push(
      ...t.criteria.map((c) => {
        return {
          title: c.criterium.title,
          criterionNumber: c.criterium.number,
          topicNumber: i + 1,
          topic: t.topic
        }
      })
    )
  })

  return formattedCriteria
}

/**
 * Get a random criterion
 */
function getRandomCriteria() {
  currentCriterion = criteria[Math.floor(Math.random() * criteria.length)]
}

/**
 * Replace parts of markup depending on the current criterion
 * @param {object} criterion
 */
function updateContent(criterion) {
  categoryEl.textContent = `${topicEmoji[criterion.topicNumber - 1]} ${
    criterion.topic
  }`
  titleEl.textContent = `${criterion.topicNumber}.${
    criterion.criterionNumber
  } – ${cleanTitle(criterion.title)}`
  numberEl.textContent = `${criterion.topicNumber}.${criterion.criterionNumber}`
  linkEl.setAttribute('href', getCriterionUrl(criterion))
}

// Initialize
let criteria = []
let currentCriterion = null

async function run() {
  try {
    criteria = await fetchCriteria()

    // Fake loading
    // await new Promise(r => setTimeout(r, 2000));

    getRandomCriteria()
    categoryEl.removeAttribute('hidden')
    actionsEl.removeAttribute('hidden')
    updateContent(currentCriterion)
  } catch (error) {
    titleEl.textContent =
      'Erreur : impossible de récupérer les critères du RGAA.'

    console.error(error)
  }
}

setVersion()
run()

// Refresh current criterion
const newButton = document.querySelector('.js-new')
newButton.addEventListener('click', () => {
  getRandomCriteria()
  updateContent(currentCriterion)
})
