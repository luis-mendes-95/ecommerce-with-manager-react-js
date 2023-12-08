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
import { useRouter } from 'src/routes/hooks';
import { bgGradient } from 'src/theme/css';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import api from 'src/services/api';
import { useForm } from 'react-hook-form';
import { Toastify } from 'toastify';
import "react-toastify/dist/ReactToastify.css";

// ----------------------------------------------------------------------

function getDataAtualFormatada() {
  var data = new Date();
  var dia = data.getDate().toString().padStart(2, '0');
  var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
  var ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}

export default function ProductAddFormView() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => {router.push('/dashboard')};


//FORM INPUTS CONFIGURATIONS
let url = "/clientes"


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
      //setUser(null);
      //se der erro setar botao login
    }
  }
}; 
useEffect(() => {
getUser();
}, []);






const [showForm, SetShowForm] = useState("new");

const create = async (createData) => {
  try {
    // Define o cabeçalho da solicitação com o token de autenticação
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.post("/produtos", createData, config);

    if (response.data) {
      toast.success("Produto cadastrado com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
      // Por exemplo, redirecionar para outra página.
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao cadastrar produto");
    // Lida com o erro de forma apropriada, como exibir uma mensagem de erro.
  }
};
const { register, handleSubmit } = useForm({
  //resolver: zodResolver(LoginUserSchema),
});
const onFormSubmit = (formData) => {
 
  if(formData.nome === "") {
    return toast.error("Obrigatório preencher: Nome")
  } else if (formData.preco === "") {
   return toast.error("Obrigatório preencher: Preço")
  } else if (formData.categoria === "") {
   return toast.error("Obrigatório preencher: Categoria")
  } else {
    console.log(formData)
    formData.imagens = formData.imagens.split(',');
    formData.createdAt = getDataAtualFormatada();
    formData.lastEditted = getDataAtualFormatada();
    formData.user_id = user_id;
    formData.changeMaker = user_name;
    formData.active = false;
    //console.log(formData);
    create(formData);
  }

};
      








  const renderForm = (
    <>
      <Stack spacing={3} style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", alignContent:"center", gap:"15px", flexWrap:"wrap"}}>

      <TextField style={{width:"150px"}} autoComplete="given-name" {...register("createdAt")} name="createdAt" required fullWidth id="createdAt" label="Data de cadastro" autoFocus value={getDataAtualFormatada()}/>
      <TextField style={{width:"150px", marginTop:"0"}} required fullWidth id="lastEditted" label="Última Edição" {...register("lastEditted")} name="lastEditted" autoComplete="family-name" value={getDataAtualFormatada()}/>
      <TextField style={{width:"150px", marginTop:"0"}} required fullWidth id="changeMaker" label="Colaborador" {...register("changeMaker")} name="changeMaker" autoComplete="family-name" value={user_name}/>
      <TextField style={{width:"100px", marginTop:"0"}} required fullWidth {...register("cod")} name="cod" label="Código" type="cod" id="cod" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth label="Categoria" type="categoria" id="categoria" onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} inputProps={{ maxLength: 18 }}{...register("categoria")}/>
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("marca")} label="Marca" type="marca" id="marca" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("modelo")} label="Modelo" type="modelo" id="modelo"inputProps={{ maxLength: 80 }}onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
      <TextField style={{width:"650px", marginTop:"0"}} required fullWidth {...register("nome")} label="Nome" type="nome" id="nome" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
      <TextField style={{width:"650px", marginTop:"0"}} required fullWidth {...register("descricao")} label="Descrição" type="descricao" id="descricao" inputProps={{ maxLength: 8000 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
      <TextField style={{width:"300px", marginTop:"0"}} required fullWidth {...register("imagem_principal")} label="Imagem de Capa" type="imagem_principal" id="imagem_principal" />
      <TextField style={{width:"300px", marginTop:"0"}} required fullWidth {...register("imagens")} label="Imagens (por , )" type="imagens" id="imagens" />
      <TextField style={{width:"300px", marginTop:"0"}} required fullWidth {...register("custo")} label="Custo" type="custo" id="custo" inputProps={{ maxLength: 80 }} />
      <TextField style={{width:"300px", marginTop:"0"}} required fullWidth {...register("preco")} label="Preço" type="preco" id="preco" inputProps={{ maxLength: 20 }} />

























      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
          <Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, mr: 3 }}
                >
                  Cadastrar
                </Button>
                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "brown" }}
                  onClick={()=>{window.location.reload()}}
                >
                  Cancelar
                </Button>
            </Box>
      </Stack>



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


      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card sx={{p: 5,width: 1,maxWidth: 820,}}        >
        <Button
              variant="contained"
              sx={{ mt: 3, mb: 2, mr: 3, bgcolor:"brown"}}
              onClick={()=>{window.location.reload()}}
            >
              Voltar
            </Button>
          <Typography variant="h4">Cadastrar Produto</Typography>


          <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate sx={{ mt: 1 }}>
          {renderForm}
          </Box>

        </Card>
      </Stack>

    </Box>
  );
}
