import React from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import Navbar from './navbar.js'
import { useRouter } from 'next/router'
import apiClient from '../publicUtils/apiClient';
import apiRoutes from "../config/apiRoutes";

/**
 * Wraps the header, navbar and child components in a unified layout.
 * 
 * @param {object} staticProps - Properties fetched from the server. Includes appId, redirectUrl, baseUrl. For more info, se page files.
 * @param {object} error - Containing an error message (if present).
 * @param {boolean} isLoggedIn - Indicating whether user is logged in or not.
 * @param {boolean} isHome - Indicating whether the layout is wrapping the home-page
 * @param {object} children - Page compoents (react components)
 * @returns - A react component
 */
export default function Layout({ staticProps, error, isLoggedIn, isHome, children, userdata = false }) {
  /**
   * Here useRef is used to keep track on if the component is unmounted or not, to prevent memory leaks.
   * useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue).
   * The returned object will persist for the full lifetime of the component.
   * https://reactjs.org/docs/hooks-reference.html#useref
   */
  const siteTitle = "Gitlabber"
  const router = useRouter()

  /**
   * Sends the user to GitLab's login page.
   * More info: https://docs.gitlab.com/ee/api/oauth2.html#authorization-code-flow
   */
  const logIn = async () => {
    const state = Math.random().toString(36).substring(2, 15);
    const authURL = `https://gitlab.lnu.se/oauth/authorize?client_id=${staticProps.appId}&redirect_uri=${staticProps.redirectUrl}&response_type=code&state=${state}&scope=read_user+openid+profile+email`
    router.push(authURL)
  }

  /**
   * Let's the user log out from the application by removing cookies.
   * 
   * @returns - Redirect to front-page
   */
  const logOut = async () => {
    const response = await apiClient(staticProps.baseUrl + apiRoutes.LOGOUT).request()
    window.location.replace('/')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Navbar logInAction={logIn} logOutAction={logOut} siteTitle={siteTitle} staticProps={staticProps} userdata={userdata} />
      <p className={styles.mainError}>{error}</p>
      <main className={styles.main}>
        {(isLoggedIn || isHome) && ( <>{children}</> )}
      </main>
    </div>
  )
}