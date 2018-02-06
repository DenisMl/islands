$(document).ready(function () {
  renderUncoveredMap(map1, '#map-uncovered-1');
  renderUncoveredMap(map2, '#map-uncovered-2');
});

function renderUncoveredMap(mapArr, selector) {
  // console.log(mapArr);
  let rowsArr = mapArr.map(function (row, i) {
    return $(`<div class="map-row row-${i}" ></div>`).append(...mapRow(row, i));
  });
  // console.log(rowsArr);
  $(selector).append(...rowsArr);
}

function mapRow(row, i) {
  return row.map(function (el, j) {
    if (el === 1) {
      return `<div class="map-element island-element ${i}-${j}" />`;
    } else {
      return `<div class="map-element water-element ${i}-${j}" />`;
    }
  });
}