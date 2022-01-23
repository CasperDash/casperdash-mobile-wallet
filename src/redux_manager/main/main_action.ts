import {Message} from 'components/CMessge/types';

export const types = {
    SHOW_MESSAGE: 'SHOW_MESSAGE',
    SHOW_MESSAGE_SUCCESS: 'SHOW_MESSAGE_SUCCESS',
};

const showMessage = (message: Message, duration?: number) => {
    return {
        type: types.SHOW_MESSAGE,
        message,
        duration,
    };
};

export default {
    showMessage,
};
