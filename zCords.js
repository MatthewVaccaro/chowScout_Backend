// ANCHOR -- This is a file for learning how to GPS coordinates work and attempting to creating a bounding box for data fetching purposes.
// TODO -- Delete this when finished :: Current Date: April 6th

// If the world were a perfect sphere, according to basic trigonometry...

// Degrees of latitude have the same linear distance anywhere in the world, because
// all lines of latitude are the same size. So 1 degree of latitude is equal to 1/360th
// of the circumference of the Earth, which is 1/360th of 40,075 km.

// The length of a lines of longitude depends on the latitude. The line of longitude at latitude
// l will be cos(l)*40,075 km. One degree of longitude will be 1/360th of that.

// So you can work backwards from that. Assuming you want something very close to one square
// kilometre, you'll want 1 * (360/40075) = 0.008983 degrees of latitude.

// At your example latitude of 53.38292839, the line of longitude will be
// cos(53.38292839)*40075 = [approx] 23903.297 km long. So 1 km is 1 * (360/23903.297) = 0.015060 degrees.

// In reality the Earth isn't a perfect sphere, it's fatter at the equator. And the above gives a really good
// answer for most of the useful area of the world, but is prone to go a little odd near the poles (where rectangles
//     in long/lat stop looking anything like rectangles on the globe). If you were on the equator, for example, the
//     hypothetical line of longitude is 0 km long. So how you'd deal with a need to count degrees on that will depend on why you want the numbers.
// LINK https://stackoverflow.com/questions/4000886/gps-coordinates-1km-square-around-a-point

// ANCHOR -- NPM Package that might help: 
//isPointWithinRadius(point, centerPoint, radius)
// Checks whether a point is inside of a circle or not.

// checks if 51.525/7.4575 is within a radius of 5 km from 51.5175/7.4678

// NOTE 1km = 0.621371 miles

const geolib = require('geolib');

//  const findRadius = geolib.isPointWithinRadius(
//     { latitude: 36.11186069489325, longitude: -86.79261163095951 },
//     { latitude: 36.13192395385892, longitude: -86.78868447292437 },
//     1609
// );

const findRadius = geolib.getBoundsOfDistance(
    { latitude: 36.116792785131636, longitude: -86.78602718601964 },
    1000
);

console.log(findRadius)