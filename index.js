#!/usr/bin/env node

'use strict'

const blessed = require('blessed')
const contrib = require('blessed-contrib')
const screen = blessed.screen()
  
const { renderData } = require('./data')

;(async function () {
  const grid = new contrib.grid({ rows: 4, cols: 8, screen })

  const map = grid.set(0, 0, 2, 4, contrib.map, { label: 'Covid-19 mapa' })

  const bar = grid.set(2, 0, 2, 4, contrib.bar, {
    label: 'Datos por pais',
    barWidth: 6,
    barSpacing: 12,
    xOffset: 0,
    maxHeight: 9,
  })

  const tree = grid.set(0, 4, 4, 4, contrib.tree, { 
    fg: 'green',
    label: 'Paises'
  })
  tree.focus()
  
  try {
    await renderData(map, bar, tree, screen)

    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
     return process.exit(0)
    })

    screen.render()
  } catch (err) {
    process.exit(0)
  }
})()

