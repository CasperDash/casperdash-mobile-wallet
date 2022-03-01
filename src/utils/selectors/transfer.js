import {createSelector} from 'reselect';

export const getDeploysTransfer = createSelector(
    state => state.main,
    (_, params) => params,
    (main, params) => {
        const {publicKey, status, symbol} = params;
        const {deploysTransfer} = main;
        if (deploysTransfer) {
            const transferByPublicKey = deploysTransfer[publicKey] || [];
            return transferByPublicKey.filter(transfer => (symbol ? transfer.symbol === symbol : true) && (status ? transfer.status === status : true));
        }
        return [];
    }
);

