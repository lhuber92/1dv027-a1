import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import React from "react";
import apiClient from '../publicUtils/apiClient';
import apiRoutes from '../config/apiRoutes';
import ActivityTable from '../components/activityTable'

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
 * The /activities page.
 * 
 * @param {object} props - An object with properties from the server-side.
 * 
 * @returns - A react functional component
 */
export default function Activities(props) {
  const componentMounted = React.useRef(true); // Used to check if the component is mounted.
  const [error, setError] = React.useState()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [activityData, setActivityData] = React.useState(false)

  React.useEffect(() => {
    async function fetchMyAPI() {
      const response = await apiClient(props.baseUrl + apiRoutes.COMMITS).request()

      if (componentMounted.current) {
        if (response.error) { return setError(response.error) }
        
        setActivityData(await response.json())
        setIsLoggedIn(true)
      }
    }
    fetchMyAPI()

    // Inspiration found here:
    // https://stackoverflow.com/questions/54954385/react-useeffect-causing-cant-perform-a-react-state-update-on-an-unmounted-comp
    // This code runs when component is unmounted. Cleanup function to prevent memory leak.
    return () => { componentMounted.current = false }
  })

  return (
    <Layout staticProps={props} error={error} isLoggedIn={isLoggedIn}>
      <section className={utilStyles.headingMd}>
        <p>Activities</p>
        {activityData && (<ActivityTable activityData={activityData} />)}
      </section>
    </Layout>
  )
}