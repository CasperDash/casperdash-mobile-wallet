import * as yup from 'yup';
import { useConfigurations } from 'utils/hooks/useConfigurations';
import { useStakedInfo } from 'utils/hooks/useStakeDeploys';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getPublicKey } from 'utils/selectors';
import { useAccountInfo } from 'utils/hooks/useAccountInfo';
import { IValidator } from 'utils/hooks/useValidators';
import { useGetFeeByEntryPoint } from 'utils/hooks/useGetFeeByEntryPoint';
import { ENTRY_POINT_REDELEGATE, ENTRY_POINT_UNDELEGATE } from 'utils/constants/key';
import { VALIDATOR_REACHED_MAXIMUM } from 'utils/constants/staking';

type Props = {
  validatorPublicKey?: string;
  selectedValidator?: IValidator;
};

export const useYupUndelegateFormSchema = ({ validatorPublicKey, selectedValidator }: Props) => {
  const publicKey = useSelector(getPublicKey)!;
  const { data: stakedInfo } = useStakedInfo(publicKey);
  const { data: configurations } = useConfigurations();
  const { getFeeByEntryPoint } = useGetFeeByEntryPoint();
  const { massagedData: userDetails } = useAccountInfo(publicKey);
  const balance = userDetails?.balance?.displayBalance ?? 0;
  const minCSPRDelegateToNewValidator = configurations?.MIN_CSPR_DELEGATE_TO_NEW_VALIDATOR || 0;

  const hasDelegated = useMemo(() => {
    return !!stakedInfo?.find((item) => item.validatorPublicKey === validatorPublicKey);
  }, [stakedInfo, validatorPublicKey]);

  return yup.object().shape({
    amount: yup
      .number()
      .transform((_, value) => {
        if (value?.includes('.')) {
          return parseFloat(value);
        }
        return +value.replace(/,/, '.');
      })
      .required('Amount must be more than 0 CSPR')
      .test('max', `You don't have enough CSPR to pay the fee`, function (value: any, context: yup.TestContext<any>) {
        let fee = getFeeByEntryPoint(ENTRY_POINT_UNDELEGATE);
        if (context.parent.isRedelegate) {
          fee = getFeeByEntryPoint(ENTRY_POINT_REDELEGATE);
        }

        if (balance < fee) {
          return context.createError({
            message: `Sorry, you do not have sufficient funds in your active balance to perform the undelegation process. Please make sure you have at least ${fee} CSPR in your active balance before attempting to ${
              context?.parent.isRedelegate ? 'redelegate' : 'undelegate'
            }.`,
          });
        }

        return true;
      })
      .test('min', 'Amount must be more than 0 CSPR', function (value: any) {
        return value > 0;
      })
      .test(
        'minByNewValidator',
        `Please note that the minimum amount for your staking is ${minCSPRDelegateToNewValidator} CSPR or more. Please adjust your amount and try again.`,
        function (value: any, context: yup.TestContext<any>) {
          if (!context.parent.isRedelegate) {
            return true;
          }
          return (!configurations?.DISABLE_INCREASE_STAKE && hasDelegated) || value >= minCSPRDelegateToNewValidator;
        },
      ),
    validator: yup.string(),
    newValidator: yup
      .string()
      .test('maxDelegator', VALIDATOR_REACHED_MAXIMUM, (_value, context: yup.TestContext<any>) => {
        if (!context.parent.isRedelegate) {
          return true;
        }

        return hasDelegated || !selectedValidator?.isFullDelegator;
      }),
  });
};
