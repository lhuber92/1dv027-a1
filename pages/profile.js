import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import React from "react";
import apiClient from '../publicUtils/apiClient';
import apiRoutes from '../config/apiRoutes';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ProfileTable from '../components/profileTable'
import IconButton from '@mui/material/IconButton';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

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
1
const Input = styled('input')({
  display: 'none',
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

/**
 * The /profile page.
 * 
 * @param {object} props - An object with properties from the server-side.
 * 
 * @returns - A react functional component
 */
export default function Profile(props) {
  const componentMounted = React.useRef(true); // Used to check if the component is mounted.
  const [error, setError] = React.useState()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [userdata, setUserdata] = React.useState(false)

  /**
   * Takes an input file and uploads it to the local storage.
   * 
   * @param {event} - The event triggered when a file is selected in the input 
   * @returns - Window reload
   */
  const uploadToClient = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      const body = new FormData();
      body.append("file", image);    
      
      const response = await apiClient(props.baseUrl + apiRoutes.UPLOAD, { method: "POST", body }).request()
      if (response.error) { return setError(response.error) }
      window.location.reload(false)
    }
  };

  /**
   * Deletes the users profile picture from the local storage
   * 
   * @returns - Window reload
   */
  const deleteLocalImage = async () => {
    const response = await apiClient(props.baseUrl + apiRoutes.DELETE, { method: "POST" }).request()
    if (response.error) { return setError(response.error) }
    window.location.reload(false);
  }

  React.useEffect(() => {
    async function fetchMyAPI() {
      const response = await apiClient(props.baseUrl + apiRoutes.USERDATA).request()

      if (componentMounted.current) {
        if (response.error) { return setError(response.error) }
        
        setUserdata(await response.json())
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
    <Layout staticProps={props} error={error} isLoggedIn={isLoggedIn} userdata={userdata}>
      <section className={utilStyles.headingMd}>
        {userdata && (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={8} className={utilStyles.profileHeader}>
                <Item className={utilStyles.profileLogoInner}>
                  {userdata.name}
                </Item>
              </Grid>
              <Grid item xs={4} className={utilStyles.profileLogo}>
                <Item>
                  <Avatar sx={{ width: 100, height: 100 }} alt="profile" src={userdata.imagePath} />
                  <label htmlFor="icon-button-file">
                    <Input accept="image/*" id="icon-button-file" type="file" onChange={uploadToClient} />
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <UploadIcon />
                    </IconButton>
                  </label>
                  {userdata.hasLocalImage && (
                    <IconButton color="primary" aria-label="delete" size="large" onClick={deleteLocalImage}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                  <p>(max 1 mb)</p>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <ProfileTable userdata={userdata} />
              </Grid>
            </Grid>
          </Box>
        )}
      </section>
    </Layout>
  )
}