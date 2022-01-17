import React, {useState} from 'react';
import {View, Text} from 'react-native';
import TransportBLE from "@ledgerhq/react-native-hw-transport-ble";
import {CHeader, CLayout} from "components";
import {DeviceSelectionScreen, ShowAddressScreen} from "screens";

const ConnectLedgerScreen = () => {

    const [transport, setTransport] = useState<any>();

    const onSelectDevice = async (device: any) => {
        const transport = await TransportBLE.open(device);
        transport.on("disconnect", () => {
            setTransport(null);
        });
        setTransport(transport);
    };

    return (
        <CLayout>
            <CHeader title={''}/>
            {
                !transport ? <DeviceSelectionScreen onSelectDevice={onSelectDevice}/> :
                    <ShowAddressScreen transport={transport}/>
            }
        </CLayout>
    );
};

export default ConnectLedgerScreen;
