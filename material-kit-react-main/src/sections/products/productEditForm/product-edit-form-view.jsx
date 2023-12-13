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

// ----------------------------------------------------------------------

function getDataAtualFormatada() {
  var data = new Date();
  var dia = data.getDate().toString().padStart(2, '0');
  var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
  var ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}

export default function ProductEditFormView(product) {
  const theme = useTheme();
  const router = useRouter();


  console.log(product.product)

//FORM INPUTS CONFIGURATIONS
let url = "/produtos"


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





//USE FORM CALLING FUNCTIONS
const { register, handleSubmit } = useForm({
  //resolver: zodResolver(LoginUserSchema),
});



const edit = async (createData) => {
  try {
    // Define o cabeçalho da solicitação com o token de autenticação
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.patch(`/produtos/${product.product.id}`, createData, config);

    if (response.data) {
      toast.success("Produto editado com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
      // Por exemplo, redirecionar para outra página.
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao editar cliente");
    // Lida com o erro de forma apropriada, como exibir uma mensagem de erro.
  }
};
const deactivate = async () => {
  try {
    // Define o cabeçalho da solicitação com o token de autenticação
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let body = {
      "active": false
    }

    const response = await api.patch(`/produtos/${product.product.id}`, body, config);

    if (response.data) {
      toast.success("Produto foi desativado!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
      // Por exemplo, redirecionar para outra página.
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao desativar produto");
    // Lida com o erro de forma apropriada, como exibir uma mensagem de erro.
  }
};
const activate = async () => {
  try {
    // Define o cabeçalho da solicitação com o token de autenticação
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let body = {
      "active": true
    }

    const response = await api.patch(`/produtos/${product.product.id}`, body, config);

    if (response.data) {
      toast.success("Produto foi reativado!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
      // Por exemplo, redirecionar para outra página.
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao reativar produto");
    // Lida com o erro de forma apropriada, como exibir uma mensagem de erro.
  }
};
const deleteItem = async () => {
  console.log("sendo chamado pra deletar")
  console.log(product.product.id);
  try {
    // Define o cabeçalho da solicitação com o token de autenticação
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.delete(`/produtos/${product.product.id}`, config);

    if (response.status === 204) {
      toast.success("Produto foi deletado!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
      // Por exemplo, redirecionar para outra página.
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao deletar produto");
    // Lida com o erro de forma apropriada, como exibir uma mensagem de erro.
  }
};





//FORM SUBMIT
const onFormSubmit = (formData) => {

  if (formData.createdAt === "" || formData.createdAt === undefined) { formData.createdAt = product.product.createdAt; } 
  if (formData.descricao === "" || formData.descricao === undefined) { formData.descricao = product.product.descricao; }  
  if (formData.lastEditted === "" || formData.lastEditted === undefined) { formData.lastEditted = product.product.lastEditted; } 
  if (formData.changeMaker === "" || formData.changeMaker === undefined) { formData.changeMaker = product.product.changeMaker; } 
  if (formData.user_id === "" || formData.user_id === undefined) { formData.user_id = user_id; }   
  if (formData.categoria === "" || formData.categoria === undefined) { formData.categoria = product.product.categoria; }   
  if (formData.cod === "" || formData.cod === undefined) { formData.cod = product.product.cod; }   
  if (formData.custo === "" || formData.custo === undefined) { formData.custo = product.product.custo; }   
  if (formData.descricao === "" || formData.descricao === undefined) { formData.descricao = product.product.descricao; }   
  if (formData.imagem_principal === "" || formData.imagem_principal === undefined) { formData.imagem_principal = product.product.imagem_principal; }   
  formData.imagens = []
  if (formData.marca === "" || formData.marca === undefined) { formData.marca = product.product.marca; }   
  if (formData.modelo === "" || formData.modelo === undefined) { formData.modelo = product.product.modelo; }   
  if (formData.nome === "" || formData.nome === undefined) { formData.nome = product.product.nome; }   
  if (formData.preco === "" || formData.preco === undefined) { formData.preco = product.product.preco; }   

  edit(formData);

 }
      







//FORM INPUTS, SELECTS AND BUTTONS
const renderForm = (
  <>
    <Stack spacing={3} style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", alignContent:"center", gap:"15px", flexWrap:"wrap"}}>

    <TextField style={{width:"200px"}} autoComplete="given-name" {...register("createdAt")} defaultValue={product.product.createdAt} name="createdAt" required fullWidth id="createdAt" label="Data de cadastro" autoFocus/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="lastEditted" defaultValue={product.product.lastEditted} label="Última Edição" {...register("lastEditted")} name="lastEditted" autoComplete="family-name"/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="changeMaker" defaultValue={product.product.changeMaker} label="Colaborador" {...register("changeMaker")} name="changeMaker" autoComplete="family-name" value={user_name}/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("cod")} defaultValue={product.product.cod} name="cod" label="Código" type="cod" id="cod" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("categoria")} label="Categoria"  defaultValue={product.product.categoria} type="categoria" id="categoria" onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} inputProps={{ maxLength: 18 }}/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("marca")} defaultValue={product.product.marca} label="Marca" type="marca" id="marca" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("modelo")} defaultValue={product.product.modelo} label="Modelo" type="modelo" id="modelo"inputProps={{ maxLength: 80 }}onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
    <TextField style={{width:"415px", marginTop:"0"}} required fullWidth {...register("nome")} defaultValue={product.product.nome} label="Nome" type="nome" id="nome" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
    <TextField style={{width:"415px", marginTop:"0"}} required fullWidth {...register("descricao")} defaultValue={product.product.descricao} label="Descrição" type="descricao" id="descricao" inputProps={{ maxLength: 8000 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("imagem_principal")} defaultValue={product.product.imagem_principal} label="Imagem de Capa" type="imagem_principal" id="imagem_principal" />
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("imagens")} defaultValue={product.product.imagens} label="Imagens (por , )" type="imagens" id="imagens" />
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("custo")} defaultValue={product.product.custo} label="Custo" type="custo" id="custo" inputProps={{ maxLength: 80 }} />
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("preco")} defaultValue={product.product.preco} label="Preço" type="preco" id="preco" inputProps={{ maxLength: 20 }} />

























    </Stack>

    <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Box>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, mr: 3 }}
              >
                Salvar
              </Button>
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "brown" }}
                onClick={()=>{window.location.reload()}}
              >
                Cancelar
              </Button>
              {
                product.product.active ?
                (
                  <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "black" }}
                  onClick={deactivate}
                >
                  Inativar
                </Button>
                )
                :
                (
                  <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "green" }}
                  onClick={activate}
                >
                  Reativar
                </Button>
                )
              }
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "red", color: "white" }}
                onClick={deleteItem}
              >
                Deletar
              </Button>
          </Box>
    </Stack>



  </>
);




  //RETURN IN HTML
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
        <Card sx={{p: 5,width: 1,maxWidth: 820,}}      
          >
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2, mr: 3, bgcolor:"brown"}}
              onClick={()=>{window.location.reload()}}
            >
              Voltar
            </Button>
          <Typography variant="h4">Produto</Typography>


          <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate sx={{ mt: 1 }}>
          {renderForm}
          </Box>

        </Card>
      </Stack>

    </Box>
  );
}
