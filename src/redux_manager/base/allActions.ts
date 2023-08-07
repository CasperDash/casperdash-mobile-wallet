import browser from '../browser/browser_action';
import home from '../home/home_action';
import main from '../main/main_action';
import staking from '../staking/staking_action';
import user from '../user/user_action';

const allActions = {
  user: user,
  main: main,
  home: home,
  staking: staking,
  browser,
};

export default allActions;
