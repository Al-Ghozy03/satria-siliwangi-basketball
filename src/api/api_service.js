import axios from "axios";

class ApiService {
  constructor() {
    this.baseUrl = "http://localhost:4000";
    this.headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
  }
  get(endpoint) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}${endpoint}`, { headers: this.headers })
        .then((v) => resolve(v.data))
        .catch((er) => reject(er.response.data));
    });
  }
  post(endpoint, data) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.baseUrl}${endpoint}`, data, { headers: this.headers })
        .then((v) => resolve(v.data))
        .catch((er) => reject(er.response.data));
    });
  }
  put(endpoint, data) {
    return new Promise((resolve, reject) => {
      axios
        .put(`${this.baseUrl}${endpoint}`, data, { headers: this.headers })
        .then((v) => resolve(v.data))
        .catch((er) => reject(er.response.data));
    });
  }
}

export default new ApiService();
