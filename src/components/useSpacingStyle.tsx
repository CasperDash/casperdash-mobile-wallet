import { scale } from 'device';

import { SpacingValue } from './base.props';

const verticalIdentifiers = ['t', 'b', 'y'];
const horizontalIdentifiers = ['l', 'r', 'x'];

const getSpacingValue = (attr: string, value: SpacingValue) => {
  // margin
  if (attr[0] === 'm') {
    // Margin vertical
    if (verticalIdentifiers.includes(attr[1])) {
      return scale(value);
      // Margin horizontal
    } else if (horizontalIdentifiers.includes(attr[1])) {
      return scale(value);
    }
  }

  // margin
  if (attr[0] === 'p') {
    // Padding vertical
    if (verticalIdentifiers.includes(attr[1])) {
      return scale(value);
      // Padding horizontal
    } else {
      return scale(value);
    }
  }
  return scale(value);
};

export function useSpacingStyle(attrs: { [key: string]: any }) {
  const { mt, ml, mr, mb, mx, my, ma, pt, pl, pr, pb, px, py, pa } = attrs;
  delete attrs.mt;
  delete attrs.ml;
  delete attrs.mr;
  delete attrs.mb;
  delete attrs.mx;
  delete attrs.my;
  delete attrs.ma;
  delete attrs.pt;
  delete attrs.pl;
  delete attrs.pr;
  delete attrs.pb;
  delete attrs.px;
  delete attrs.py;
  delete attrs.pa;

  return {
    ...((mt || mt === 0) && { marginTop: getSpacingValue('mt', mt) }),
    ...((ml || ml === 0) && { marginLeft: getSpacingValue('ml', ml) }),
    ...((mr || mr === 0) && { marginRight: getSpacingValue('mr', mr) }),
    ...((mb || mb === 0) && { marginBottom: getSpacingValue('mb', mb) }),
    ...((mx || mx === 0) && { marginHorizontal: getSpacingValue('mx', mx) }),
    ...((my || my === 0) && { marginVertical: getSpacingValue('my', my) }),
    ...((ma || ma === 0) && { margin: getSpacingValue('ma', ma) }),
    ...((pt || pt === 0) && { paddingTop: getSpacingValue('pt', pt) }),
    ...((pl || pl === 0) && { paddingLeft: getSpacingValue('pl', pl) }),
    ...((pr || pr === 0) && { paddingRight: getSpacingValue('pr', pr) }),
    ...((pb || pb === 0) && { paddingBottom: getSpacingValue('pb', pb) }),
    ...((px || px === 0) && { paddingHorizontal: getSpacingValue('px', px) }),
    ...((py || py === 0) && { paddingVertical: getSpacingValue('py', py) }),
    ...((pa || pa === 0) && { marginLeft: getSpacingValue('pa', pa) }),
  };
}
