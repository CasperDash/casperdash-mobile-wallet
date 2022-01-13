import {
    CreateNewWalletScreen,
    RecoveryPhraseScreen,
    DoubleCheckItScreen,
    ImportPhraseScreen,
    ChoosePinScreen,
    ConfirmPinScreen
} from 'screens';

import CreateNewWalletRouter from './CreateNewWalletRouter';

const {
    CREATE_NEW_WALLET_SCREEN,
    RECOVERY_PHRASE_SCREEN,
    DOUBLE_CHECK_IT_SCREEN,
    IMPORT_PHRASE_SCREEN,
    CHOOSE_PIN_SCREEN,
    CONFIRM_PIN_SCREEN
} = CreateNewWalletRouter;

export const CreateNewWalletScreens: any = {
    [CREATE_NEW_WALLET_SCREEN]: {
        screen: CreateNewWalletScreen,
        title: 'CreateNewWalletScreen'
    },
    [RECOVERY_PHRASE_SCREEN]: {
        screen: RecoveryPhraseScreen,
        title: 'RecoveryPhraseScreen'
    },
    [DOUBLE_CHECK_IT_SCREEN]: {
        screen: DoubleCheckItScreen,
        title: 'DoubleCheckItScreen',
    },
    [IMPORT_PHRASE_SCREEN]: {
        screen: ImportPhraseScreen,
        title: 'ImportPhraseScreen'
    },
    [CHOOSE_PIN_SCREEN]: {
        screen: ChoosePinScreen,
        title: 'ChoosePinScreen'
    },
    [CONFIRM_PIN_SCREEN]: {
        screen: ConfirmPinScreen,
        title: 'ConfirmPinScreen'
    }
};
