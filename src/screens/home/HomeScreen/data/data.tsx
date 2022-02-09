import React from 'react';
import {
    IconSend,
    IconReceive, IconSwap,
} from 'assets';

export interface AccountAction {
    id: number,
    icon: any,
    title: string,
    screen: string,
}

const AccountActions: Array<AccountAction> = [
    {
        id: 0,
        icon: IconSend,
        title: 'Sent',
        screen: 'SendScreen',
    },
    {
        id: 1,
        icon: IconReceive,
        title: 'Receive',
        screen: 'ReceiveScreen',
    },
    {
        id: 2,
        icon: IconSwap,
        title: 'Swap',
        screen: 'SwapScreen',
    },
];

export {
    AccountActions,
};
