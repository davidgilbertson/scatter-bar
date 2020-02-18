// const API_URL = 'http://localhost:5001/velantrix/us-central1/api';
const API_URL = 'https://us-central1-velantrix.cloudfunctions.net/api';

/**
 * @typedef {{[error]: string, [id]: string}} CreateResponse
 * @typedef {{[error]: string, [data]: object}} ReadResponse
 * @typedef {{[error]: string, [success]: string}} UpdateResponse
 */

const fetchJson = (url, opts = {}) => fetch(url, {
  method: opts.method,
  headers: {'Content-Type': 'application/json'},
  body: opts.body && JSON.stringify(opts.body),
}).then(res => res.json());

export default {
  /**
   * @param {object} body
   * @return {Promise<CreateResponse>}
   */
  create: body => fetchJson(API_URL, {
    method: 'POST',
    body,
  }),

  /**
   * @param {string} id
   * @return {Promise<ReadResponse>}
   */
  read: id => fetchJson(`${API_URL}/${id}`),

  /**
   * @param {string} id
   * @param {object} body
   * @return {Promise<UpdateResponse>}
   */
  update: (id, body) => fetchJson(`${API_URL}/${id}`, {
    method: 'PUT',
    body,
  }),
};
