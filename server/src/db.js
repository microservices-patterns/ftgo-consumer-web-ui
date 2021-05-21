export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	const db = () => { debugger; };
	callback(db);
}
