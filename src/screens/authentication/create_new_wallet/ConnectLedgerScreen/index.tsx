import React, {useState} from 'react';
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import {CHeader, CLayout} from 'components';
import {DeviceSelectionScreen, ShowAddressScreen} from 'screens';

const ConnectLedgerScreen = () => {

    const [transport, setTransport] = useState<any>();

    const onSelectDevice = async (device: any) => {
        const tp = await TransportBLE.open(device);
        tp.on('disconnect', () => {
            setTransport(null);
        });
        setTransport(tp);
    };

    return (
        <CLayout>
            <CHeader title={'Connect Ledger'}/>
            {
                !transport ? <DeviceSelectionScreen onSelectDevice={onSelectDevice}/> :
                    <ShowAddressScreen transport={transport}/>
            }
        </CLayout>
    );
};

export default ConnectLedgerScreen;
