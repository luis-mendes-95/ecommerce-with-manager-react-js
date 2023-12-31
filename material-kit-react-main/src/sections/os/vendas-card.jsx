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
import { create } from 'lodash';

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


export default function ShopProductCard({ product, handleEditProduct, handleGetSale, handleGetOs, thisSale, thisOs, submitType, setSubmitType, thisClient, handleSetClient, handleSetModalVenda, showModalVenda, handleSetShowCart, generateOs }) {








  /**STATES FOR THIS COMPONENT */
  const [user, setUser] = React.useState(null);








  /**VARIABLES TO CUSTOM THIS COMPONENT */
  const url = "vendas"
  const urlOs = "os"
  const urlEdit = url + `/${thisSale?.id}`;
  const urlEditOs = url + `/${thisOs?.id}`;
  const urlItemVenda = "itemVendas";
  const urlItemOs = "itemOs";



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


  const createFiles = async (createData) => {

    let filesToAdd = createData.files;
    delete createData.files;

    console.log(filesToAdd)

    createData.client_id = thisClient.id;
    createData.active = true;
    createData.filename = product.nome + "-" + thisClient.nome_razao_social + "-FILE-COMPONENT";
    createData.filetype = "PDF";
    createData.filesize = "15.26mb";
    createData.link = "https://cloudinary.com";
    createData.user_id = user_id;


    for(let i = 0; i < filesToAdd.length; i ++) {

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await api.post("files", createData, config);
        if (response.data) {
  
          toast.success("Arquivo adicionado com sucesso!", {
            position: "bottom-right", 
            autoClose: 3000, 
            hideProgressBar: false, 
            closeOnClick: true, 
            pauseOnHover: true, 
            draggable: true, 
            progress: undefined, 
          });
          setTimeout(() => {
            handleSetShowCart(true);
            getUser();
            reset();
            handleGetSale(response.data.venda_id);
          }, 1500);
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro ao adicionar arquivo!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
      } 
      
    }










  }


  
  /** GET OS BY REQUEST IN BACKEND*/
  const getOs = async (id) => {
    try {
      const response = await api.get(`/os/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.data){
          setThisOs(response.data); 
          setOsToEdit(response.data.id)
      }
    } catch (err) {
      console.log(err);
      setThisOs(null);
    }
    console.log("fluiu tudo, saca só")
    console.log(thisOs)
  }; 





 
  const createItemOs = async (createData) => {


    console.log("chego eu aqui")
    console.log(createData)

    createData.descricao = createData.itemDescription;
    createData.mockup = "";

    createData.printFile = "";
    createData.createdAt = getDataAtualFormatada();
    createData.lastEditted = getDataAtualFormatada();
    createData.changeMaker = user_name;

    delete createData.description;
    createData.qtd = createData.qty;
    delete createData.qty;
    createData.tipo_arte = "Arte Nova";
    createData.status = "Aguardando Arte";
    createData.colaborador = user_name;
    if(thisOs){
      createData.os_id = thisOs.id;
    }
    createData.produto_id = product.id;

   try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.post("itemOs", createData, config);
      if (response.data) {
        createData.itemOs_id = response.data.id;
        if(createData.files[0]) {
          createData.files = createData.files.split(",")
          createFiles(createData)
        }

        toast.success("Item adicionado à Ordem de Serviço!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
        setTimeout(() => {
          handleSetShowCart(true);
          getUser();
          reset();
          console.log(response.data)
          handleGetOs(response.data.os_id);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar item na Ordem de Serviço!", {
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




  const createItemVenda = async (createData) => {



    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.post(urlItemVenda, createData, config);
      if (response.data) {
        if(generateOs){
          createItemOs(createData)
        }












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
          handleSetShowCart(true);
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


      formData.createdAt = getDataAtualFormatada();
      formData.changeMaker = getDataAtualFormatada();
      formData.lastEditted = getDataAtualFormatada();
      if (formData.files) {
        formData.description = formData.itemDescription;
        delete formData.itemDescription;
        formData.files = formData.files.split();
      } else {
        formData.files = [];
        formData.description = "";
      }
      
      formData.venda_id = thisSale.id;
      formData.client_id = thisClient.id;
      formData.produto_id = product.id;


      if (formData.disccount === "") {formData.disccount = "0"};



      createItemVenda(formData);

    } else if (submitType === "createItemOs") { 
      createItemOs(formData);
    }

    

    
  };








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
            <span style={{fontWeight:"bolder", fontSize: "px"}}> Adicionar à OS: </span>
            {
              thisOs &&
              <div>
              <TextField style={{width:"100%", marginTop:"8px"}} required fullWidth {...register("qty")} label="Quantidade" id="qty" inputProps={{ maxLength: 100 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
              {
                thisOs &&
                <>
                  <TextField style={{width:"100%", marginTop:"8px"}} fullWidth {...register("itemDescription")} label="Descrição" id="description" inputProps={{ maxLength: 4000 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
                  <TextField style={{width:"100%", marginTop:"8px"}} fullWidth {...register("files")} label="Anexar Arquivos" id="files" inputProps={{ maxLength: 4000 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
                </>
              }
              <button type="submit" style={{backgroundColor:"green", color:"white", border:"none", width:"100%", margin:"15px 0 0 0", padding:"5px 0", fontSize:"30px", borderRadius:"8px", cursor:"pointer"}}>
              +
        </button>
            </div>
            }
            
        </form>



        </Stack>

      </Stack>
    </Card>

  );

}

ShopProductCard.propTypes = {
  product: PropTypes.object,
};
