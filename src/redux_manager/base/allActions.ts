import user from '../user/user_action';
import main from '../main/main_action';
import home from '../home/home_action';
import staking from '../staking/staking_action';
import browser from '../browser/browser_action';
import nft from '../nft/nft_action';

const allActions = {
  user: user,
  main: main,
  home: home,
  staking: staking,
  browser,
  nft,
};

export default allActions;
