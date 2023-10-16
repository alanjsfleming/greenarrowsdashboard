/**
 * Converts latitude and longitude coordinates to pixel coordinates.
 *
 * @param {number[]} coordinate - The latitude and longitude coordinates in the format [lat, lng].
 * @param {{ ne: number[], sw: number[] }} bounds - The northeast and southwest bounds of the map in the format { ne: [lat, lng], sw: [lat, lng] }.
 * @param {{ width: number, height: number }} mapSize - The width and height of the map in pixels in the format { width, height }.
 * @returns {number[]} The pixel coordinates in the format [x, y].
 */
export function latLngToPixel(coordinate, bounds, mapSize) {
    const [lat, lng] = coordinate
    const { ne, sw } = bounds
    const { width, height } = mapSize
  
    const x = ((lng - sw[1]) / (ne[1] - sw[1])) * width
    const y = ((ne[0] - lat) / (ne[0] - sw[0])) * height
  
    return [x, y]
  }