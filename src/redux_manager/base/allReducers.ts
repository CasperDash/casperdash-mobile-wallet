import { combineReducers } from 'redux';
import User from '../user/user_reducer';
import Main from '../main/main_reducer';
import Home from '../home/home_reducer';
import Staking from '../staking/staking_reducer';
import Browser from '../browser/browser_reducer';

export default combineReducers({
  user: User,
  main: Main,
  home: Home,
  staking: Staking,
  browser: Browser,
});
