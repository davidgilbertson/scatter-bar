const API_URL = 'https://us-central1-velantrix.cloudfunctions.net/api';

const fetchJson = async (url, opts = {}) => fetch(url, {
  headers: {
    ...opts.headers,
    'Content-Type': 'application/json',
  },
  ...opts,
  body: opts.body ? JSON.stringify(opts.body) : undefined,
}).then(res => res.json());

export const create = async body =>fetchJson(API_URL, {
  method: 'POST',
  body,
});

export const read = async id => fetchJson(`${API_URL}/${id}`);

export const update = async (id, body) => fetchJson(`${API_URL}/${id}`, {
  method: 'PUT',
  body,
});
