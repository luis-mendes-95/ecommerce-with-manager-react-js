/* eslint-disable */
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import Option from '@mui/joy/Option';
import Button from '@mui/joy/Button';
import { fCurrency } from 'src/utils/format-number';
import Label from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { Select } from '@mui/material';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import api from 'src/services/api';
import { ToastContainer, toast } from "react-toastify";
import { Toastify } from 'toastify';
import "react-toastify/dist/ReactToastify.css";

  /**LOCALSTORAGE DATA TO HAVE PERMISSION */
  const user_id = localStorage.getItem('tejas.app.user_id');
  const token = localStorage.getItem('tejas.app.token');
  const user_name = localStorage.getItem('tejas.app.user_name');



{/**FUNÇÃO QUE RETORNA A DATA ATUAL FORMATADA*/}
function getDataAtualFormatada() {
  var data = new Date();
  var dia = data.getDate().toString().padStart(2, '0');
  var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
  var ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}


export default function ShopProductCard({ product, handleEditProduct, handleGetSale, thisSale, submitType, setSubmitType, thisClient, handleSetClient }) {








  /**STATES FOR THIS COMPONENT */
  const [user, setUser] = React.useState(null);
  const [showCart, setShowCart] = React.useState(false);

  const [showModalVenda, setShowModalVenda] = React.useState(false);
  const [showTypedClientResults, setShowTypedClientResults] = React.useState(false);
  const [filteredClients, setFilteredClients] = React.useState(null);




  /**VARIABLES TO CUSTOM THIS COMPONENT */
  const url = "vendas"
  const urlEdit = url + `/${thisSale?.id}`;
  const urlItemVenda = "itemVendas";




  /**FUNCTIONS FOR REQUESTS */
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
        }
      } catch (err) {
        setUser(null);
      }
    }
  }; 
  const getClient = async (id) => {

      try {
        const response = await api.get(`/clientes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(response.data){
            handleSetClient(response.data);
        }
      } catch (err) {
        handleSetClient(null);
      }

  }; 
  const createVenda = async (createData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.post(url, createData, config);
      if (response.data) {
        toast.success("Adicione produtos no carrinho!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
        setShowModalVenda(false);
        setTimeout(() => {
          setShowCart(true);
          setSubmitType("createItemSale");
          handleGetSale(response.data.id);
          reset();
          getUser();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar venda!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });
      setSubmitType("createItemSale")
    }
  };
  const createItemVenda = async (createData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.post(urlItemVenda, createData, config);
      if (response.data) {
        toast.success("Item adicionado ao carrinho!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
        setTimeout(() => {
          setShowCart(true);
          getUser();
          reset();
          handleGetSale(response.data.venda_id);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar ao carrinho!", {
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
  const deleteVenda = async () => {

    console.log(thisItemId)
    console.log(thisItemId.item)
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await api.delete(urlEdit, config);
        if (response.status === 200) {
          
          toast.success("Venda cancelada com sucesso!");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro ao cancelar venda");
      }
  };


  

  /**AFTER LOAD THIS COMPONENT, RUN THESE CODES */
  React.useEffect(() => {
    getUser();

  }, []); 




  /**FORM CONFIGURATION - USE FORM */
  const { register, handleSubmit, reset, formState: { errors }  } = useForm({
    // resolver: zodResolver(RegisterClientSchema),
  });

  const onFormSubmit = (formData) => {





    if (submitType === "createSale") {

      formData.createdAt = getDataAtualFormatada();
      formData.lastEditted = getDataAtualFormatada();
      formData.changeMaker = user_name;
      formData.active = true;
      formData.user_id = user_id;
      formData.colaborador = user_name;
      formData.client_id = thisClient?.id;


      createVenda(formData);

    } else if (submitType === "createItemSale") {

      formData.description = formData.itemDescription;
      delete formData.itemDescription;
      formData.createdAt = getDataAtualFormatada();
      formData.changeMaker = getDataAtualFormatada();
      formData.lastEditted = getDataAtualFormatada();
      formData.files = formData.files.split();
      formData.venda_id = thisSale.id;
      formData.client_id = thisClient.id;
      formData.produto_id = product.id;


      if (formData.disccount === "") {formData.disccount = "0"};



      createItemVenda(formData);

    }

    

    
  };


  /**FILTER CLIENTS TO SELECT WHILE TYPING */
  const setFilteredClientsByTyping = (string) => {
    if (string === "") { 
      setFilteredClients(null);
    } else {
      const filteredClients = user?.clientes.filter((client) => {
        return client.nome_razao_social.includes(string);
      });
      setFilteredClients(filteredClients);
    }      
  }





  /**PRE RENDER HTML  */
  const renderStatus = (
    <Label
      variant="filled"
      color={(product.active === true  && 'info') || 'error'}
      sx={{zIndex: 9,top: 16,right: 16,position: 'absolute',textTransform: 'uppercase',}}>

      {
      product.active &&
        <span>Em estoque</span>
      }

      {
      product.active === false &&
        <span>Inativo</span>
      }

    </Label>
  );
  const renderImg = (
    <Box
      component="img"
      alt={product.imagem_principal}
      src={product.imagem_principal}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );
  const renderPrice = (
    <Typography variant="subtitle1">
      R{fCurrency(product.preco)}
    </Typography>
  );


  return (
    <Card>
      <ToastContainer/>

      {
        showModalVenda &&
          <div style={{position:"absolute", top:"0", left:"0", zIndex: 999, backgroundColor:"#F9FAFA", width:"100%", height:"100%", padding:"10px"}}>
            <h3>Nova Venda:</h3>

          {
            !thisClient &&
            <TextField fullWidth label="Digitar Cliente" id="client_id" inputProps={{ maxLength: 400 }} onInput={(e) => {e.target.value =  e.target.value.toUpperCase(); setShowTypedClientResults(true); setFilteredClientsByTyping(e.target.value)}} {...register("client_id")} />
          }
          

          {
            showTypedClientResults && !thisClient &&
              filteredClients?.map((client)=>{
                return (
                  <p style={{cursor:"pointer", backgroundColor:"lightgray", padding:"5px", borderRadius:"8px"}} key={client.id} onClick={()=>{getClient(client.id)}}>{client.nome_razao_social}</p>
                )
              })
          }





          {
            thisClient &&
            <div style={{width:"100%", display:"flex", flexWrap:"wrap",  justifyContent:"space-between"}}>
                <label style={{fontWeight:"bold"}}>CLIENTE:</label>    
                <button onClick={()=>{handleSetClient(null)}}>Trocar</button>     
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onFormSubmit)(e); }} style={{display:"flex", flexWrap:"wrap", justifyContent:"space-between", padding:'5px'}}>
                
                <div style={{width:"100%"}}>
                <p style={{ padding:"5px", borderRadius:"8px"}} key={thisClient.id}>{thisClient.nome_razao_social}</p>
                <TextField fullWidth label="Observações" id="description" inputProps={{ maxLength: 400 }} onInput={(e) => {e.target.value =  e.target.value.toUpperCase(); setShowTypedClientResults(true); setFilteredClientsByTyping(e.target.value)}} {...register("description")} />
                </div>
                <button type="submit" style={{backgroundColor:"green",  color:"white", textShadow:"2pt 2pt 5pt black", padding: "10px", border:"none", margin:"5px", borderRadius:"8px", cursor:"pointer"}}>Iniciar Venda</button>    
                {/**AQUI É FEITA A CRIACAO DA VENDA E SETADA PARA RESPONSE.DATA, LIBERANDO OS BOTÕES PARA ADICIONAR CADA ITEM */}
              </form>
            </div>
          
           }






          </div>
      }






      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderStatus}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>

        <Link color="inherit" underline="hover" variant="subtitle2" Wrap>
          {product.nome}
        </Link>
        <span style={{fontSize:"10px"}}>Cod: {product.cod}</span>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/**<ColorPreview colors={product.colors} /> */}
          {renderPrice}
        </Stack>

        <Stack>
      

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onFormSubmit)(e); }} id="demo">
            <span style={{fontWeight:"bolder", fontSize: "px"}}> Adicionar ao carrinho: </span>
            {
              thisSale &&
              <div>
              <TextField style={{width:"100%", marginTop:"8px"}} required fullWidth {...register("qty")} label="Quantidade" id="qty" inputProps={{ maxLength: 100 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
              <TextField style={{width:"100%", marginTop:"8px"}} fullWidth {...register("disccount")} label="Desconto unitário" id="disccount" inputProps={{ maxLength: 100 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
              <TextField style={{width:"100%", marginTop:"8px"}} fullWidth {...register("itemDescription")} label="Instruções" id="description" inputProps={{ maxLength: 4000 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
              <TextField style={{width:"100%", marginTop:"8px"}} fullWidth {...register("files")} label="Anexar Arquivos" id="files" inputProps={{ maxLength: 4000 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
              <button type="submit" style={{backgroundColor:"green", color:"white", border:"none", width:"100%", margin:"15px 0 0 0", padding:"5px 0", fontSize:"30px", borderRadius:"8px", cursor:"pointer"}}>
              +
        </button>
            </div>
            }
            
        </form>

            {
              !thisSale &&
              <button onClick={()=>{setShowModalVenda(true)}} style={{backgroundColor:"green", color:"white", border:"none", width:"100%", margin:"15px 0 0 0", padding:"5px 0", fontSize:"30px", borderRadius:"8px", cursor:"pointer"}}>
                  +
            </button>
            }

        </Stack>

      </Stack>
    </Card>

  );

}

ShopProductCard.propTypes = {
  product: PropTypes.object,
};
