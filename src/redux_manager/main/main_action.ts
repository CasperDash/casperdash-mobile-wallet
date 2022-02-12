import {Message} from 'components/CMessge/types';

export const types = {
    SHOW_MESSAGE: 'SHOW_MESSAGE',
    SHOW_MESSAGE_SUCCESS: 'SHOW_MESSAGE_SUCCESS',

    LOAD_LOCAL_STORAGE: 'LOAD_LOCAL_STORAGE',
    LOAD_LOCAL_STORAGE_SUCCESS: 'LOAD_LOCAL_STORAGE_SUCCESS',

    GET_CONFIGURATIONS: 'GET_CONFIGURATIONS',
    GET_CONFIGURATIONS_SUCCESS: 'GET_CONFIGURATIONS_SUCCESS'
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

const getConfigurations = () => {
    return {
        type: types.GET_CONFIGURATIONS,
    };
};

export default {
    showMessage,
    loadLocalStorage,
    getConfigurations
};
