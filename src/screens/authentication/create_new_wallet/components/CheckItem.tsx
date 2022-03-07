import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { CButton, Col, Row } from 'components';
import { colors, fonts, textStyles } from 'assets';
import { isIos, scale } from 'device';

interface CheckItemProps {
  data: any;
  keyWords: any;
  onPress: (rowIndex: number, id: any) => void;
  rowIndex: number;
}

const CheckItem = ({ data, keyWords, onPress, rowIndex }: CheckItemProps) => {
  return (
    <Col px={16} mb={20}>
      <Text style={styles.title}>{`Select word #${keyWords.id}`}</Text>
      <Row mt={16} style={styles.row}>
        {data.length > 0 &&
          data.map((item: any, index: number) => {
            return (
              <CButton
                key={index}
                style={[
                  styles.wordsContainer,
                  item.isSelected && styles.selectedContainer,
                ]}
                onPress={() => onPress(rowIndex, item.id)}>
                <Text
                  style={{
                    ...textStyles.Body2,
                    marginTop: isIos() ? 0 : scale(3),
                  }}>
                  {item.word}
                </Text>
              </CButton>
            );
          })}
      </Row>
    </Col>
  );
};

export default CheckItem;

const styles = StyleSheet.create({
  title: {
    ...textStyles.Sub2,
    color: colors.N3,
    fontFamily: fonts.Lato.regular,
    fontWeight: '700',
    fontSize: scale(16),
  },
  wordsContainer: {
    borderRadius: scale(20),
    borderColor: colors.N5,
    borderWidth: scale(1),
    backgroundColor: colors.W1,
    height: scale(40),
    paddingHorizontal: scale(16),
    marginBottom: scale(16),
    marginRight: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexWrap: 'wrap',
  },
  selectedContainer: {
    backgroundColor: colors.R2,
    borderColor: colors.R1,
  },
});
