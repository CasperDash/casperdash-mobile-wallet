import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {ScreenProps} from 'navigation/ScreenProps';
import MainRouter from 'navigation/stack/MainRouter';
import {useTokenInfo} from 'utils/hooks/useTokensInfo';
import {useSelector} from 'react-redux';
import {getDeploysTransfer} from 'utils/selectors/transfer';
import {getPublicKey} from 'utils/selectors';

// @ts-ignore
const HistoriesScreen: React.FC<ScreenProps<MainRouter.HISTORIES_SCREEN>> = ({route}) => {
    const {token} = route.params;

    const [selectedStatus, setSelectedStatus] = useState<string>('pending');

    const { tokenInfoByAddress: tokenInfo } = useTokenInfo(token);
    const publicKey = useSelector(getPublicKey);
    // @ts-ignore
    const listTransfers = useSelector((state: any) => getDeploysTransfer(state, {symbol: token.symbol, publicKey, status: selectedStatus}));


    return (
        <View>
            <Text>HistoriesScreen</Text>
        </View>
    );
};

export default HistoriesScreen;
