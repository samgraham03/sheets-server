import { getSheetId } from '../utils/sheets'

export const getAuthStatus = (setAuthStatus = () => null) => {
	fetch('/authStatus')
	.then(res => res.json())
	.then(data => {
		setAuthStatus(data.authorized);
	})
	.catch(err => console.log(err));
}

export const authorize = (setAuthorized = () => null) => {
	fetch('/authorize')
		.then(res => res.json())
		.then(data => {setAuthorized(data.authorized);})
		.catch(err => console.log(err));
}

export const deauthorize = (setAuthorized = () => null) => {
	fetch('/deauthorize')
		.then(res => res.json())
		.then(data => {setAuthorized(data.authorized);})
		.catch(err => console.log(err));
}

export const fetchData = (url = null, setData = () => null, setInvalidURL = () => null) => {
	let sheetId = getSheetId(url);
	if (sheetId === null) {
		setInvalidURL(null)
	}
	else {
		fetch('/fetchData', {
				'method':'POST',
				headers:{
					'Content-Type':'application/json'
				},
				body:JSON.stringify({sheetId})
			})
			.then(res => res.json())
			.then(data => {setData(data.fetchData);})
			.catch(err => console.log(err));
	}
	console.log(sheetId);
}