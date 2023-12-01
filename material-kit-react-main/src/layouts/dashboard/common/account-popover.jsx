/* eslint-disable */
import { useState, useEffect  } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import api from 'src/services/api';
import { useRouter } from 'src/routes/hooks';


// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  // {
  //  label: 'Meu Painel',
  //  icon: 'eva:home-fill',
  // },
];

const userProps = {
  profilePic: "https://cdn-icons-png.flaticon.com/512/10593/10593542.png",
  displayName: "Jurácio",
  email: "holland@jupiter.com"
}


const user_id = localStorage.getItem('user_id');
const token = localStorage.getItem('token');

// ----------------------------------------------------------------------

export default function AccountPopover() {


  const [open, setOpen] = useState(null);
  const [user, setUser] = useState(null);

  const router = useRouter();

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
        // se der erro setar botao logout
        }
      } catch (err) {
        setUser(null);
        // se der erro setar botao login
      }
    }
  }; 

  useEffect(() => {
  getUser();
}, []);


  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ width: 40, height: 40, background: (theme) => alpha(theme.palette.grey[500], 0.08), ...(open && { background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,}),}}>
        <Avatar
          src={userProps.profilePic}
          alt={userProps.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {userProps.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {userProps.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userProps.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />


        {
          user &&
            <MenuItem
            disableRipple
            disableTouchRipple
            onClick={handleClose}
            sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
          >
            Logout
          </MenuItem>
        }

        {
          !user &&
            <MenuItem
            disableRipple
            disableTouchRipple
            onClick={()=>{
              handleClose();
              router.push("/login")
            }}
            sx={{ typography: 'body2', color: 'green', py: 1.5 }}
          >
            Login
          </MenuItem>
        }




      </Popover>
    </>
  );
}
