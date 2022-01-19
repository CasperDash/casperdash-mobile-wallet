import ChoosePinRouter from './ChoosePinRouter';
import {ChoosePinScreen, ConfirmPinScreen} from 'screens';

const {CHOOSE_PIN_SCREEN, CONFIRM_PIN_SCREEN} = ChoosePinRouter;

export const ChoosePinScreens: any = {
    [CHOOSE_PIN_SCREEN]: {
        screen: ChoosePinScreen,
        title: 'ChoosePinScreen',
    },
    [CONFIRM_PIN_SCREEN]: {
        screen: ConfirmPinScreen,
        title: 'ChoosePinScreen',
    },
};
