// import { useDispatch, useSelector } from 'react-redux';
// import { getTokensAddressList } from 'utils/selectors';
// import { getPublicKey, getAllTokenInfo, getTokenInfoByAddress } from 'utils/selectors';
// import { allActions } from 'redux_manager';
// import { useEffect } from 'react';

// export const useTokenInfo = (token: string) => {
//   const dispatch = useDispatch();

//   // Selector
//   const tokensAddressList = useSelector(getTokensAddressList);
//   const publicKey = useSelector(getPublicKey);
//   const allTokenInfo = useSelector(getAllTokenInfo);
//   const tokenInfoByAddress = useSelector(getTokenInfoByAddress(token));

//   // Effect
//   useEffect(() => {
//     if (publicKey) {
//       dispatch(
//         allActions.home.getTokenInfoWithBalance({
//           tokensAddressList,
//           publicKey,
//           skipAction: true,
//         }),
//       );
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [publicKey]);

//   return { allTokenInfo, tokenInfoByAddress };
// };
