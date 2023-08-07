import { BigNumber } from '@ethersproject/bignumber';
import Big from 'big.js';

import { toMotes, toCSPR } from './currency';

describe('toMotes', () => {
  test('can convert cspr to mote with valid string number', () => {
    expect(toMotes('10').toNumber()).toEqual(10000000000);
  });

  test('can convert cspr to mote with floating number string having less than 9 decimal places', () => {
    expect(toMotes('1.123456789').toNumber()).toEqual(1123456789);
  });

  test('can covert cspr to rounded mote with floating number string having more than 9 decimal places', () => {
    expect(toMotes('10.123456789123').toNumber()).toEqual(10123456789);
  });

  test('can not covert cspr to mote with string', () => {
    expect(toMotes('casperdash')).toEqual(BigNumber.from(0));
  });
});

describe('toCSPR', () => {
  test('can convert mote to CSPR with valid string number', () => {
    expect(toCSPR(10000000000).toString()).toEqual('10');
  });
  test('can not covert mote to CSPR with string', () => {
    expect(toCSPR('casperdash')).toEqual(new Big(0));
  });
});
