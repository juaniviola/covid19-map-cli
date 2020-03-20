'use strict'

const rp = require('request-promise')
const uri = 'https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest?onlyCountries=true'

async function getData() {
  try {
    const opt = {
      uri,
      json: true
    }

    const data = await rp(opt)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

async function renderData(map, bar, tree, screen) {
  try {
    const data = await getData()
    const paises = {}
    data.forEach(el => {
      paises[el.countryregion] = {}
    })

    map.addMarker({
      "lon" : data[0].location.lng, 
      "lat" : data[0].location.lat, 
      color: "red", 
      char: "X" 
    })

    bar.setData({
      titles: ['Casos', 'Muertes', 'Recup.'],
      data: [
        data[0].confirmed,
        data[0].deaths,
        data[0].recovered
      ]
    })

    tree.setData({
      extended: true,
      children: paises
    })

    tree.on('select', (el) => {
      const obj = data.find(elem => elem.countryregion === el.name)
      const index = data.indexOf(obj, 0)

      reRenderData({ index, data, map, bar, tree, screen })
    })
  } catch (err) {
    throw new Error(err)
  }
}

async function reRenderData({ index, data, map, bar, tree, screen }) {
  map.clearMarkers()
  map.addMarker({
    "lon" : data[index].location.lng,
    "lat" : data[index].location.lat,
    color: "red",
    char: "X"
  })

  bar.setData({
    titles: ['Casos', 'Muertes', 'Recup.'],
    data: [
      data[index].confirmed,
      data[index].deaths,
      data[index].recovered
    ]
  })

  screen.render()
}

module.exports = { renderData }