import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // await originalAuthLogics(to, next)

  // check user login info
  const userInfo = store.getters.user
  // console.log('store user', store.getters.user);
  const isLogin = !!(userInfo && userInfo.loginId)
  // console.log('userInfo:', userInfo)
  // console.log('isLogin:', isLogin)

  const needAuth = to.meta.auth

  if (!needAuth) {
    if (to.path !== '/login') {
      return next()
    }

    // targeting login page
    if (!isLogin) {
      return next()
    }

    // logined
    next({ path: '/' })
    NProgress.done()
  } else {
    if (isLogin) {
      return next()
    }

    // not logined: validate token
    try {
      // get user info
      await store.dispatch('user/getInfo')
      next()
    } catch (error) {
      // remove token and go to login page to re-login
      await store.dispatch('user/resetToken')
      Message.error(error || '登录信息已过期')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

/**
 * determine whether the user has logged in
 */
// async function originalAuthLogics(to, next) {
//   const hasToken = getToken()
//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/
//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// }

