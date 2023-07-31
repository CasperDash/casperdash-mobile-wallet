import { JsonTypes } from 'typedjson';
import { DAppCustomEvents } from '../enums/events';

type Params = {
  publicKey?: string;
  deploy?: {
    deploy: JsonTypes;
  };
  signedMessage?: string;
};

export const buildEventSender = (method: string, { publicKey, deploy, signedMessage }: Params) => {
  const attrPublicKey = publicKey ? `'${publicKey}'` : 'undefined';
  const attrDeploy = deploy ? JSON.stringify(deploy) : 'undefined';
  const attrSignedMessage = signedMessage ? `'${signedMessage}'` : 'undefined';

  const objectPayload = `
  {
    publicKey: ${attrPublicKey},
    deploy: ${attrDeploy},
    signedMessage: ${attrSignedMessage},
  }
  `;

  return buildRawSender(method, objectPayload);
};

export const buildRawSender = (method: string, payloadString: string) => {
  return `
  (function() {
    const msg = {
      method: '${method}',
      type: 'reply',
      value: {
        payload: ${payloadString}
      }
    };
    window.postMessage(msg, window.location.origin);
  })();
`;
};

export const buildCustomEvent = (eventName: DAppCustomEvents, payload: string = 'undefined') => {
  return `
    (function() {
      const customEvent = new CustomEvent('${eventName}', {
        detail: ${payload},
      });
      window.dispatchEvent(customEvent);
    })()
  `;
};

export const buildDebugConsole = () => {
  return `
  (() => {
    var script = document.createElement('script');
    script.src="https://cdn.jsdelivr.net/npm/eruda";
    document.body.append(script);
    script.onload = () => { eruda.init() }
  })();
  `;
};

export const buildLocationChanger = (url: string) => {
  return `(function(){window.location.href = '${url}' })()`;
};
