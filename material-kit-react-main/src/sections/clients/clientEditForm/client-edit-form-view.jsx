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

export default function ClientEditFormView(client) {
  const theme = useTheme();
  const router = useRouter();




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










//POST REQUEST
const registerItem = (itemData) => {

  const response = api.post(url, itemData)
    .then((response) => {

        if(response.data){

          toast.success("Item cadastrado com sucesso!");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
    })
    .catch((err) => {
      console.log(err);
      toast.error("Erro ao cadastrar item");
    });
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

    const response = await api.patch(`/clientes/${client.item.id}`, createData, config);

    if (response.data) {
      toast.success("Cliente editado com sucesso!");
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

    const response = await api.patch(`/clientes/${client.item.id}`, body, config);

    if (response.data) {
      toast.success("Cliente foi desativado!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
      // Por exemplo, redirecionar para outra página.
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao desativar cliente");
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

    const response = await api.patch(`/clientes/${client.item.id}`, body, config);

    if (response.data) {
      toast.success("Cliente foi reativado!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
      // Por exemplo, redirecionar para outra página.
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao reativar cliente");
    // Lida com o erro de forma apropriada, como exibir uma mensagem de erro.
  }
};





//FORM SUBMIT
const onFormSubmit = (formData) => {

  if (formData.createdAt === "" || formData.createdAt === undefined) { formData.createdAt = client.item.createdAt;  } 
  if (formData.descricao === "" || formData.descricao === undefined) { formData.descricao = client.item.descricao;  }  
  if (formData.lastEditted === "" || formData.lastEditted === undefined) { formData.lastEditted = client.item.lastEditted;  } 
  if (formData.changeMaker === "" || formData.changeMaker === undefined) { formData.changeMaker = client.item.changeMaker;  } 
  if (formData.cpf === "" || formData.cpf === undefined) {formData.cpf = client.item.cpf }  
  if (formData.cnpj === "" || formData.cnpj === undefined) {formData.cnpj = client.item.cnpj}  
  if (formData.nome_razao_social === "" || formData.nome_razao_social === undefined) { formData.nome_razao_social = client.item.nome_razao_social; }
  if (formData.apelido_nome_fantasia === "" || formData.apelido_nome_fantasia === undefined) {formData.apelido_nome_fantasia = client.item.apelido_nome_fantasia;  }  
  if (formData.tags.length === 0) {formData.tags = client.item.tags;}  
  if (formData.inscricao_estadual === "" || formData.inscricao_estadual === undefined) {formData.inscricao_estadual = client.item.inscricao_estadual; } 
  if (formData.inscricao_municipal === "" || formData.inscricao_municipal === undefined) {formData.inscricao_municipal = client.item.inscricao_municipal;  } 
  if (formData.cep === "" || formData.cep === undefined) { formData.cep = client.item.cep;}  
  if (formData.rua === "" || formData.rua === undefined) { formData.rua = client.item.rua;}  
  if (formData.numero === "" || formData.numero === undefined) { formData.numero = client.item.numero;}  
  if (formData.complemento === "" || formData.complemento === undefined) { formData.complemento = client.item.complemento;}  
  if (formData.bairro === "" || formData.bairro === undefined) { formData.bairro = client.bairro;}  
  if (formData.cidade === "" || formData.cidade === undefined) { formData.cidade = client.cidade;}  
  if (formData.estado === "" || formData.estado === undefined) { formData.estado = client.estado;}  
  if (formData.telefone === "" || formData.telefone === undefined) { formData.telefone = client.telefone;}  
  if (formData.celular === "" || formData.celular === undefined) { formData.celular = client.celular;}  
  if (formData.email === "" || formData.email === undefined) { formData.email = client.email;}  
  if (formData.site === "" || formData.site === undefined) { formData.site = client.site;}  
  if (formData.active === undefined) {      formData.active = client.active;  }  
  if (formData.descricao === "" || formData.descricao === undefined) { formData.descricao = client.descricao;}  
  if (formData.user_id === "" || formData.user_id === undefined) { formData.user_id = user_id; }    
  if (formData.active === "" || formData.active === undefined) { formData.active = true; }       
  console.log(formData)
  edit(formData);

 }
      







//FORM INPUTS, SELECTS AND BUTTONS
  const renderForm = (
    <>
      <Stack spacing={3} style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", alignContent:"center", gap:"15px", flexWrap:"wrap"}}>

      <TextField style={{width:"150px"}} autoComplete="given-name" {...register("createdAt")} name="createdAt" required fullWidth id="createdAt" label="Data de cadastro" autoFocus value={getDataAtualFormatada()}/>
      <TextField style={{width:"150px", marginTop:"0"}} required fullWidth id="lastEditted" label="Última Edição" {...register("lastEditted")} name="lastEditted" autoComplete="family-name" value={getDataAtualFormatada()}/>
      <TextField style={{width:"150px", marginTop:"0"}} required fullWidth id="changeMaker" label="Colaborador" {...register("changeMaker")} name="changeMaker" autoComplete="family-name" value={user_name}/>
      <TextField style={{width:"150px", marginTop:"0"}} required fullWidth label="CPF" type="CPF" id="CPF" inputProps={{ maxLength: 14 }} defaultValue={client.item.cpf} onInput={(e) => { 
        let value = e.target.value; value = value.replace(/\D/g, ""); // Remove tudo o que não for dígito
          value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca um ponto entre o terceiro e o quarto dígitos
          value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca um ponto entre o terceiro e o quarto dígitos de novo
          value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca um hífen entre o terceiro e o quarto dígitos
          e.target.value = value;
              
          }}
          {...register("cpf")}
      />
      <TextField style={{width:"200px", marginTop:"0"}} required fullWidth label="CNPJ" type="CNPJ" id="CNPJ" defaultValue={client.item.cnpj} inputProps={{ maxLength: 18 }} onInput={(e) => {
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
      <TextField style={{width:"300px", marginTop:"0"}} required fullWidth {...register("nome_razao_social")} defaultValue={client.item.nome_razao_social} name="nome_razao_social" label="Nome / Razão Social" type="nome_razao_social" id="nome_razao_social" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
      <TextField style={{width:"300px", marginTop:"0"}} required fullWidth {...register("apelido_nome_fantasia")} defaultValue={client.item.apelido_nome_fantasia} name="apelido_nome_fantasia" label="Apelido / Nome Fantasia" type="apelido_nome_fantasia" id="apelido_nome_fantasia" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
      <TextField style={{width:"300px", marginTop:"0"}} required fullWidth {...register("tags")} defaultValue={client.item.tags} name="tags" label="Tags (separe por vírgulas)" type="tags" id="tags" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
      <TextField style={{width:"150px", marginTop:"0"}} required fullWidth {...register("inscricao_estadual")}  defaultValue={client.item.inscricao_estadual} name="inscricao_estadual" label="Inscrição Estadual" type="text" id="inscricao_estadual" inputProps={{ maxLength: 50 }} />
      <TextField style={{width:"150px", marginTop:"0"}} required fullWidth {...register("inscricao_municipal")}  defaultValue={client.item.inscricao_municipal} name="inscricao_municipal" label="Inscrição Municipal" type="text" id="inscricao_municipal" inputProps={{ maxLength: 8 }} />
      <TextField style={{width:"130px", marginTop:"0"}} required fullWidth {...register("cep")}  defaultValue={client.item.cep} name="cep" label="CEP" type="text" id="cep" inputProps={{ maxLength: 20 }} />
      <TextField style={{width:"300px", marginTop:"0"}} required fullWidth {...register("rua")}   defaultValue={client.item.rua}name="rua" label="Rua" type="text" id="rua" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
      <TextField style={{width:"130px", marginTop:"0"}} required fullWidth {...register("numero")}   defaultValue={client.item.numero}name="numero" label="Nº" type="text" id="numero" inputProps={{ maxLength: 20 }} />
      <TextField style={{width:"300px", marginTop:"0"}} required fullWidth {...register("complemento")}  defaultValue={client.item.complemento} name="complemento" label="Complemento" type="text" id="complemento" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}} />
      <TextField style={{width:"180px", marginTop:"0"}} required fullWidth {...register("bairro")}   defaultValue={client.item.bairro}name="bairro" label="Bairro" type="text" id="bairro" inputProps={{ maxLength: 40 }}onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}} />
      <TextField style={{width:"180px", marginTop:"0"}} required fullWidth {...register("cidade")}  defaultValue={client.item.cidade} name="cidade" label="Cidade" type="text" id="cidade" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
      <TextField style={{width:"80px", marginTop:"0"}} required fullWidth {...register("estado")}   defaultValue={client.item.estado}name="estado" label="Estado" type="text" id="estado" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
      <TextField style={{width:"180px", marginTop:"0"}} required fullWidth {...register("telefone")}  defaultValue={client.item.telefone} name="telefone" label="Telefone" type="text" id="telefone" inputProps={{ maxLength: 40 }} />
      <TextField style={{width:"180px", marginTop:"0"}} required fullWidth {...register("celular")}  defaultValue={client.item.celular} name="celular" label="Celular" type="text" id="celular" inputProps={{ maxLength: 40 }} />
      <TextField style={{width:"300px", marginTop:"0"}} required fullWidth {...register("email")}   defaultValue={client.item.email}name="email" label="E-mail" type="text" id="celular" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
      <TextField style={{width:"300px", marginTop:"0"}} required fullWidth {...register("site")}   defaultValue={client.item.site} name="site" label="Site" type="text" id="site" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
      <TextField style={{width:"700px", marginTop:"0"}} required fullWidth {...register("descricao")}  defaultValue={client.item.descricao} name="descricao" label="Descrição" type="text" id="descricao" inputProps={{ maxLength: 40 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>



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
                  Voltar
                </Button>
{
  client.item.active ? (
    <Button
    variant="contained"
    sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "black" }}
    onClick={deactivate}
  >
    Inativar
  </Button>
  ):
  (
    <Button
    variant="contained"
    sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "black" }}
    onClick={activate}
  >
    Reativar
  </Button>
  )
}
            </Box>
      </Stack>



    </>
  );




//USE EFFECT CALL FUNCTIONS
  useEffect(() => {
    getUser();
    console.log(client)
    }, []);




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
          <Typography variant="h4">Cliente</Typography>


          <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate sx={{ mt: 1 }}>
          {renderForm}
          </Box>

        </Card>
      </Stack>

    </Box>
  );
}
