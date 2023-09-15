export enum TokenStandards {
  CEP47 = 1,
  CEP78 = 2,
}

export const getTokenStandardName = (tokenStandardId: number) => {
  switch (tokenStandardId) {
    case TokenStandards.CEP47:
      return 'CEP47';
    case TokenStandards.CEP78:
      return 'CEP78';
    default:
      return '';
  }
};
