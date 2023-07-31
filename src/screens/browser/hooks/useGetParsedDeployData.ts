import { UseQueryOptions, useQuery } from 'react-query';
import { SignDeployParams } from '../types/signing';
import { parseDeployData } from '../utils/parser';
import _ from 'lodash';

type DeployParam = {
  key: string;
  isTruncated?: boolean;
  title: string;
};
const DEPLOY_PARAMS: DeployParam[] = [
  {
    key: 'deployHash',
    title: 'Deploy Hash',
    isTruncated: true,
  },
  {
    key: 'account',
    title: 'Account',
    isTruncated: true,
  },
  {
    key: 'timestamp',
    title: 'Timestamp',
  },
  {
    key: 'payment',
    title: 'Payment',
  },
  {
    key: 'deployType',
    title: 'Deploy Type',
  },
];

type DeployValue = {
  title: string;
  value: string;
};

export type ParsedDeployData = {
  params: DeployValue[];
  args: DeployValue[];
};

export const useGetParsedDeployData = (
  params: SignDeployParams,
  options?: Omit<UseQueryOptions<unknown, unknown, ParsedDeployData>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    ...options,
    queryFn: async () => {
      const data = await parseDeployData(params);

      const deployParams = DEPLOY_PARAMS.reduce((acc: DeployValue[], { key, title }: DeployParam) => {
        const value = _.get(data, key, '');

        return [
          ...acc,
          {
            title,
            value,
          },
        ];
      }, []);

      const deployArgs = Object.keys(_.get(data, 'deployArgs', {})).map((argKey: string) => {
        const value = _.get(data, `deployArgs[${argKey}]`, '');

        return {
          title: argKey,
          value,
        };
      }, []);

      return {
        params: deployParams,
        args: deployArgs,
      };
    },
    enabled: !!params,
  });
};
