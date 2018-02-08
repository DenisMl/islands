let exposedMap = [];
let islandsAmount = 0;
let timeout = 0;
const timeoutLength = 100;

$(document).ready(function () {
  renderMap(map1, '#map-uncovered-1');
  renderMap(map2, '#map-uncovered-2');
  islandSearch(map1, '#map-exposed-1');
  islandSearch(map2, '#map-exposed-2');
});

function renderMap(mapArr, selector) {
  let rowsArr = mapArr.map(function (row, i) {
    return $(`<div class="map-row row-${i}" ></div>`).append(...renderMapRow(row, i));
  });
  $(selector).append(...rowsArr);
}

function renderMapRow(row, i) {
  return row.map(function (el, j) {
    if (el === 1) {
      return `<div class="map-element island-sector ${i}-${j}" />`;
    } else {
      return `<div class="map-element water-sector ${i}-${j}" />`;
    }
  });
}

function renderEmptyMap(exposedMap, selector) {
  let rowsArr = exposedMap.map(function (row, i) {
    return $(`<div class="map-row row-${i}" ></div>`).append(...renderEmptyMapRow(row, i));
  });
  $(selector).append(...rowsArr);
}

function renderEmptyMapRow(row, i) {
  return row.map(function (el, j) {
    return `<div class="map-element hidden-sector ${i}-${j}" />`;
  });
}

function islandSearch(map, selector) {
  createEmptyMap(map, selector);
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (notChecked(i, j)) {
        if (sectorIsIsland(map, i, j)) {
          islandsAmount++;
          discoverIsland(map, i, j, null, null, selector);
        } else {
          // debugger;
          drawWaterSector(i, j, selector)
        }
      }
    }
  }
  // renderMap(exposedMap, selector);
  console.log(`exposedMap Opened:`);
  console.log(exposedMap);
  console.log(`islandsAmount: ${islandsAmount}`);
  islandsAmount = 0;
}

function createEmptyMap(map, selector) {
  for (let i = 0; i < map.length; i++) {
    exposedMap[i] = new Array(map[0].length);
    for (let j = 0; j < map[i].length; j++) {
      exposedMap[i][j] = null;
    }
  }
  // console.log(`exposedMap Empty:`);
  // console.log(exposedMap);
  // debugger;
  renderEmptyMap(exposedMap, selector);
}

function notChecked(i, j) {
  return (exposedMap[i][j] === null)
}

function discoverIsland(map, i, j, previ, prevj, selector) {
  if (sectorExists(i, j)) {
    if (notChecked(i, j)) {
      if (sectorIsIsland(map, i, j)) {
        drawIslandSector(i, j, selector);
        let nextCoords = getNextCoords(i, j, previ, prevj);
        nextCoords.forEach((coord) => {
          discoverIsland(map, coord[0], coord[1], i, j, selector);
        });
      } else {
        // debugger;
        drawWaterSector(i, j, selector);
      }
    }
  }
}

function sectorExists(i, j) {
  return (exposedMap[i] !== undefined && exposedMap[i][j] !== undefined);
}

function sectorIsIsland(map, i, j) {
  return (map[i][j] === 1);
}

function drawIslandSector(i, j, selector) {
  exposedMap[i][j] = 1;
  setTimeout(function () {
    renderIslandSector(i, j, selector);
  }, timeout);
  increaseTimeout();
}

function drawWaterSector(i, j, selector) {
  exposedMap[i][j] = 0;
  setTimeout(function () {
    renderWaterSector(i, j, selector);
  }, timeout);
  increaseTimeout();
}

function renderIslandSector(i, j, selector) {
  $(`${selector} .${i}-${j}`).removeClass('hidden-sector').addClass('island-sector');
}

function renderWaterSector(i, j, selector) {
  $(`${selector} .${i}-${j}`).removeClass('hidden-sector').addClass('water-sector');
}

function increaseTimeout() {
  timeout += timeoutLength;
}
function getNextCoords(i, j, previ, prevj) {
  let nextCoords = [
    [i - 1, j],
    [i, j + 1],
    [i + 1, j],
    [i, j - 1]
  ].filter((coords) => {
    return (coords[0] !== previ && coords[1] !== prevj);
  });
  console.log(`~~~~~~~~~~~~~~~~~~~~~~~~`);
  console.log(`curr: [${i}|${j}]`);
  console.log(`prev: [${previ}|${prevj}]`);
  console.log(`nextCoords: `);
  console.dir(nextCoords);
  return nextCoords;
}