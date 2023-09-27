import { colors, textStyles } from 'assets';
import { CInputFormik } from 'components';
import { scale } from 'device';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CTextButton from 'components/CTextButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isValidPublicKey } from 'utils/validator';
import { useSelectedAccountInfo } from 'utils/hooks/useAccountInfo';
import { useUpdateDisplayType } from '../hooks/useUpdateDisplayType';
import { DisplayTypes } from 'redux_manager/nft/nft_reducer';
import ConfirmSendNFTScreen from './ConfirmSendScreen';
import { INFTInfo } from 'services/NFT/nftApis';
import { useEstimateSendNFTFee } from 'screens/nft/hooks/useEstimateSendNFTFee';
import { toCSPR, toMotes } from 'utils/helpers/currency';
import { BigNumber } from '@ethersproject/bignumber';

type Props = {
  nft: INFTInfo;
};

const validationSchema = yup.object().shape({
  receivingAddress: yup
    .string()
    .required('Please enter receiving address')
    .test('isValidAddress', 'Invalid address', (value) => {
      if (!value) {
        return false;
      }
      if (!isValidPublicKey(value)) {
        return false;
      }

      return true;
    }),
  fee: yup
    .number()
    .transform((_, value) => {
      if (typeof value !== 'string') {
        return value;
      }

      if (value?.includes('.')) {
        return parseFloat(value);
      }

      return +value.replace(/,/, '.');
    })
    .required('The entered amount is required.')
    .test('isValidFee', (value, context) => {
      if (!value) {
        return context.createError({
          message: 'The entered amount is invalid.',
        });
      }
      if (value <= 0) {
        return context.createError({
          message: 'The entered amount is invalid.',
        });
      }

      if (context.parent.balance < value) {
        return context.createError({
          message: `Please make sure you have at least ${value} CSPR in your active balance before attempting to send.`,
        });
      }

      return true;
    }),
});

const TransferNFTForm = ({ nft }: Props) => {
  const { tokenId, contractAddress, image, name, tokenStandardId } = nft;
  const accountInfo = useSelectedAccountInfo();
  const updateDisplayType = useUpdateDisplayType();
  const [isConfirm, setIsConfirm] = useState(false);

  const { bottom } = useSafeAreaInsets();
  const { handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue } = useFormik({
    initialValues: {
      name,
      tokenId,
      contractAddress,
      image,
      receivingAddress: '',
      tokenStandardId,
      balance: 0,
      fee: '0',
    },
    validationSchema,
    onSubmit: () => {
      setIsConfirm(true);
    },
  });

  const params = {
    contractAddress,
    tokenId,
    toPublicKeyHex: values.receivingAddress,
    tokenStandardId,
    name,
    image,
    isUsingSessionCode: nft.isUsingSessionCode,
    wasmName: nft.wasmName,
  };

  const { data, isLoading: isEstimating } = useEstimateSendNFTFee({
    ...params,
  });

  useEffect(() => {
    if (!isEstimating) {
      if (data?.execution_result?.Success?.cost) {
        setFieldValue('fee', toCSPR(data.execution_result.Success.cost).toString());
      }
    }
  }, [data, isEstimating, setFieldValue]);

  useEffect(() => {
    if (accountInfo) {
      setFieldValue('balance', accountInfo?.balance?.displayBalance || 0);
    }
  }, [accountInfo, setFieldValue]);

  const handleOnCancel = () => {
    updateDisplayType(DisplayTypes.ATTRIBUTES);
  };

  const paymentAmount = values.fee ? toMotes(values.fee.toString().replace(/,/, '.')) : BigNumber.from(0);

  return (
    <View style={styles.container}>
      {isConfirm ? (
        <ConfirmSendNFTScreen
          params={{
            ...params,
            paymentAmount,
          }}
        />
      ) : (
        <>
          <View>
            <View>
              <Text style={styles.title}>Receiving Address</Text>
              <CInputFormik
                name={'receivingAddress'}
                inputStyle={styles.inputStyle}
                placeholder={'Enter receiving address'}
                containerStyle={styles.rowPicker}
                {...{ values, errors, touched, handleBlur, handleChange }}
              />
            </View>
            <View>
              <Text style={styles.title}>{isEstimating ? 'Estimating...' : 'Network Fee'}</Text>
              <CInputFormik
                name={'fee'}
                inputStyle={styles.inputStyle}
                placeholder={'Enter network fee'}
                containerStyle={styles.rowPicker}
                {...{ values, errors, touched, handleBlur, handleChange }}
              />
            </View>
          </View>
          <View style={styles.footer}>
            <CTextButton
              style={[styles.btn, styles.btnConfirm, { marginBottom: bottom + scale(16) }]}
              onPress={handleOnCancel}
              text={'Cancel'}
              type={'line'}
              variant="secondary"
            />
            <CTextButton
              style={[styles.btn, styles.btnConfirm, { marginBottom: bottom + scale(16) }]}
              onPress={handleSubmit}
              text={'Next'}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(375),
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
    paddingHorizontal: scale(16),
    paddingBottom: scale(80),
  },
  inputStyle: {
    ...textStyles.Sub1,
  },
  rowPicker: {
    width: scale(343),
    minHeight: scale(48),
    maxHeight: scale(100),
    backgroundColor: colors.N5,
    borderRadius: scale(16),
    borderWidth: 0,
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
    marginTop: scale(24),
    marginBottom: scale(16),
  },
  value: {
    ...textStyles.Sub1,
    // color: colors.G1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    width: '48%',
  },
  btnConfirm: {
    alignSelf: 'center',
    marginTop: scale(20),
  },
});

export default TransferNFTForm;
