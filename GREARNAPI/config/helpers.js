export const generateRandomCode = async () => {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numbers = "0123456789";
	let first = "grearn-";
	let second = "";
	let third = "_PMCKDU_1";

	for (let i = 0; i < 6; i++) second += letters.charAt(Math.floor(Math.random() * letters.length));
	// for (let i = 0; i < 8; i++) third += numbers.charAt(Math.floor(Math.random() * numbers.length));

	return first + second + "-" + third;
};
