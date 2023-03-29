import { DeployUtil } from 'casperdash-js-sdk';
import TransportWebUSB from '@ledgerhq/react-native-hw-transport-ble';
import CasperApp from '@zondax/ledger-casper';
import { CONNECT_ERROR_MESSAGE } from '../constants/ledger';
import * as ledgerService from './ledgerServices';

jest.mock('utils', () => ({
  __esModule: true,
  Config: { getItem: () => {} },
  Keys: { ledger: 'transport' },
}));

jest.mock('@ledgerhq/react-native-hw-transport-ble', () => ({
  __esModule: true,
  default: { create: jest.fn(), open: jest.fn() },
}));
jest.mock('@zondax/ledger-casper', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('casperdash-js-sdk', () => ({
  ...jest.requireActual('casperdash-js-sdk'),
  DeployUtil: {
    deployToBytes: jest.fn(),
    setSignature: jest.fn(),
    validateDeploy: jest.fn(),
    deployToJson: jest.fn(),
  },
}));

describe('signDeployByLedger', () => {
  test('Should throw error if can not sign', async () => {
    try {
      const mockSign = jest.fn();
      mockSign.mockReturnValue({});
      CasperApp.mockReturnValue({ sign: mockSign });
      TransportWebUSB.open.mockReturnValue({ close: jest.fn() });
      await ledgerService.signDeployByLedger({ deploy: {} }, {});
      expect(TransportWebUSB.open).toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toEqual('');
    }
  });
  test('Should return signed deploy', async () => {
    const mockSign = jest.fn();
    mockSign.mockReturnValue({ signatureRS: {} });
    CasperApp.mockReturnValue({ sign: mockSign });
    TransportWebUSB.open.mockReturnValue({ close: jest.fn() });
    DeployUtil.validateDeploy.mockReturnValue({ ok: {} });
    await ledgerService.signDeployByLedger(
      { deploy: {} },
      {
        publicKey: '0111a5aee38d7506ae9199e62c30b8303298a38ca7e9835545772f21414ea019b0',
      },
    );
    expect(TransportWebUSB.open).toHaveBeenCalled();
    expect(DeployUtil.setSignature).toHaveBeenCalled();
    expect(DeployUtil.deployToBytes).toHaveBeenCalled();
    expect(DeployUtil.validateDeploy).toHaveBeenCalled();
    expect(DeployUtil.deployToJson).toHaveBeenCalled();
  });
  test('Should return throw error if validate deploy failed', async () => {
    try {
      const mockSign = jest.fn();
      mockSign.mockReturnValue({ signatureRS: {} });
      CasperApp.mockReturnValue({ sign: mockSign });
      TransportWebUSB.open.mockReturnValue({ close: jest.fn() });

      await ledgerService.signDeployByLedger(
        { deploy: {} },
        {
          publicKey: '0111a5aee38d7506ae9199e62c30b8303298a38ca7e9835545772f21414ea019b0',
        },
      );
    } catch (error) {
      expect(error.message).toEqual('Error on sign deploy with ledger.');
    }
  });
});

describe('getLedgerPublicKey', () => {
  test('Should throw error if no public key', async () => {
    try {
      const mockGetAddressAndPubKey = jest.fn();
      mockGetAddressAndPubKey.mockReturnValue('testpk');
      await ledgerService.getLedgerPublicKey({ getAddressAndPubKey: mockGetAddressAndPubKey }, 1);
    } catch (error) {
      expect(error.message).toEqual('You must open the Casper app on your Ledger device to connect.');
    }
  });
  test('Should return public key', async () => {
    const mockGetAddressAndPubKey = () => ({ publicKey: 'testpk' });

    const pk = await ledgerService.getLedgerPublicKey({ getAddressAndPubKey: mockGetAddressAndPubKey }, 1);
    expect(pk).toEqual('02testpk');
  });
});

describe('getListKeys', () => {
  test('Should return list of public key', async () => {
    const mockGetAddressAndPubKey = () => ({ publicKey: 'testpk' });
    const pks = await ledgerService.getListKeys({ getAddressAndPubKey: mockGetAddressAndPubKey }, 1, 2);
    expect(pks).toEqual([
      {
        keyIndex: 1,
        publicKey: '02testpk',
      },
      {
        keyIndex: 2,
        publicKey: '02testpk',
      },
    ]);
  });
});

describe('getLedgerError', () => {
  test('Should return connect error message', () => {
    expect(ledgerService.getLedgerError({ name: 'TransportInterfaceNotAvailable' })).toEqual(CONNECT_ERROR_MESSAGE);
    expect(ledgerService.getLedgerError({}, 27014)).toEqual(CONNECT_ERROR_MESSAGE);
  });
  test('Should return Unsupported Deploy error message', () => {
    expect(ledgerService.getLedgerError({}, 27012)).toEqual('Unsupported Deploy');
  });
  test('Should return error message', () => {
    expect(ledgerService.getLedgerError({ message: 'error' })).toEqual('error');
  });
});
