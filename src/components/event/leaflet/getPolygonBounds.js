// Return appropriate polygon bounds for location maps
const getPolygonBounds = ({
  locCornerSW, // not always present, revert to marker
  locCornerNW, // * may be missing in some older records *
  locCornerNE, // not always present, revert to marker
  locCornerSE, // * may be missing in some older records *
}) => {
  const polygonBounds = [];
  // add SW corner if it exists
  if (locCornerSW && locCornerSW[0] && locCornerSW[1]) {
    polygonBounds.push(locCornerSW);
  }
  // add NW corner if it exists or assume rectangle if only SW and NE corners exist
  if (locCornerNW && locCornerNW[0] && locCornerNW[1]) {
    polygonBounds.push(locCornerNW);
  } else if (locCornerSW && locCornerSW[1] && locCornerNE && locCornerNE[0]) {
    polygonBounds.push([locCornerNE[0], locCornerSW[1]]);
  }
  // add NE corner if it exists
  if (locCornerNE && locCornerNE[0] && locCornerNE[1]) {
    polygonBounds.push(locCornerNE);
  }
  // add SE corner if it exists or assume rectangle if only SW and NE corners exist
  if (locCornerSE && locCornerSE[0] && locCornerSE[1]) {
    polygonBounds.push(locCornerSE);
  } else if (locCornerSW && locCornerSW[0] && locCornerNE && locCornerNE[1]) {
    polygonBounds.push([locCornerSW[0], locCornerNE[1]]);
  }
  return polygonBounds;
};

export default getPolygonBounds;
