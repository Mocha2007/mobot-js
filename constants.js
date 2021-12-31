const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;
const year = 365.2425 * day;

module.exports = {
	/** m; exact; https://en.wikipedia.org/wiki/Astronomical_unit */
	au: 149597870700,
	/** s ; exact */
	day,
	/** s ; exact */
	hour,
	/** W; exact; zero point luminosity */
	L_0: 3.0128e28,
	/** s ; exact */
	minute,
	pi: Math.PI,
	/** m */
	r_sun: 6.957e8,
	/** K */
	t_sun: 5778,
	/** s ; appx; https://en.wikipedia.org/wiki/Age_of_the_universe */
	universeAge: 13.787e9*year,
	/** s ; exact; gregorian, average */
	year,
};