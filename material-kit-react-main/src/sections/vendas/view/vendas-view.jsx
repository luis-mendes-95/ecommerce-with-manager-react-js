/* eslint-disable */
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ProductCard from '../vendas-card';
import ProductTableToolbar from '../vendas-table-toolbar';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Iconify from 'src/components/iconify';
import { ProductAddFormView } from '../vendaAddForm';
import { ProductEditFormView } from '../vendaEditForm';
import api from 'src/services/api';
import ProductCartWidget from '../vendas-cart-widget';
import { id } from 'date-fns/locale';


export default function VendasView() {

    /** GET USER BY REQUEST IN BACKEND AND TAKES TOKEN FROM LOCALSTORAGE*/
    const [user, setUser] = useState(null);
    const user_id = localStorage.getItem('tejas.app.user_id');
    const token = localStorage.getItem('tejas.app.token');
    const user_name = localStorage.getItem('tejas.app.user_name');

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
          //se der erro setar botao logout
          }
        } catch (err) {
          console.log(err)
          setUser(null);
          //se der erro setar botao login
        }
      }
    }; 
    useEffect(() => {getUser();}, []); 

  


    /**STATES FOR THIS COMPONENT */
    const [openFilter, setOpenFilter] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [product, setProduct] = useState(null);
    const [thisSale, setThisSale] = useState(null);
    const [thisClient, setThisClient] = useState(null);
    const [filterName, setFilterName] = useState('');
    const [selected, setSelected] = useState([]);
    const [regsSituation, setRegsSituation] = useState("active");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [submitType, setSubmitType] = useState('createSale');


    const filterProducts = (searchText) => {
      if (!searchText) {
        setFilteredProducts(user?.produtos || []);
      } else {
        const filtered = user?.produtos.filter(
          (item) =>
            item.nome.toLowerCase().includes(searchText.toLowerCase()) ||
            item.cod.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProducts(filtered || []);
      }
    };


    const handleGetSale = (id) => {
      getSale(id)
    }

    const handleSetClient = (data) => {
      setThisClient(data);
    }

    const handleSetSubmitType = (string) => {
      setSubmitType(string);
    }



    //SET FILTER NAME
    const handleFilterByName = (event) => {
      const searchText = event.target.value;
      setFilterName(searchText);
      filterProducts(searchText);
    };


    const handleChangeregsSituation = (event) => {    setRegsSituation(event.target.value);  };



  /** GET PRODUCT BY REQUEST IN BACKEND*/
  const getProduct = async (id) => {
      try {
        const response = await api.get(`/produtos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(response.data){
            setProduct(response.data);
            setShowEdit(true);  
        }
      } catch (err) {
        console.log(err);
        setClient(null);
      }
  }; 




    /** GET SALE BY REQUEST IN BACKEND*/
    const getSale = async (id) => {
      try {
        const response = await api.get(`/vendas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(response.data){
            setThisSale(response.data); 
        }
      } catch (err) {
        console.log(err);
        setClient(null);
      }
  }; 




{/**  const handleOpenFilter = () => {    setOpenFilter(true);  };  const handleCloseFilter = () => {    setOpenFilter(false);  }; */}


  const handleEditProduct = (id) => {    getProduct(id);  }
  
  return (
    <Container>

    {!showAdd && !showEdit &&
    <>
      <Box sx={{display:"flex", justifyContent:"space-between", alignContent:"flex-start", alignItems:"flex-start"}}>
        <Typography variant="h4" sx={{ mb: 5 }}>
              Vendas
            </Typography>

{
  /**
   *         <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>{setShowAdd(true); setShowEdit(false);}}>
            Nova Venda
        </Button>
   */
}
      </Box>


      <Box sx={{display:"flex", flexWrap:"wrap", justifyContent:"flex-start", alignContent:"center", alignItems:"center", bgcolor:"white", borderRadius:"8px"}}>
        <ProductTableToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
        <FormControl style={{minWidth: "200px", margin:"10px 20px"}}>
                      <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>Situação</InputLabel>
                      <Select
                        style={{minWidth: "200px"}}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={regsSituation}
                        label="Age"
                        onChange={handleChangeregsSituation}
                      >
                        <MenuItem value={"active"}>Ativos</MenuItem>
                        <MenuItem value={"inactive"}>Inativos</MenuItem>
                        <MenuItem value={"all"}>Todos</MenuItem>
                      </Select>
        </FormControl>
      </Box>

      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }} >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
   {/** <ProductFilters openFilter={openFilter} onOpenFilter={handleOpenFilter} onCloseFilter={handleCloseFilter} /> */}

          {/**<ProductSort /> */}
        </Stack>
      </Stack>

      <Grid container spacing={3}>
      {filteredProducts?.map((product) => (
          regsSituation === "all" &&
          <Grid key={product.id} xs={12} sm={6} md={3} >
            <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient}/>
            
          </Grid>
        ))}

        {filteredProducts?.map((product) => (
          regsSituation === "active" && product.active &&
          <Grid key={product.id} xs={12} sm={6} md={3} >
            <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient}/>
          </Grid>
        ))}
        
        {filteredProducts?.map((product) => (
          regsSituation === "inactive" && product.active === false &&
          <Grid key={product.id} xs={12} sm={6} md={3} >
            <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient}/>
          </Grid>
        ))
        }

        {
          filteredProducts.length === 0 &&
            regsSituation === "all" &&
              user?.produtos.map((product) => (
                <Grid key={product.id} xs={12} sm={6} md={3} >
                <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient}/>
              </Grid>
              ))
        }

        {
          filteredProducts.length === 0 &&
            regsSituation === "active" &&
              user?.produtos.map((product) => (
                product.active &&
                  <Grid key={product.id} xs={12} sm={6} md={3} >
                    <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient}/>
                  </Grid>
              ))
        }

        {
          filteredProducts.length === 0 &&
            regsSituation === "inactive" &&
              user?.produtos.map((product) => (
                product.active  === false &&
                  <Grid key={product.id} xs={12} sm={6} md={3} >
                    <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient}/>
                  </Grid>
              ))
        }

      </Grid>
    </>    
    }

    {
      showAdd &&
      <ProductAddFormView/>
    }

    {
      showEdit &&
      <ProductEditFormView product={product}/>
    }

    <ProductCartWidget thisSale={thisSale}/>
    </Container>
  );
}
