import IdentIcon from 'identicon.js';

export const getBase64IdentIcon = (value, options = {}) => {
	try {
		return `data:image/svg+xml;base64,${new IdentIcon(value, {
			background: [255, 0, 0, 0],
			format: 'svg',
			...options,
		}).toString()}`;
	} catch {
		return '/assets/images/token-icon.png';
	}
};
