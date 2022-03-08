import {useDispatch, useSelector} from 'react-redux';
import {getTokensAddressList} from 'utils/selectors';
import {getPublicKey, getAllTokenInfo, getTokenInfoByAddress} from '../selectors/user';
import {allActions} from 'redux_manager';
import {useEffect} from 'react';

export const useTokenInfo = (token) => {
    const dispatch = useDispatch();

    // Selector
    const tokensAddressList = useSelector(getTokensAddressList);
    const publicKey = useSelector(getPublicKey);
    const allTokenInfo = useSelector(getAllTokenInfo);
    const tokenInfoByAddress = useSelector(getTokenInfoByAddress(token));

    // Effect
    useEffect(() => {
        if (publicKey) {
            dispatch(allActions.home.getTokenInfoWithBalance({tokensAddressList, publicKey, skipAction: true}));
        }
    }, [publicKey]);

    return {allTokenInfo, tokenInfoByAddress};
};
