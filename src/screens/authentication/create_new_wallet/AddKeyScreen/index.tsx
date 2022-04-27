import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { CInput, CLayout, CLoading } from 'components';
import { CHeader, Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import CTextButton from 'components/CTextButton';
import { Config } from 'utils';
import { Keys } from 'utils';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { allActions } from 'redux_manager';
import { useDispatch } from 'react-redux';
import { isValidPublicKey } from 'utils/validator';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';

function AddKeyScreen() {
  const [error, setError] = useState('');
  const [publicKey, setPublicKey] = useState(
    '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38',
  );
  const { navigate } = useNavigation<StackNavigationProp<any>>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onChange = (
    value: string = '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38',
  ) => {
    setPublicKey(
      '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38',
    );
    setError(isValidPublicKey(value) ? '' : 'Invalid public key');
  };

  const onAddPublicKey = async () => {
    setLoading(true);

    dispatch(
      allActions.user.getAccountInformation(
        { publicKey },
        async (err: any, res: any) => {
          if (res) {
            setLoading(false);
            const info = {
              publicKey: publicKey,
              loginOptions: {
                connectionType: 'view_mode',
              },
            };
            await Config.saveItem(Keys.casperdash, info);
            navigate(AuthenticationRouter.CHOOSE_PIN, {
              screen: ChoosePinRouter.CHOOSE_PIN_SCREEN,
              params: {
                showBack: true,
              },
            });
          } else {
            setLoading(false);
            Config.alertMess(err);
          }
        },
      ),
    );
  };

  return (
    <CLayout bgColor={colors.cF8F8F8} statusBgColor={colors.cF8F8F8}>
      <CHeader title={'Add'} style={{ backgroundColor: colors.cF8F8F8 }} />
      <Col mt={10} py={24} style={styles.container}>
        <Text style={styles.title}>Public Key</Text>
        <CInput
          placeholder={'Enter public key'}
          inputStyle={styles.input}
          onChangeText={onChange}
          style={styles.inputContainer}
        />
        <Text style={styles.errorText}>{error}</Text>
        <CTextButton
          onPress={onAddPublicKey}
          disabled={!!error || !publicKey}
          style={styles.btnAdd}
          text={'Add'}
        />
      </Col>
      {isLoading && <CLoading />}
    </CLayout>
  );
}

export default AddKeyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  title: {
    ...textStyles.Body1,
    color: colors.N3,
    marginBottom: scale(8),
    marginHorizontal: scale(24),
  },
  input: {
    ...textStyles.Body1,
    color: colors.N2,
  },
  btnAdd: {
    width: scale(327),
    alignSelf: 'center',
  },
  errorText: {
    ...textStyles.Body2,
    color: colors.R1,
    marginHorizontal: scale(24),
    marginBottom: scale(20),
  },
  inputContainer: {
    marginBottom: scale(6),
    paddingHorizontal: scale(24),
  },
});
