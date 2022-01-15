import React from 'react';
import {
    images,
    IconImportPhrase,
    IconPlusCircle,
    IconConnectLedger
} from "assets";
import {scale} from "device";
import CreateNewWalletRouter from "navigation/CreateNewWalletNavigation/CreateNewWalletRouter";

export interface Intro {
    id: number,
    image: any,
    title: string,
}

const ListIntro: Array<Intro> = [
    {
        id: 0,
        image: images.intro1,
        title: 'The new NFT marketplace',
    },
    {
        id: 1,
        image: images.intro2,
        title: 'Get success in the crypto art',
    },
    {
        id: 2,
        image: images.intro3,
        title: 'Stake to earn more money',
    }
]

export interface CreateNewWalletMenu {
    id: number,
    icon: any,
    title: string,
    screen: string,
}

const ListCreateNewWalletMenu: Array<CreateNewWalletMenu> = [
    {
        id: 0,
        icon: () => <IconPlusCircle width={scale(22)} height={scale(22)}/>,
        title: 'Create new wallet',
        screen: CreateNewWalletRouter.RECOVERY_PHRASE_SCREEN
    },
    {
        id: 1,
        icon: () => <IconImportPhrase width={scale(22)} height={scale(22)}/>,
        title: 'Import Phrase',
        screen: CreateNewWalletRouter.IMPORT_PHRASE_SCREEN
    },
    {
        id: 2,
        icon: () => <IconConnectLedger width={scale(23)} height={scale(23)}/>,
        title: 'Connect Ledger',
        screen: '' //TODO: add this screen
    }
];

export interface Phrase {
    id: number,
    word: string
}

export {
    ListIntro,
    ListCreateNewWalletMenu,
}
