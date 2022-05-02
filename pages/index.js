import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import React from "react";
import apiClient from '../publicUtils/apiClient';
import messages from '../config/messages'
import apiRoutes from '../config/apiRoutes';
import { useRouter } from 'next/router'

/*
  "Currently there is no way to globally hydrate data for an entire application,
  other than using getInitialProps in _app.js which unfortunately then disables
  automatic static optimization"
  https://github.com/vercel/next.js/discussions/16684

  "getStaticProps only runs on the server-side. It will never run on the client-side.
  It won’t even be included in the JS bundle for the browser.
  That means you can write code such as direct database queries without them
  being sent to browsers."
  https://nextjs.org/learn/basics/data-fetching/getstaticprops-details
*/
/**
 * Gets properties from the server-side.
 * 
 * @returns - An object with properties from the server-side.
 */
export async function getStaticProps() {
  return {
    props: {
      appId: process.env.APP_ID,
      redirectUrl: process.env.REDIRECT_URL,
      baseUrl: process.env.BASE_URL
    }
  }
}

/**
 * The home page.
 * 
 * @param {object} props - An object with properties from the server-side.
 * 
 * @returns - A react functional component
 */
export default function Home(props) {
  const componentMounted = React.useRef(true); // Used to check if the component is mounted.
  const [error, setError] = React.useState()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    async function fetchMyAPI() {
      const response = await apiClient(props.baseUrl + apiRoutes.COMMITS).request()

      if (componentMounted.current) {
        if (response.error) { 
          if (response.error !== messages.LOGIN_MESSAGE) { // Don't show login-error on home-page
            setError(response.error);
          }
          return
        }
        setIsLoggedIn(true)
      }
    }
  
    if (router.query?.rejected) {
      setError(messages.REJECTED_MESSAGE)
    } else {
      fetchMyAPI()
    }

    // Inspiration found here:
    // https://stackoverflow.com/questions/54954385/react-useeffect-causing-cant-perform-a-react-state-update-on-an-unmounted-comp
    // This code runs when component is unmounted. Cleanup function to prevent memory leak.
    return () => { componentMounted.current = false }
  }, [router.query.rejected, props.baseUrl])

  return (
    <Layout staticProps={props} error={error} isLoggedIn={isLoggedIn} isHome={true}>
      <section className={utilStyles.headingMd}>Home</section>
      <p>Welcome to Gitlabber! Please use the menu above to navigate :)</p>
    </Layout>
  )
}