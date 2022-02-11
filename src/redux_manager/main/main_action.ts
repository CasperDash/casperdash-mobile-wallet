import {Message} from 'components/CMessge/types';

export const types = {
    SHOW_MESSAGE: 'SHOW_MESSAGE',
    SHOW_MESSAGE_SUCCESS: 'SHOW_MESSAGE_SUCCESS',

    LOAD_LOCAL_STORAGE: 'LOAD_LOCAL_STORAGE',
    LOAD_LOCAL_STORAGE_SUCCESS: 'LOAD_LOCAL_STORAGE_SUCCESS',
};

const showMessage = (message: Message, duration?: number) => {
    return {
        type: types.SHOW_MESSAGE,
        message,
        duration,
    };
};

const loadLocalStorage = () => {
    return {
        type: types.LOAD_LOCAL_STORAGE,
    };
};

export default {
    showMessage,
    loadLocalStorage
};
