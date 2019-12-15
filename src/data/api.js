const API_URL = 'https://us-central1-velantrix.cloudfunctions.net/api';

const fetchJson = async (url, opts = {}) => fetch(url, {
  method: opts.method,
  headers: {'Content-Type': 'application/json'},
  body: opts.body && JSON.stringify(opts.body),
}).then(res => res.json());

export default {
  create: async body => fetchJson(API_URL, {
    method: 'POST',
    body,
  }),

  read: async id => fetchJson(`${API_URL}/${id}`),

  update: async (id, body) => fetchJson(`${API_URL}/${id}`, {
    method: 'PUT',
    body,
  }),

  delete: async id => fetchJson(`${API_URL}/${id}`, {
    method: 'DELETE',
  }),
};
