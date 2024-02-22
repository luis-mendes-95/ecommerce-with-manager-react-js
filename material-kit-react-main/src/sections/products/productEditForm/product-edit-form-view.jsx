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
import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select } from '@mui/material';

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


  const [showCategorias, setShowCategorias] = useState(false);
  const [showModelos, setShowModelos] = useState(false);
  const [showMarcas, setShowMarcas] = useState(false);
  const [addCategoria, setAddCategoria] = useState(false);
  const [addMarca, setAddMarca] = useState(false);
  const [addModelo, setAddModelo] = useState(false);
  const [addingMarca, setAddingMarca] = useState("");
  const [addingModelo, setAddingModelo] = useState("");
  const [addingCategoria, setAddingCategoria] = useState("");
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");

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


const createCategoria = async (categoriaNome) => {

  let createData = {
    createdAt: getDataAtualFormatada(),
    lastEditted: getDataAtualFormatada(),
    changeMaker: user_name,

    nome: addingCategoria,

    user_id: user_id
  }



  try {

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.post("/categoria", createData, config);

    if (response.status === 201) {
      toast.success();
      toast.success("Categoria criada!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });

      getUser();  
      setAddingCategoria("");
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao cadastrar categoria");
  }
};

const createMarca = async (marcaNome) => {

  let createData = {
    createdAt: getDataAtualFormatada(),
    lastEditted: getDataAtualFormatada(),
    changeMaker: user_name,

    nome: addingMarca,

    user_id: user_id
  }



  try {

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.post("/marca", createData, config);

    if (response.status === 201) {
      toast.success();
      toast.success("Marca criada!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });

      getUser();  
      setAddingMarca("");
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao cadastrar marca");
  }
};

const createModelo = async (modeloNome) => {

  let createData = {
    createdAt: getDataAtualFormatada(),
    lastEditted: getDataAtualFormatada(),
    changeMaker: user_name,

    nome: addingModelo,

    user_id: user_id
  }

  console.log(createData)

  try {

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.post("/modelo", createData, config);

    console.log(response.status)

    if (response.status === 201) {
      toast.success();
      toast.success("Modelo criado!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });

      getUser();  
      //setAddingModelo("");
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao cadastrar modelo");
  }
};

const deleteCategoria = async (id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.delete(`categoria/${id}`, config);


    if (response.status === 200) {
      toast.success("Categoria deletada!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });

      setTimeout(() => {
        getUser();
      }, 1500);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao deletar categoria!", {
      position: "bottom-right", 
      autoClose: 3000, 
      hideProgressBar: false, 
      closeOnClick: true, 
      pauseOnHover: true, 
      draggable: true, 
      progress: undefined, 
    });

  }
};

const deleteMarca = async (id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.delete(`marca/${id}`, config);


    if (response.status === 200) {
      toast.success("Marca deletada!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });

      setTimeout(() => {
        getUser();
      }, 1500);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao deletar marca!", {
      position: "bottom-right", 
      autoClose: 3000, 
      hideProgressBar: false, 
      closeOnClick: true, 
      pauseOnHover: true, 
      draggable: true, 
      progress: undefined, 
    });

  }
};

const deleteModelo = async (id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.delete(`modelo/${id}`, config);


    if (response.status === 200) {
      toast.success("Modelo deletado!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });

      setTimeout(() => {
        getUser();
      }, 1500);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao deletar modelo!", {
      position: "bottom-right", 
      autoClose: 3000, 
      hideProgressBar: false, 
      closeOnClick: true, 
      pauseOnHover: true, 
      draggable: true, 
      progress: undefined, 
    });

  }
};

const deleteProduct = async (id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.delete(`produtos/${id}`, config);


    if (response.status === 204) {
      toast.success("Produto deletado!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });

      setTimeout(() => {
        //getUser();
        location.reload();
      }, 1500);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao deletar produto!", {
      position: "bottom-right", 
      autoClose: 3000, 
      hideProgressBar: false, 
      closeOnClick: true, 
      pauseOnHover: true, 
      draggable: true, 
      progress: undefined, 
    });

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
      


useEffect(() => {
  getUser();
}, [])


console.log(user)


//FORM INPUTS, SELECTS AND BUTTONS
const renderForm = (
  <>
    <Stack spacing={3} style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", alignContent:"center", gap:"15px", flexWrap:"wrap"}}>

    <TextField style={{width:"200px"}} autoComplete="given-name" {...register("createdAt")} defaultValue={product.product.createdAt} name="createdAt" required fullWidth id="createdAt" label="Data de cadastro" autoFocus/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="lastEditted" defaultValue={product.product.lastEditted} label="Última Edição" {...register("lastEditted")} name="lastEditted" autoComplete="family-name"/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="changeMaker" defaultValue={product.product.changeMaker} label="Colaborador" {...register("changeMaker")} name="changeMaker" autoComplete="family-name" value={user_name}/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("cod")} defaultValue={product.product.cod} name="cod" label="Código" type="cod" id="cod" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }} />
    
        <FormControl style={{minWidth: "200px", margin:"10px 0"}}>
              <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>Categoria</InputLabel>
              <Select
                {...register("categoriaId")}
                style={{minWidth: "200px"}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={product.product.categoriaId}
              >
                {
                  user?.categorias.map((categoria)=>{


                    return(
                      <MenuItem key={categoria.id} value={categoria.id} >{categoria.nome}</MenuItem>
                    )
                  })
                }
              </Select>
        </FormControl>

        <FormControl style={{minWidth: "200px", margin:"10px 0"}}>
              <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>Modelo</InputLabel>
              <Select
                {...register("modeloId")}
                style={{minWidth: "200px"}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={product.product.modeloId}
              >

                {
                  user?.Modelo.map((modelo)=>{
                    console.log(product.product)
                    console.log(modelo.id)
                    return(
                      <MenuItem key={modelo.id} value={modelo.id}>{modelo.nome}</MenuItem>
                    )
                  })
                }
              </Select>
        </FormControl>

        <FormControl style={{minWidth: "200px", margin:"10px 0"}}>
              <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>Marca</InputLabel>
              <Select
                {...register("marcaId")}
                style={{minWidth: "200px"}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={product.product.marcaId}
              >
                {
                  user?.Marca.map((marca)=>{
                    return(
                      <MenuItem key={marca.id} value={marca.id}>{marca.nome}</MenuItem>
                    )
                  })
                }
              </Select>
        </FormControl>
        <TextField style={{width:"415px", marginTop:"0"}} required fullWidth {...register("nome")} defaultValue={product.product.nome} label="Nome" type="nome" id="nome" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
        <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("tamanho")} defaultValue={product.product.tamanho} label="Tamanho" type="Tamanho" id="Tamanho" inputProps={{ maxLength: 80 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase();}}/>
      <TextField style={{width:"415px", marginTop:"0"}} required fullWidth {...register("descricao")} defaultValue={product.product.descricao} label="Descrição" type="descricao" id="descricao" inputProps={{ maxLength: 8000 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
     <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("imagem_principal")} defaultValue={product.product.imagem_principal} label="Imagem de Capa" type="imagem_principal" id="imagem_principal" />
     <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("imagens")} defaultValue={product.product.imagens} label="Imagens (por , )" type="imagens" id="imagens" />
     <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("custo")} defaultValue={product.product.custo} label="Custo" type="custo" id="custo" inputProps={{ maxLength: 80 }} />
     <TextField style={{width:"200px", marginTop:"0"}} required fullWidth {...register("preco")} defaultValue={product.product.preco} label="Preço" type="preco" id="preco" inputProps={{ maxLength: 20 }} />

      <FormControlLabel control={<Checkbox {...register("onStore")} defaultChecked={product.product.onStore} />} label="Mostrar na Loja " />

























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
                sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "orange", color:"black" }}
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
                  sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "brown" }}
                  onClick={()=>{deleteProduct(product.product.id)}}
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
            <Box>
            <Button variant="contained" color="inherit" style={showCategorias ? ({backgroundColor:"lightgray", color:"black"}) : ({backgroundColor:"#00B8D9"})} onClick={()=>{setShowCategorias(!showCategorias);   if(showModelos === true){setShowModelos(false)}; if(showMarcas === true){setShowMarcas(false)};}}>
              Categorias
          </Button>

          <Button variant="contained" color="inherit"  style={showModelos ? ({backgroundColor:"lightgray", color:"black"}) : ({backgroundColor:"#00B8D9"})}  onClick={()=>{setShowModelos(!showModelos);  if(showMarcas === true){setShowMarcas(false)}; if(showCategorias === true){setShowCategorias(false)};}}>
              Modelos
          </Button>

          <Button variant="contained" color="inherit" style={showMarcas ? ({backgroundColor:"lightgray", color:"black"}) : ({backgroundColor:"#00B8D9"})}  onClick={()=>{setShowMarcas(!showMarcas);  if(showModelos === true){setShowModelos(false)}; if(showCategorias === true){setShowCategorias(false)};}}>
              Marcas
          </Button>

          {
          showMarcas && user?.Marca.length > 0 &&  
            <Box style={{backgroundColor:"white", width:"100%", color:"black"}}>

              {
                user?.Marca.map((marca)=>{
                  return (
                    <Box style={{display:"flex", justifyContent:"space-between", alignContent:"center", alignItems:"center", backgroundColor:"lightgray"}}>
                      <p style={{padding:"8px"}}>{marca.nome.toUpperCase()}</p>
                      <Button style={{backgroundColor:"red", color:"white"}} onClick={()=>{deleteMarca(marca.id)}}>X</Button>
                    </Box>
                  )
                })
              }
            </Box>
          }

          {
          showModelos && user?.Modelo.length > 0 &&  
            <Box style={{backgroundColor:"white", width:"100%", color:"black"}}>

              {
                user?.Modelo.map((modelo)=>{
                  console.log(modelo)
                  return (
                    <Box style={{display:"flex", justifyContent:"space-between", alignContent:"center", alignItems:"center", backgroundColor:"lightgray"}}>
                      <p style={{padding:"8px"}}>{modelo.nome.toUpperCase()}</p>
                      <Button style={{backgroundColor:"red", color:"white"}} onClick={()=>{deleteModelo(modelo.id)}}>X</Button>
                    </Box>
                  )
                })
              }
            </Box>
          }

          {
          showCategorias && user?.categorias.length > 0 &&  
            <Box style={{backgroundColor:"white", width:"100%", color:"black"}}>

              {
                user?.categorias.map((categoria)=>{
                  return (
                    <Box style={{display:"flex", justifyContent:"space-between", alignContent:"center", alignItems:"center", backgroundColor:"lightgray"}}>
                      <p style={{padding:"8px"}}>{categoria.nome.toUpperCase()}</p>
                      <Button style={{backgroundColor:"red", color:"white"}} onClick={()=>{deleteCategoria(categoria.id)}}>X</Button>
                    </Box>
                  )
                })
              }
            </Box>
          }

          { 
          showCategorias &&
            <Box style={{backgroundColor:"white", padding:"8px"}}>
              <TextField label="Nome da categoria" onInput={(e)=>{setAddingCategoria(e.target.value.toUpperCase())}} value={addingCategoria}></TextField>
              <Button style={{backgroundColor:"lightblue", padding:"8px", margin:"8px"}} onClick={()=>{createCategoria(addingCategoria);}}>Criar</Button>
            </Box>

          }
          {
          showMarcas &&
            <Box style={{backgroundColor:"white", padding:"8px"}}>
              <TextField label="Nome da marca" onInput={(e)=>{setAddingMarca(e.target.value.toUpperCase())}} value={addingMarca}></TextField>
              <Button style={{backgroundColor:"lightblue", padding:"8px", margin:"8px"}} onClick={()=>{createMarca(addingMarca);}}>Criar</Button>
            </Box>
         }

         { 
        showModelos &&
          <Box style={{backgroundColor:"white", padding:"8px"}}>
            <TextField label="Nome do modelo" onInput={(e)=>{setAddingModelo(e.target.value.toUpperCase());}} value={addingModelo}></TextField>
            <Button style={{backgroundColor:"lightblue", padding:"8px", margin:"8px"}} onClick={()=>{createModelo(addingModelo);}}>Criar</Button>
          </Box>
          }




            </Box>
          <Typography variant="h4">Produto</Typography>


          <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate sx={{ mt: 1 }}>
          {renderForm}
          </Box>

        </Card>
      </Stack>

    </Box>
  );
}
