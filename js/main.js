let exposedMap1 = [];
let exposedMap2= [];
let islandsAmount = 0;
let timeout = 0;
let indicateTimeout = 0;
const timeoutLength = 150;
const indicateTimeoutLength = 2;

$(document).ready(function () {
  renderMap(map1, '#map-uncovered-1');
  renderMap(map2, '#map-uncovered-2');
  createEmptyMap(map1, '#map-exposed-1', exposedMap1);
  createEmptyMap(map2, '#map-exposed-2', exposedMap2);

});

function startFirstMap() {
  clearTimeouts();
  islandSearch(map1, '#map-exposed-1', exposedMap1);

}

function startSecondMap() {
  clearTimeouts();
  islandSearch(map2, '#map-exposed-2', exposedMap2);

}

function clearTimeouts() {
  timeout = 0;
  indicateTimeout = 0;
}

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
  $(selector).empty().append(...rowsArr);
}

function renderEmptyMapRow(row, i) {
  return row.map(function (el, j) {
    return `<div class="map-element hidden-sector ${i}-${j}" />`;
  });
}

function islandSearch(map, selector, exposedMap) {
  createEmptyMap(map, selector, exposedMap);
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (notChecked(i, j, exposedMap)) {
        setTimeout(function () {
          indicateCurrentSector(i, j, selector);
        }, timeout);
        if (sectorIsIsland(map, i, j)) {
          increaseIslandsAmount(selector);
          discoverIsland(map, i, j, null, null, selector, exposedMap);
        } else {
          drawWaterSector(i, j, selector, exposedMap)
        }
      }
    }
  }
  disableBtns();
  console.log(`exposedMap Opened:`);
  console.log(exposedMap);
  console.log(`islandsAmount: ${islandsAmount}`);
  islandsAmount = 0;
}

function disableBtns() {
  $('.start-btn').prop('disabled', true);
  setTimeout(function () {
    enableBtns();
  }, timeout);
}

function enableBtns() {
  $('.start-btn').prop('disabled', false);
}

function increaseIslandsAmount(selector) {
  islandsAmount++;
  if (selector === '#map-exposed-1') {
    $('.islands-amount1-number').text(islandsAmount);
  } else {
    $('.islands-amount2-number').text(islandsAmount);
  }


}

function indicateCurrentSector(i, j, selector) {
  $(`${selector} .${i}-${j}`).addClass('processing-sector');
  setTimeout(function () {
    $(`${selector} .${i}-${j}`).removeClass('processing-sector');
  }, indicateTimeout);
  increaseIndicateTimeout();
}

function createEmptyMap(map, selector, exposedMap) {
  for (let i = 0; i < map.length; i++) {
    exposedMap[i] = new Array(map[0].length);
    for (let j = 0; j < map[i].length; j++) {
      exposedMap[i][j] = null;
    }
  }
  renderEmptyMap(exposedMap, selector);
}

function notChecked(i, j, exposedMap) {
  return (exposedMap[i][j] === null)
}

function discoverIsland(map, i, j, previ, prevj, selector, exposedMap) {
  if (sectorExists(i, j, exposedMap)) {
    if (notChecked(i, j, exposedMap)) {
      setTimeout(function () {
        indicateCurrentSector(i, j, selector);
      }, timeout);
      if (sectorIsIsland(map, i, j)) {
        drawIslandSector(i, j, selector, exposedMap);
        let nextCoords = getNextCoords(i, j, previ, prevj);
        nextCoords.forEach((coord) => {
          discoverIsland(map, coord[0], coord[1], i, j, selector, exposedMap);
        });
      } else {
        drawWaterSector(i, j, selector, exposedMap);
      }
    }
  }
}

function sectorExists(i, j, exposedMap) {
  return (exposedMap[i] !== undefined && exposedMap[i][j] !== undefined);
}

function sectorIsIsland(map, i, j) {
  return (map[i][j] === 1);
}

function drawIslandSector(i, j, selector, exposedMap) {
  exposedMap[i][j] = 1;
  setTimeout(function () {
    renderIslandSector(i, j, selector);
  }, timeout);
  increaseTimeout();
}

function drawWaterSector(i, j, selector, exposedMap) {
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

function increaseIndicateTimeout() {
  indicateTimeout += indicateTimeoutLength;
}
function getNextCoords(i, j, previ, prevj) {
  let nextCoords = [
    [i - 1, j],
    [i, j + 1],
    [i + 1, j],
    [i, j - 1]
  ].filter((coords) => {
    return (!(coords[0] === previ && coords[1] === prevj));
  });
  // console.log(`~~~~~~~~~~~~~~~~~~~~~~~~`);
  // console.log(`curr: [${i}|${j}]`);
  // console.log(`prev: [${previ}|${prevj}]`);
  // console.log(`nextCoords: `);
  // console.dir(nextCoords);
  return nextCoords;
}