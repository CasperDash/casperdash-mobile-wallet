import { createSelector } from 'reselect';
// import { getConfigKey } from '../services/configurationServices';
import { convertBalanceFromHex } from 'utils/helpers/balance';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { getCurrentPrice } from './price';
import { getMassagedTokenData } from './tokens';

const CSPR_INFO = {
	symbol: 'CSPR',
	address: 'CSPR',
	icon: require('../../assets/images/logo.png'),
};

export const getPublicKey = ({ user }) => {
	return user.casperdash && user.casperdash.publicKey;
};

const massageUserDetails = (userDetails) => {
	const hexBalance = userDetails && userDetails.balance ? userDetails.balance.hex : 0;
	return {
		...userDetails,
		balance: {
			...userDetails.balance,
			mote: parseInt(hexBalance),
			displayBalance: convertBalanceFromHex(hexBalance),
		},
	};
};

export const userDetailsSelector = (state) => state.user;

export const getMassagedUserDetails = createSelector(userDetailsSelector, (userDetails) => {
	return massageUserDetails(userDetails.info || {});
});

export const getAllTokenInfo = createSelector(
	getMassagedUserDetails,
	getCurrentPrice,
	getMassagedTokenData,
	(accountDetails, CSPRPrice, tokensData) => {
		const CSPRBalance = (accountDetails && accountDetails.balance && accountDetails.balance.displayBalance) || 0;
		const CSPRInfo = {
			...CSPR_INFO,
			balance: { displayValue: CSPRBalance },
			price: CSPRPrice,
			totalPrice: CSPRPrice * CSPRBalance,
			// transferFee: getConfigKey('CSPR_TRANSFER_FEE'),
			// minAmount: getConfigKey('MIN_CSPR_TRANSFER'),
		};

		//TODO: should get price for each token, currently no token issue on Casper blockchain and no source as well
		// Temporary set the token price to 0
		const tokenPrice = 0;
		const tokensInfo =
			tokensData && tokensData.length
				? tokensData.map((datum) => ({
						price: tokenPrice,
						totalPrice: tokenPrice * datum.balance.displayValue,
						// transferFee: getConfigKey('TOKEN_TRANSFER_FEE'),
						icon: getBase64IdentIcon(datum.address),
						...datum,
				  }))
				: [];

		return [CSPRInfo, ...tokensInfo];
	},
);

export const getAccountTotalBalanceInFiat = createSelector(getAllTokenInfo, (allTokenInfo) => {
	return allTokenInfo && allTokenInfo.length
		? allTokenInfo.reduce((out, datum) => {
				return out + datum.totalPrice;
		  }, 0)
		: 0;
});

export const getTokenInfoByAddress = (token) =>
	createSelector(getAllTokenInfo, (allTokenInfo) => {
		return token && allTokenInfo && allTokenInfo.length
			? allTokenInfo.find((info) => info.address === token.address)
			: {};
	});
