export function ValidEmail(email) {
	var re = /\S+@\S+\.\S+/;
	return re.test(email);
}

export function ValidPassword(password) {
	return password.length >= 8;
}

export function ValidUsername(username) {
	return username.length >= 3;
}
