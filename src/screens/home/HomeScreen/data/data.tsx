import { IconSend, IconReceive } from 'assets';
import MainRouter from 'navigation/stack/MainRouter';

export interface AccountAction {
  id: number;
  icon: any;
  title: string;
  screen: string;
}

const AccountActions: Array<AccountAction> = [
  {
    id: 0,
    icon: IconSend,
    title: 'Send',
    screen: MainRouter.SEND_SCREEN,
  },
  {
    id: 1,
    icon: IconReceive,
    title: 'Receive',
    screen: MainRouter.RECEIVE_SCREEN,
  },
  //TODO: follow the figma's design
  /*{
        id: 2,
        icon: IconSwap,
        title: 'Swap',
        screen: 'SwapScreen',
    },*/
];

export { AccountActions };
