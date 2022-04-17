export const getSheetId = (url = null) => {
	// Google spreadsheet urls generally take form:
	// https://docs.google.com/spreadsheets/d<sheetId>/edit#gid=0
	// Here sheetId is isolated using regex
	try {
		new URL(url); // Is a URL ?
		try {
			return url.match(/.*\/d\/(.*)\//)[1]; // Starts with "d/" ends with '/' ?
		}
		catch {
			try {
				return url.match(/d\/(.+?)$/)[1]; // Starts with "d/" ends at line end ?
			}
			catch {
				return null;
			}
		}
	}
	catch {
		return null;
	}
}