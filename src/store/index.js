import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import settings from '../settings'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {

  },
  actions: {
    /**
     * Получить список пользователей
     * @param {string} url 
     * @returns 
     */
    GET_USERS_LIST({ commit }, url) {
      return new Promise((resolve, reject) => {
        Axios({
          method: 'get',
          url: url,
        }).then(response => {
          resolve(response);
        })
          .catch(err => {
            reject(err)
          })
      })
    },
    /**
     * Получить список специализаций 
     * @returns 
     */
    GET_SPECIALITY_LiST({ commit }) {
      return new Promise((resolve, reject) => {
        Axios({
          method: 'get',
          url: settings.apiUrl + `/positions`,
        }).then(response => {
          resolve(response);
        })
          .catch(err => {
            reject(err)
          })
      })
    },
    /**
     * 
     * Получить токен
     * @returns 
     */
    GET_TOKEN({ commit }) {

      return new Promise((resolve, reject) => {
        Axios({
          method: 'get',
          url: settings.apiUrl + `/token`,
        }).then(response => {
          resolve(response);
        })
          .catch(err => {
            reject(err)
          })
      })
    },
    /**
     * Добавить пользователя
     * @param {obj} data 
     * @returns 
     */
    SET_USER({ commit }, data) {
      let formData = new FormData();
      
      let phone = data.phone.replace(/\(|\)\s+/g, '').split('-').join('');


      formData.append("name", data.username);
      formData.append("email", data.mail);
      formData.append("phone", phone);
      formData.append("photo", data.userImage);
      formData.append("position_id", data.speciality);


      return new Promise((resolve, reject) => {
        Axios({
          method: 'post',
          url: settings.apiUrl + '/users',
          headers: {
            'Token': data.token
          },
          data: formData
        }).then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err)
        })
      })


    }
  },
  getters: {
  }
})
