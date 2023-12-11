/* eslint-disable */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';
import api from 'src/services/api';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {

      /** GET USER BY REQUEST IN BACKEND AND TAKES TOKEN FROM LOCALSTORAGE*/
      const user_id = localStorage.getItem('tejas.app.user_id');
      const token = localStorage.getItem('tejas.app.token');
      const user_name = localStorage.getItem('tejas.app.user_name');
      const [user, setUser] = useState(null);
      const getUser = async () => {
        if (user_id){
          try {
            const response = await api.get(`/users/${user_id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if(response.data){
                setUser(response.data);
            //se der erro setar botao logout
            }
          } catch (err) {
            setUser(null);
            //se der erro setar botao login
          }
        }
      }; 
      useEffect(() => {
      getUser();
      }, []);
      /** */


  const pathname = usePathname();
  const upLg = useResponsive('up', 'lg');

  const userProps = {
    profilePic: "https://cdn-icons-png.flaticon.com/512/10593/10593542.png",
    displayName: user?.apelido_nome_fantasia,
    email: "holland@jupiter.com",
    userType: user?.tags.includes("Empreendedor") ? "Empreendedor" : user?.tags.includes("Colaborador") ? "Colaborador" : user?.tags.includes("Administrador") ? "Admin" : "Cliente"
  }

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  const renderAccount = (
    <Box sx={{my: 3,mx: 2.5,py: 2,px: 2.5,display: 'flex',borderRadius: 1.5,alignItems: 'center',bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),  cursor:"pointer"}}>
      
      <Avatar src={userProps.profilePic} alt="photoURL" />

      <Box sx={{ ml: 2, }} >
        {
          user ?
(          <>
            <Typography variant="subtitle2">{user?.apelido_nome_fantasia}</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {userProps.userType}
            </Typography>
            </>
            ) 
            :
            (
            <>
              <Typography variant="subtitle2" >Cadastre-se</Typography>
            </>
    )
        }

      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {
        user ? (
          navConfig.loggedIn.map((item) => (
            <NavItem key={item.title} item={item} />
          ))
        ):
        (
          navConfig.unsigned.map((item) => (
            <NavItem key={item.title} item={item} />
          ))
        )
}
    </Stack>
  );

  const renderUpgrade = (
    <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
      <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
        <Box
          component="img"
          src="/assets/illustrations/illustration_avatar.png"
          sx={{ width: 100, position: 'absolute', top: -50 }}
        />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Get more?</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            From only $69
          </Typography>
        </Box>

        <Button
          href="https://material-ui.com/store/items/minimal-dashboard/"
          target="_blank"
          variant="contained"
          color="inherit"
        >
          Upgrade to Pro
        </Button>
      </Stack>
    </Box>
  );

  const renderContent = (
    <Scrollbar sx={{height: 1,'& .simplebar-content': {height: 1,display: 'flex',flexDirection: 'column',},}}>
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />


    </Scrollbar>
  );

  return (
    <Box sx={{flexShrink: { lg: 0 },width: { lg: NAV.WIDTH },}}>

      
      {upLg ? (
        <Box sx={{height: 1,position: 'fixed',width: NAV.WIDTH,borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,}}>
          {renderContent}
        </Box>
      ) : (
        <Drawer open={openNav} onClose={onCloseNav} PaperProps={{ sx: { width: NAV.WIDTH, }, }} >
          {renderContent}
        </Drawer>
      )}


    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
