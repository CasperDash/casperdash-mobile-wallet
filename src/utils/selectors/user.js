import {createSelector} from 'reselect';
import {getConfigurations} from './configurations';
import {convertBalanceFromHex} from 'utils/helpers/balance';
import {getBase64IdentIcon} from 'utils/helpers/identicon';
import {getCurrentPrice} from './price';
import {getMassagedTokenData} from './tokens';
import * as DEFAULT_CONFIG from '../constants/key';

const CSPR_INFO = {
    symbol: 'CSPR',
    address: 'CSPR',
    icon: require('../../assets/images/ic_cspr.png'),
};

export const getLoginOptions = ({ user }) => {
    return user.casperdash && user.casperdash.loginOptions || {};
};


export const getPublicKey = ({user}) => {
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
    getConfigurations,
    (accountDetails, CSPRPrice, tokensData, configurations) => {
        const transferFee = configurations['CSPR_TRANSFER_FEE'] || DEFAULT_CONFIG['CSPR_TRANSFER_FEE']
        const minAmount = configurations['MIN_CSPR_TRANSFER'] || DEFAULT_CONFIG['MIN_CSPR_TRANSFER'];
        const tokenTransferFee = configurations['TOKEN_TRANSFER_FEE'] || DEFAULT_CONFIG['TOKEN_TRANSFER_FEE'];

        const CSPRBalance = (accountDetails && accountDetails.balance && accountDetails.balance.displayBalance) || 0;
        const CSPRInfo = {
            ...CSPR_INFO,
            balance: {displayValue: CSPRBalance},
            price: CSPRPrice,
            totalPrice: CSPRPrice * CSPRBalance,
            transferFee: transferFee,
            minAmount: minAmount,
        };

        //TODO: should get price for each token, currently no token issue on Casper blockchain and no source as well
        // Temporary set the token price to 0
        const tokenPrice = 0;
        const tokensInfo =
            tokensData && tokensData.length
                ? tokensData.map((datum) => ({
                    price: tokenPrice,
                    totalPrice: tokenPrice * datum.balance.displayValue,
                    transferFee: tokenTransferFee,
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
