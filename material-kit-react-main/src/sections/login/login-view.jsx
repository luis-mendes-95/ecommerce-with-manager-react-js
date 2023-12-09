/* eslint-disable */
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { ToastContainer, toast } from "react-toastify";
import { Toastify } from 'toastify';
import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import api from 'src/services/api';
import { useForm } from 'react-hook-form';


// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => {
    router.push('/dashboard');
  };


/** GET USER BY REQUEST IN BACKEND AND TAKES TOKEN FROM LOCALSTORAGE*/
const user_id = localStorage.getItem('tejas.app.user_id');
const token = localStorage.getItem('tejas.app.token');
const user_name = localStorage.getItem('tejas.app.user_name');
// const user_name = localStorage.getItem('user_name');
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
          console.log(response.data)
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
const [showForm, SetShowForm] = useState("new");
const login = (loginData) => {
  const response = api.post("/login", loginData)
    .then((response) => {

        if(response.data){

          localStorage.setItem("tejas.app.token", response.data.token);
          localStorage.setItem("tejas.app.user_id", response.data.user_id);
          localStorage.setItem("tejas.app.user_name", response.data.user_name);

          toast.success("Login efetuado com sucesso! Você será redirecionado em poucos segundos!");

          setTimeout(() => {
            router.push("/");
          }, 1000);
        }
    })
    .catch((err) => {
      console.log(err);
      toast.error("Erro ao efetuar login");
    });
};
const { register, handleSubmit } = useForm({
  //resolver: zodResolver(LoginUserSchema),
});
const onFormSubmit = (formData) => {
  console.log(formData);
  login(formData);
};
      








  const renderForm = (
    <>
      <Stack spacing={3}>

        <TextField name="email" label="E-mail" {...register("email")} />

        <TextField
          {...register("senha")}
          name="senha"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover" style={{cursor:"pointer"}}>
          Esqueci minha senha
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleSubmit}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <ToastContainer />
      <Logo sx={{position: 'fixed',top: { xs: 16, md: 24 },left: { xs: 16, md: 24 },}}/>

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card sx={{p: 5,width: 1,maxWidth: 420,}}        >
          <Typography variant="h4">Efetuar Login</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Não tem uma conta?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Cadastrar-se
            </Link>
          </Typography>



          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OU
            </Typography>
          </Divider>
          <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate sx={{ mt: 1 }}>
          {renderForm}
          </Box>

        </Card>
      </Stack>

    </Box>
  );
}
