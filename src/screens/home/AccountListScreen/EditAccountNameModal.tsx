import React, { useEffect } from 'react';
import { colors, fonts, textStyles } from 'assets';
import { scale } from 'device';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { Col } from 'components';
import { IAccountInfo } from 'utils/hooks/useAccountInfo';
import CTextButton from 'components/CTextButton';

interface EditAccountNameModalProps {
  setEditingAccount: any;
  onChangeName: (name: string) => Promise<void>;
  account?: IAccountInfo;
}

export const EditAccountNameModal = ({ setEditingAccount, account, onChangeName }: EditAccountNameModalProps) => {
  const [name, setName] = React.useState(account?.walletInfo.descriptor.name || '');

  useEffect(() => {
    if (account) {
      setName(account?.walletInfo.descriptor.name || '');
    }
  }, [account]);

  const onHideModal = () => {
    setEditingAccount();
  };

  const onSave = async () => {
    await onChangeName(name);
    setEditingAccount();
  };

  return (
    <Modal
      style={styles.container}
      useNativeDriver={true}
      hideModalContentWhileAnimating
      coverScreen={true}
      onBackdropPress={onHideModal}
      backdropColor={'rgba(252, 252, 253, 0.4)'}
      isVisible={!!account}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
    >
      <Col style={styles.body}>
        <Col mb={12}>
          <Text style={styles.title}>Edit Account Name</Text>
        </Col>
        <Col mb={12}>
          <View style={styles.row}>
            <TextInput style={styles.input} value={name} onChangeText={(value) => setName(value)} />
          </View>
        </Col>
        <Col style={styles.actionsContainer}>
          <CTextButton
            onPress={onHideModal}
            text="Cancel"
            variant="secondary"
            type="line"
            style={styles.cancelButton}
          />
          <CTextButton onPress={onSave} text="Save" style={styles.saveButton} />
        </Col>
      </Col>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(50),
  },
  input: {
    height: scale(48),
    flex: 1,
    fontFamily: fonts.Poppins.regular,
    color: colors.c000000,
    paddingVertical: 0,
    fontSize: scale(18),
    textAlignVertical: 'center',
    paddingHorizontal: scale(16),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(16),
    backgroundColor: colors.N5,
  },
  actionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    width: '45%',
    marginRight: scale(20),
  },
  saveButton: {
    width: '45%',
  },

  body: {
    width: scale(320),
    minHeight: scale(180),
    backgroundColor: colors.W1,
    borderRadius: scale(16),
    padding: scale(24),
    shadowColor: Platform.OS === 'ios' ? 'rgba(35, 38, 53, 0.2)' : 'rgba(35, 38, 53, 0.6)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: scale(16),
    shadowOpacity: 0.6,
    elevation: 10,
  },
  title: {
    ...textStyles.Body1,
    fontWeight: 'bold',
  },
});
