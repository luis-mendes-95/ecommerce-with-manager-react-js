/* eslint-disable */
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Button from '@mui/joy/Button';
import { fCurrency } from 'src/utils/format-number';
import Label from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';




{/**FUNÇÃO QUE RETORNA A DATA ATUAL FORMATADA*/}
function getDataAtualFormatada() {
  var data = new Date();
  var dia = data.getDate().toString().padStart(2, '0');
  var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
  var ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}




export default function ShopProductCard({ product, handleEditProduct }) {



  /**STATES FOR THIS COMPONENT */
  const [user, setUser] = React.useState(null);
  const [showCart, setShowCart] = React.useState(false);
  const [thisSale, setThisSale] = React.useState(false);
  const [subtotal, setSubtotal] = React.useState(null);
  const [disccount, setDisccount] = React.useState(null);
  const [submitType, setSubmitType] = React.useState('createSale');




  /**VARIABLES TO CUSTOM THIS COMPONENT */
  const url = "vendas"
  const urlEdit = url + `/${thisSale?.id}`;
  const urlItemVenda = "itemVendas";




  /**FUNCTIONS FOR REQUESTS */
  const getSale = async (id) => {
    if (user_id){
      try {
        const response = await api.get(`/vendas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(response.data){
          setSale(response.data);
          let total = 0;
          let disccount = 0;
          response.data.itens.map((row) => {
            total += parseFloat(row.qty) * parseFloat(row.produto.preco)
            disccount += parseFloat(row.disccount) * parseFloat(row.qty);
          })
          setSubtotal(total.toFixed(2));
          setDisccount(disccount.toFixed(2));
        }
      } catch (err) {
        setSale(null);
      }
    }
  }; 
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
  const createVenda = async (createData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.post(url, createData, config);
      if (response.data) {
        toast.success("Venda cadastrada com sucesso!");
        setTimeout(() => {
          setShowCart(true);
          setSubmitType("createItemSale");
          setThisSale(response.data)
          getUser();
          console.log(user)
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar venda");
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
        toast.success("Item cadastrado com sucesso!");
        setTimeout(() => {
          setShowCart(true);
          getUser();
          getSale(response.data.venda_id);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar item");
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
  const deleteItemVenda = async (itemId) => {
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await api.delete(`${urlItemVenda}/${itemId}`, config);
          if (response.status === 200) {
            
            toast.success("Item deletado com sucesso!");
            setTimeout(() => {
              getSale(thisSale.id)
            }, 1500);
          }
        } catch (err) {
          console.error(err);
          toast.error("Erro ao deletar item");
        }
  };


  

  /**AFTER LOAD THIS COMPONENT, RUN THESE CODES */
  React.useEffect(() => {
    getUser();
  }, []); 




  /**FORM CONFIGURATION - USE FORM */
  const { register, handleSubmit, formState: { errors }  } = useForm({
    // resolver: zodResolver(RegisterClientSchema),
  });
  const onFormSubmit = (formData) => {

    if (submitType === "createSale") {

            /**VERIFICA DADOS DO FORMULÁRIO E DEPOIS CHAMA A FUNÇÃO DE REQUISIÇÃO AO BACKEND */
            if(formData.description === "") {
              return toast.error("Obrigatório preencher: Descrição")
            } else if (formData.colaborador === "") {
              return toast.error("Obrigatório preencher: Vendedor")
            } else {
    
              formData.createdAt = getDataAtualFormatada();
              formData.lastEditted = getDataAtualFormatada();
              formData.changeMaker = user_name;
    
              formData.active = true;
              formData.user_id = user_id;
              formData.colaborador = user_name;
    
              createVenda(formData);
            }

    } else if (submitType === "createItemSale") {
      formData.description = formData.itemDescription;
      delete formData.itemDescription;
      formData.createdAt = getDataAtualFormatada();
      formData.changeMaker = getDataAtualFormatada();
      formData.lastEditted = getDataAtualFormatada();
      formData.venda_id = getDataAtualFormatada();
      formData.files = formData.files.split();
      formData.venda_id = thisSale.id;
      createItemVenda(formData);
    }

    

    
  };






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
          
















        <form onSubmit={handleSubmit} id="demo">

          <form>

            <span style={{fontWeight:"bolder", fontSize: "px"}}> Adicionar ao carrinho: </span>

            <TextField style={{width:"100%", marginTop:"0"}} required fullWidth {...register("qty")} label="Quantidade" id="qty" inputProps={{ maxLength: 100 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
            <TextField style={{width:"100%", marginTop:"0"}} required fullWidth {...register("disccount")} label="Desconto unitário" id="disccount" inputProps={{ maxLength: 100 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
            <TextField style={{width:"100%", marginTop:"0"}} required fullWidth {...register("description")} label="Instruções" id="description" inputProps={{ maxLength: 4000 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>
            <TextField style={{width:"100%", marginTop:"0"}} required fullWidth {...register("files")} label="Anexar Arquivos" id="files" inputProps={{ maxLength: 4000 }} onInput={(e) => { e.target.value =  e.target.value.toUpperCase(); }}/>

            <button  style={{backgroundColor:"green", color:"white", border:"none", width:"100%", margin:"15px 0 0 0", padding:"5px 0", fontSize:"30px", borderRadius:"8px", cursor:"pointer"}}>
              +
            </button>


          </form>

        </form>






























        </Stack>

      </Stack>
    </Card>
  );

}

ShopProductCard.propTypes = {
  product: PropTypes.object,
};
