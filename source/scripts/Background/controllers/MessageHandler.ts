import { browser, Runtime } from 'webextension-polyfill-ts';
import { IMasterController } from '.';
import { v4 as uuid } from 'uuid';
import store from 'state/store';
import watch from 'redux-watch';

type Message = {
  id: string;
  type: string;
  data: { asset: string; method: string; args: any[] };
};

export const messagesHandler = (
  port: Runtime.Port,
  masterController: IMasterController
) => {
  // const externalConnectionApprovalMap: { [origin: string]: true } = {};

  const fromApp = (url: string = '') => {
    return url.startsWith(`${window.location.origin}/app.html`);
  };
  const fromConfirm = (url: string = '') => {
    return url.startsWith(`${window.location.origin}/confirm.html`);
  };

  const listener = async (message: Message, connection: Runtime.Port) => {
    try {
      const response = await listenerHandler(message, connection);
      if (response) {
        const { id, result } = response;
        console.log('messagesHandler.RESPONSE');
        console.log(JSON.stringify(result, null, 2));
        port.postMessage({ id, data: { result } });
      }
    } catch (e) {
      console.log('messagesHandler.ERROR', e.type, e.message, e.detail);
      console.log(JSON.stringify(e, null, 2));
      port.postMessage({ id: e.type, data: { error: e.detail } });
    }
  };

  const listenerHandler = async (
    message: Message,
    connection: Runtime.Port
  ) => {
    if (browser.runtime.lastError) return Promise.reject('Runtime Last Error');

    const sendError = (error: string) =>
      Promise.reject(new CustomEvent(message.id, { detail: error }));
    // const isFromAuthorizedDapp = masterController.fromAuthorizedDapp(
    //   sender.origin
    // );
    // const dappInfo = isFromAuthorizedDapp
    //   ? masterController.dapps.getDappInfoByURL(sender.origin)
    //   : undefined;
    const isFromApp = fromApp(port.sender?.url);
    const isFromConfirm = fromConfirm(port.sender?.url);
    const walletIsLocked = masterController.wallet.isLocked();

    console.log(
      'messagesHandler.onMessage: ',
      isFromApp,
      isFromConfirm,
      walletIsLocked
    );
    console.log(JSON.stringify(message, null, 2));

    const url = connection.sender?.url;
    const origin = url && new URL(url as string).origin;

    const allowed = origin && masterController.dapp.fetchInfo(origin, true);

    console.log('messagesHandler.onMessage: ' + origin, allowed);

    if (message.type === 'STARGAZER_EVENT_REG') {
      if (message.data && message.data.method) {
        setTimeout(() => {
          port.postMessage({ id: message.id, data: 'HELLO1' });
          setTimeout(() => {
            port.postMessage({ id: message.id, data: 'HELLO2' });
          }, 5000);
        }, 5000);
      }
    }
    else if (message.type === 'ENABLE_REQUEST') {
      if (walletIsLocked) {
        return sendError('Wallet is Locked');
      }

      if (origin && !allowed) {
        const popup = await masterController.createPopup(uuid());
        const w = watch(store.getState, 'dapp');
        store.subscribe(
          w((newState) => {
            port.postMessage({
              id: message.id,
              data: { result: !!newState[origin] },
            });
          })
        );

        browser.windows.onRemoved.addListener((id) => {
          if (id === popup.id) {
            port.postMessage({ id: message.id, data: { result: false } });
            console.log('Connect window is closed');
          }
        });

        return Promise.resolve(null);
      }
      return Promise.resolve({ id: message.id, result: origin && allowed });
    } else if (message.type === 'CAL_REQUEST') {
      const { method, args } = message.data;
      let result: any = undefined;
      if (method === 'wallet.isConnected') {
        result = { connected: !!allowed && !walletIsLocked };
      } else if (method === 'wallet.getAddress') {
        result = masterController.stargazerProvider.getAddress();
      } else if (method === 'wallet.getBalance') {
        result = masterController.stargazerProvider.getBalance();
      } else if (method === 'wallet.signMessage') {
        const windowId = `signMessage${uuid()}`;
        const popup = await masterController.createPopup(windowId);
        masterController.dapp.setSigRequest({
          origin: origin as string,
          address: args[1],
          message: args[0],
        });
        window.addEventListener(
          'sign',
          (ev: any) => {
            if (ev.detail.substring(1) === windowId) {
              result = masterController.stargazerProvider.signMessage(args[0]);
              port.postMessage({ id: message.id, data: { result } });
            }
          },
          {
            once: true,
            passive: true,
          }
        );

        browser.windows.onRemoved.addListener((id) => {
          if (id === popup.id) {
            port.postMessage({ id: message.id, data: { result: false } });
            console.log('SignMessage window is closed');
          }
        });

        return Promise.resolve(null);
      }

      if (result !== undefined) {
        return Promise.resolve({ id: message.id, result });
      }

      return sendError('Unknown request');
    }
    else {
      return Promise.resolve({
        id: message.id,
        result: 'Hi from content script',
      });
    }

    return Promise.resolve(null);
  };

  port.onMessage.addListener(listener);
};