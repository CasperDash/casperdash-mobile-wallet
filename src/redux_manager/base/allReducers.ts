import { combineReducers } from 'redux';
import User from '../user/user_reducer';
import Main from '../main/main_reducer';
import Home from '../home/home_reducer';
import Wallet from '../wallet/wallet_reducer';
import NFT from '../nft/nft_reducer';

export default combineReducers({
  user: User,
  main: Main,
  wallet: Wallet,
  home: Home,
  nft:NFT
});
