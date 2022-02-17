import {Message} from 'components/CMessge/types';

export const types = {
    SHOW_MESSAGE: 'SHOW_MESSAGE',
    SHOW_MESSAGE_SUCCESS: 'SHOW_MESSAGE_SUCCESS',

    LOAD_LOCAL_STORAGE: 'LOAD_LOCAL_STORAGE',
    LOAD_LOCAL_STORAGE_SUCCESS: 'LOAD_LOCAL_STORAGE_SUCCESS',

    GET_CONFIGURATIONS: 'GET_CONFIGURATIONS',
    GET_CONFIGURATIONS_SUCCESS: 'GET_CONFIGURATIONS_SUCCESS',

    START_ACTION: 'START_ACTION',
    STOP_ACTION: 'STOP_ACTION'
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

export const startAction = (name: any, params?: any) => ({
    type: types.START_ACTION,
    payload: {
        action: {
            name,
            params,
        },
    },
});

export const stopAction = (name: any) => ({
    type: types.STOP_ACTION,
    payload: { name },
});

export default {
    showMessage,
    loadLocalStorage,
    getConfigurations,
    startAction,
    stopAction,
};
