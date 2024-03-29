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

export default function ClientAddFormView() {
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

const registerItem = (itemData) => {

  const response = api.post(url, itemData)
    .then((response) => {

        if(response.data){

          toast.success("ITEM CADASTRADO COM SUCESSO!");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
    })
    .catch((err) => {
      console.log(err);
      toast.error("ERRO AO CADASTRAR ITEM");
    });
};
const { register, handleSubmit } = useForm({
  //resolver: zodResolver(LoginUserSchema),
});
const onFormSubmit = (formData) => {

  if (formData.nome_razao_social === "" || formData.nome_razao_social === " ") {
    toast.error("PREENCHIMENTO OBRIGATÓRIO: NOME / RAZÃO SOCIAL*")
  } else {
    formData.user_id = user_id;
    formData.active = true;
    console.log(formData);
    registerItem(formData);
  }

};
      








  const renderForm = (
    <>
      <Stack spacing={3} style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", alignContent:"center", gap:"15px", flexWrap:"wrap"}}>

      <TextField style={{width:"200px"}} autoComplete="given-name" {...register("createdAt")} name="createdAt" required fullWidth id="createdAt" label="DATA DE CADASTRO" autoFocus value={getDataAtualFormatada()}/>
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="lastEditted" label="ÚLTIMA EDIÇÃO" {...register("lastEditted")} name="lastEditted" autoComplete="family-name" value={getDataAtualFormatada()}/>
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="changeMaker" label="COLABORADOR" {...register("changeMaker")} name="changeMaker" autoComplete="family-name" value={user_name.toUpperCase()}/>
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth label="CPF" type="CPF" id="CPF" inputProps={{ maxLength: 14 }} onInput={(e) => { 
        let value = e.target.value; value = value.replace(/\D/g, ""); // Remove tudo o que não for dígito
          value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca um ponto entre o terceiro e o quarto dígitos
          value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca um ponto entre o terceiro e o quarto dígitos de novo
          value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca um hífen entre o terceiro e o quarto dígitos
          e.target.value = value;
              
          }}
          {...register("cpf")}
      />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth label="CNPJ" type="CNPJ" id="CNPJ" inputProps={{ maxLength: 18 }} onInput={(e) => {
              let value = e.target.value;
              value = value.replace(/\D/g, "");
              value = value.replace(/^(\d{2})(\d)/, "$1.$2");
              value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3"); 
              value = value.replace(/\.(\d{3})(\d)/, ".$1/$2"); 
              value = value.replace(/(\d{4})(\d)/, "$1-$2");
              e.target.value = value;
          }}
          {...register("cnpj")}
      />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("nome_razao_social")} name="nome_razao_social" label="NOME / RAZÃO SOCIAL" type="nome_razao_social" id="nome_razao_social" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("apelido_nome_fantasia")} name="apelido_nome_fantasia" label="APELIDO / NOME FANTASIA" type="apelido_nome_fantasia" id="apelido_nome_fantasia" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("tags")} name="tags" label="TAGS" type="tags" id="tags" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("inscricao_estadual")} name="inscricao_estadual" label="INSCRIÇÃO ESTADUAL" type="text" id="inscricao_estadual" inputProps={{ maxLength: 50 }} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("inscricao_municipal")} name="inscricao_municipal" label="INSCRIÇÃO MUNICIPAL" type="text" id="inscricao_municipal" inputProps={{ maxLength: 8 }} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("cep")} name="cep" label="CEP" type="text" id="cep" inputProps={{ maxLength: 9 }} onInput={(e) => { 
        const cep = e.target.value;
        const regex = /^(\d{5})(\d{3})/;
        e.target.value = cep.replace(regex, "$1-$2");
      }}
/>
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("rua")} name="rua" label="RUA" type="text" id="rua" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("numero")} name="numero" label="Nº" type="text" id="numero" inputProps={{ maxLength: 20 }} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("complemento")} name="complemento" label="COMPLEMENTO" type="text" id="complemento" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("bairro")} name="bairro" label="BAIRRO" type="text" id="bairro" inputProps={{ maxLength: 40 }}onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("cidade")} name="cidade" label="CIDADE" type="text" id="cidade" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("estado")} name="estado" label="ESTADO" type="text" id="estado" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("telefone")} name="telefone" label="TELEFONE" type="text" id="telefone" inputProps={{ maxLength: 40 }} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("celular")} name="celular" label="CELULAR" type="text" id="celular" inputProps={{ maxLength: 40 }} />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("email")} name="email" label="E-MAIL" type="text" id="celular" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("site")} name="site" label="SITE" type="text" id="site" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
      <TextField style={{width:"630px", marginTop:"0"}} required fullWidth {...register("descricao")} name="descricao" label="DESCRIÇÃO" type="text" id="descricao" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>



      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
          <Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, mr: 3 }}
                >
                  CADASTRAR
                </Button>
                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "brown" }}
                  onClick={()=>{window.location.reload()}}
                >
                  CANCELAR
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
          <Typography variant="h4">CADASTRAR CLIENTE</Typography>


          <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate sx={{ mt: 1 }}>
          {renderForm}
          </Box>

        </Card>
      </Stack>

    </Box>
  );
}
