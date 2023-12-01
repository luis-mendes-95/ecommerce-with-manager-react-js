/* eslint-disable */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';


import { NAV, HEADER } from './config-layout';  
import AccountPopover from './common/account-popover';
import api from 'src/services/api';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Searchbar from './common/searchbar';

// import LanguagePopover from './common/language-popover' 


// const user_name = localStorage.getItem('user_name');
const user_id = localStorage.getItem('user_id');
const token = localStorage.getItem('token');



// ----------------------------------------------------------------------
export default function Header({ onOpenNav }) {

  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');

  const [user, setUser] = useState(null);

  const getUser = async () => {
    if (!user_id){
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



  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="mdi-light:home" />
        </IconButton>
      )}

      <Searchbar />

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        <AccountPopover />
      </Stack>
    </>
  );




  return (

    <AppBar sx={{boxShadow: 'none',height: HEADER.H_MOBILE,zIndex: theme.zIndex.appBar + 1,...bgBlur({color: theme.palette.background.default,}),transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,}),...(lgUp && {width: `calc(100% - ${NAV.WIDTH + 1}px)`,height: HEADER.H_DESKTOP,}),}}>




      <Toolbar sx={{ height: 1, px: { lg: 5 }, }} >
        {renderContent}
      </Toolbar>
      


    </AppBar>
  );
}


// ----------------------------------------------------------------------
Header.propTypes = {
  onOpenNav: PropTypes.func,
};
