import { types as mainTypes } from '../main/main_action';

const initialState = {
  listValidators: [],
};

export default function (state = initialState, action = { type: '', payload: null }) {
  switch (action.type) {
    case mainTypes.CLEAR_ALL_DATA: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}
