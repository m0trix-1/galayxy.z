// Real astronomical data for simulation
// Source: NASA JPL Horizons, Gaia Archive

export const ASTRONOMICAL_CONSTANTS = {
  AU: 149597870700,           // Astronomical Unit in meters
  LIGHT_YEAR: 9.4607e15,      // Light year in meters
  PARSEC: 3.0857e16,          // Parsec in meters
  SOLAR_MASS: 1.989e30,       // kg
  SOLAR_RADIUS: 696340000,    // meters
  EARTH_MASS: 5.972e24,       // kg
  EARTH_RADIUS: 6371000,      // meters
  G: 6.67430e-11              // Gravitational constant
}

// Nearest stars to Sun (within 10 light years)
export const NEAREST_STARS = [
  {
    name: 'Proxima Centauri',
    distance: 4.2465,        // light years
    ra: '14h 29m 42.9s',     // Right Ascension
    dec: '-62° 40′ 46″',     // Declination
    magnitude: 11.13,
    color: 0xff0000,         // Red dwarf
    type: 'M5.5Ve'
  },
  {
    name: 'Alpha Centauri A',
    distance: 4.37,
    ra: '14h 39m 36.5s',
    dec: '-60° 50′ 02″',
    magnitude: 0.01,
    color: 0xffff00,         // Yellow dwarf
    type: 'G2V'
  },
  {
    name: 'Alpha Centauri B',
    distance: 4.37,
    ra: '14h 39m 35.1s',
    dec: '-60° 50′ 14″',
    magnitude: 1.33,
    color: 0xffa500,         // Orange dwarf
    type: 'K1V'
  },
  {
    name: 'Barnard's Star',
    distance: 5.958,
    ra: '17h 57m 48.5s',
    dec: '+04° 41′ 36″',
    magnitude: 9.54,
    color: 0xff0000,
    type: 'M4V'
  },
  {
    name: 'Wolf 359',
    distance: 7.856,
    ra: '10h 56m 29.2s',
    dec: '+07° 00′ 53″',
    magnitude: 13.54,
    color: 0xff0000,
    type: 'M6V'
  }
]

// Major asteroid belt objects
export const NOTABLE_ASTEROIDS = [
  {
    name: 'Ceres',
    diameter: 946,           // km
    distance: 2.767,         // AU
    orbitalPeriod: 1682,     // days
    type: 'C-type'
  },
  {
    name: 'Vesta',
    diameter: 525,
    distance: 2.362,
    orbitalPeriod: 1326,
    type: 'V-type'
  },
  {
    name: 'Pallas',
    diameter: 513,
    distance: 2.774,
    orbitalPeriod: 1686,
    type: 'B-type'
  },
  {
    name: 'Hygiea',
    diameter: 434,
    distance: 3.139,
    orbitalPeriod: 2033,
    type: 'C-type'
  }
]
