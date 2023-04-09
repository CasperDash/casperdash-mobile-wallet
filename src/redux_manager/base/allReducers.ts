import { combineReducers } from 'redux';
import User from '../user/user_reducer';
import Main from '../main/main_reducer';
import Home from '../home/home_reducer';
import NFT from '../nft/nft_reducer';
import Staking from '../staking/staking_reducer';

export default combineReducers({
  user: User,
  main: Main,
  home: Home,
  nft: NFT,
  staking: Staking,
});
