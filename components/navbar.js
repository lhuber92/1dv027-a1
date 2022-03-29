import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link'
import colors from '../config/colors';
import apiClient from '../publicUtils/apiClient';
import apiRoutes from '../config/apiRoutes';

const pages = [
  { name: 'home', link: '/' }, 
  { name: 'profile', link: '/profile' }, 
  { name: 'activities', link: '/activities' }
];

/**
 * The top navbar
 * 
 * @param {function} logInAction - A passed login function
 * @param {function} logOutAction - A passed logout function
 * @param {string} imagePath - An url of where to load profile image
 * @param {boolean} isLoaded - Indicates whether the parent component (layout) is loaded or not
 * @param {string} siteTitle - The title of the page
 * @returns - A react component
 */
const Navbar = ({logInAction, logOutAction, siteTitle, staticProps, userdata}) => {
  // Used by materialUI for opening side-bar and the menu of the user-profile photo
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [imagePath, setImagePath] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    async function fetchMyAPI() {
      const response = await apiClient(staticProps.baseUrl + apiRoutes.USERDATA).request()

      if (componentMounted.current) {
        if (response.error) {  setImagePath(false); setIsLoaded(true); return }
        
        console.log('setting ...')
        const userdata = await response.json()
        setImagePath(userdata.imagePath)
        setIsLoaded(true);
      }
    }
    if (!userdata) {
      fetchMyAPI()
    } else {setImagePath(userdata.imagePath)
      setIsLoaded(true);
    }

    return () => { componentMounted.current = false }
  })

  /**
   * Activates the passed logInAction
   */
  const handleLogIn = () => {
    logInAction()
  };

  /**
   * Activates the passed logOutAction
   */
  const handleLogOut = () => {
    logOutAction()
  };

  /**
   * Opens the navmenu
   * 
   * @param {object} event - The open navbar event
   */
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  /**
   * Closes the nav menu
   */
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  /**
   * Opens the usermenu
   *
   * @param {object} event - The open usermenu event
   */
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  /**
   * Closes the usermenu
   */
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Title and links (Desktop) */}
          {/* Title (Desktop) */}
          <Link href={'/'} key={'home-desktop'} passHref>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={[
                { mr: 2, display: { xs: 'none', md: 'flex' } }, 
                { '&:hover': { cursor: 'pointer' } },
              ]}
            >
              {siteTitle}
            </Typography>
          </Link>

          {/* Links (Desktop) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page.name + '-desktop'} href={page.link} passHref>
                <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>

          {/* Sidebar and title (Mobile) */}
          {/* Sidebar (mobile) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <Link href={page.link} key={page.name + '-mobile'} passHref>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">
                      {page.name}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>

          {/* Title (mobile) */}
          <Link href={'/'} key={'home-mobile'} passHref>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={[
                { flexGrow: 1, display: { xs: 'flex', md: 'none' } }, 
                { '&:hover': { cursor: 'pointer' } },
              ]}
            >
              {siteTitle}
            </Typography>
          </Link>

          {/* Circle with profile photo and settings (both desktop and mobile) */}
          <Box sx={{ flexGrow: 0, width: '40px' }}>
            {imagePath && isLoaded && (
              <>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="profile" src={imagePath} />
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem key={"logout"} onClick={() => { handleCloseUserMenu(), handleLogOut() }}>
                    <Typography textAlign="center">Log Out</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {!imagePath && isLoaded && (
              <Button
              variant="outlined"
              sx={[
                { 
                  my: 2, 
                  color: 'white', 
                  display: 'block', 
                  borderColor: 'white' 
                },
                {
                  '&:hover': {
                    backgroundColor: 'white',
                    color: colors.primary
                  },
                },
              ]}
              onClick={() => handleLogIn()}>
                Log In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
