function getEventPosition(event) {
  // getBoundingClientRect is slow
  const rect = event.target.getBoundingClientRect();
  return [
    event.clientX - rect.left,
    event.clientY - rect.top,
  ];
}

const xmlns = 'http://www.w3.org/2000/svg';

function createCircle(pos, radius, color) {
  const circle = document.createElementNS(xmlns, 'circle');
  circle.setAttributeNS(null, 'cx', pos[0]);
  circle.setAttributeNS(null, 'cy', pos[1]);
  circle.setAttributeNS(null, 'r', radius);
  circle.setAttributeNS(null, 'fill', color);
  return circle;
}

function createPolyline(points, color, strokeWidth) {
  const polyline = document.createElementNS(xmlns, 'polyline');
  polyline.setAttributeNS(null, 'points', points.reduce((acc, value) => acc + `${value[0]},${value[1]} `, ''));
  polyline.setAttributeNS(null, 'style', `fill:none;stroke:${color};stroke-width:${strokeWidth}`);
  return polyline;
}

function createPolygon(points, fillColor, strokeColor, strokeWidth) {
  // <polygon points="200,10 250,190 160,210" style="fill:lime;stroke:purple;stroke-width:1" />
  const polygon = document.createElementNS(xmlns, 'polygon');
  polygon.setAttributeNS(null, 'points', points.reduce((acc, value) => acc + `${value[0]},${value[1]} `, ''));
  polygon.setAttributeNS(null, 'style', `fill:${fillColor};stroke:${strokeColor};stroke-width:${strokeWidth}`);
  return polygon;
}


function createText(str, pos, color, fontSize) {
  //<text x="20" y="20" font-family="sans-serif" font-size="20px" fill="red">Hello!</text>
  const text = document.createElementNS(xmlns, 'text');
  text.setAttributeNS(null, 'font-family', 'sans-serif');
  text.setAttributeNS(null, 'x', pos[0]);
  text.setAttributeNS(null, 'y', pos[1]);
  text.setAttributeNS(null, 'font-size', 'fontSize');
  text.setAttributeNS(null, 'fill', color);
  text.innerHTML = str;
  return text;
}

// Return an array without duplicated points
function uniq(array) {
  return array.reduce((acc, p) => {
    if (acc.find(e => e[0] === p[0] && e[1] === p[1]) === undefined) {
      acc.push(p);
    }
    return acc;
  }, []);
}

function clearSvg(element) {
  var cNode = element.cloneNode(false);
  element.parentNode.replaceChild(cNode, element);
  return cNode;
}

function computeLine(points) {
  [pointA, pointB] = points;
  slope = (pointB[1] - pointA[1]) / (pointB[0] - pointA[0]);
  intercept = pointA[1] - pointA[0] * slope;
  return { slope, intercept };
}

function makeGrid(gridToViewport, boundaries, lit) {
  const fragment = document.createDocumentFragment();
  const origin = gridToViewport.mul([0, 0, 1]);
  const u = [gridToViewport[0][0], gridToViewport[1][0], 1];
  const v = [gridToViewport[0][1], gridToViewport[1][1], 1];
  for (let i = 0; i < 20; ++i) {
    for (let j = 0; j < 20; ++j) {
      const point = [origin[0] + u[0] * i + v[0] * j, origin[1] + u[1] * i + v[1] * j];
      if (point[0] > boundaries[0][0] && point[0] < boundaries[1][0] &&
          point[1] > boundaries[0][1] && point[1] < boundaries[1][1]) {
        const fill = lit.find(p => p[0] === i && p[1] === j) ? 'black' : 'white';
        fragment.appendChild(createPolygon([
          point,
          [point[0] + u[0], point[1] + u[1]],
          [point[0] + u[0] + v[0], point[1] + u[1] + v[1]],
          [point[0] + v[0], point[1] + v[1]],
        ], fill, 'grey', 1));
      }
    }
  }
  return fragment;
}
