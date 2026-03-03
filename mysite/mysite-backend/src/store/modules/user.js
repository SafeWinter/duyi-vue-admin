import { userLogin, getInfo } from '@/api/user'
import { getToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    user: null // newly added
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER: (state, user) => {
    state.user = user
  }
}

const actions = {
  // user login
  login({ commit }, loginParams) {
    return new Promise((resolve, reject) => {
      userLogin(loginParams).then(resp => {
        // console.log(typeof resp, resp);
        if (typeof resp === 'string') {
          // invalid captcha
          reject(JSON.parse(resp).msg) // resp: '{"code":406,"msg":"验证码错误","data":null}'
          return
        }

        if (!resp.data) { // resp: {code: 0, msg: '', data: null}
          // invalid loginId / loginPwd
          reject('用户名或密码错误！')
          return
        }

        // resp: {code: 0, msg: '', data: {id:'xxxx', loginId: 'admin', name: '管理员'}}
        const { data } = resp
        commit('SET_USER', data)
        commit('SET_NAME', data.name)
        commit('SET_TOKEN', getToken()) // Bug: Now, the token has been written into localStorage by response interceptor
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        resolve()
      }).catch(reject)
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        // console.log('data fetched from whoami API:', response)
        const { data } = response

        if (!data) {
          const res = JSON.parse(response)
          return reject('Token 校验失败，请重新登录！' + res.msg)
        }

        const { name } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        resolve(data)
      }).catch(reject)
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

