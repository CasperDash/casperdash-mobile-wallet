export const fetchArrayBuffer = (url: string): Promise<ArrayBuffer> => {
  return new Promise((accept) => {
    let req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';

    req.onload = function () {
      let resp = req.response;
      if (resp) {
        accept(resp);
      }
    };

    req.send(null);
  });
};

export const fetchWASM = async (url: string): Promise<Uint8Array> => {
  const wasm = await fetchArrayBuffer(url);

  return new Uint8Array(wasm);
};
