import { useQuery } from 'react-query';
import Fuse from 'fuse.js';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { IValidatorResponse, getValidators, getValidatorsDetail } from 'services/Validators/validatorsApis';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { useMemo } from 'react';

export interface IValidator extends IValidatorResponse {
  name?: string;
  description?: string;
  logo?: string;
  icon?: string;
  priority?: boolean;
}

export const useValidatorsDetail = () => {
  const query = useQuery({
    queryKey: [ERequestKeys.validatorsDetail],
    queryFn: () => getValidatorsDetail(),
  });
  return query;
};

export const useValidators = (searchTerm: string) => {
  const { data: validatorsDetail } = useValidatorsDetail();

  const query = useQuery({
    queryKey: [ERequestKeys.validators],
    queryFn: () => getValidators(),
  });

  const massagedData = useMemo<IValidator[]>(
    () =>
      query.data?.map((validator: IValidatorResponse) => {
        const validatorDetail = validatorsDetail?.[validator.validatorPublicKey];
        return {
          ...validator,
          name: validatorDetail?.name,
          description: validatorDetail?.description,
          logo: validatorDetail?.logo,
          icon: getBase64IdentIcon(validator.validatorPublicKey, { size: 100 }),
          priority: validatorDetail?.priority,
        };
      }) || [],
    [query.data, validatorsDetail],
  );

  const filteredData = useMemo<IValidator[]>(() => {
    if (!searchTerm) {
      return massagedData;
    }
    if (!massagedData) {
      return [];
    }
    const fuse = new Fuse(massagedData, { keys: ['public_key', 'name'], threshold: 0.1 });
    return fuse.search(searchTerm).map((result) => result.item);
  }, [massagedData, searchTerm]);

  return { ...query, massagedData, filteredData };
};
