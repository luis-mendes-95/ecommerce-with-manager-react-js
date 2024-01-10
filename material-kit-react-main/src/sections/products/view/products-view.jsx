/* eslint-disable */
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ProductCard from '../product-card';
import ProductTableToolbar from '../product-table-toolbar';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableContainer } from '@mui/material';
import Iconify from 'src/components/iconify';
import { ProductAddFormView } from '../productAddForm';
import { ProductEditFormView } from '../productEditForm';
import api from 'src/services/api';
import ProductCartWidget from '../product-cart-widget';
import Scrollbar from 'src/components/scrollbar';
import UserTableHead from 'src/sections/clients/clients-table-head';
import ProductsTableRow from '../product-table-row';
import TableEmptyRows from 'src/sections/clients/table-empty-rows';
import { emptyRows } from 'src/sections/clients/utils';


export default function ProductsView() {

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
              console.log(response.data)
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
    const [estoque, setEstoque] = useState("Todos");
    const [filterName, setFilterName] = useState('');
    const [selected, setSelected] = useState([]);
    const [regsSituation, setRegsSituation] = useState("active");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visuMode, setVisuMode] = useState("store");
    const [showEstoques, setShowEstoques] = useState(false);


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




{/**  const handleOpenFilter = () => {    setOpenFilter(true);  };  const handleCloseFilter = () => {    setOpenFilter(false);  }; */}


  const handleEditProduct = (id) => {    getProduct(id);  }
  
useEffect(() => {

setFilteredProducts(user?.produtos)
}, [user])




  return (
    <Container>

    {!showAdd && !showEdit &&
    <>






      <Box sx={{display:"flex", justifyContent:"flex-start", gap:"15px", alignContent:"flex-start", alignItems:"flex-start"}}>
        <Typography variant="h4" sx={{ mb: 5 }}>
              Produtos
            </Typography>

            <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>{setShowAdd(true); setShowEdit(false);}}>
            Novo Produto
        </Button>
        <Button variant="contained" color="inherit" style={{backgroundColor:"#00B8D9"}} onClick={()=>{setShowEstoques(!showEstoques);}}>
            Estoques
        </Button>
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
                        onChange={handleChangeregsSituation}
                      >
                        <MenuItem value={"active"}>Em estoque</MenuItem>
                        <MenuItem value={"inactive"}>Sem estoque</MenuItem>
                        <MenuItem value={"all"}>Todos</MenuItem>
                      </Select>
        </FormControl>

        <FormControl style={{minWidth: "200px", margin:"10px 20px"}}>
                      <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>Modo de visualização</InputLabel>
                      <Select
                        style={{minWidth: "200px"}}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={visuMode}
                        onChange={(e)=>{setVisuMode(e.target.value)}}
                      >
                        <MenuItem value={"store"}>Loja</MenuItem>
                        <MenuItem value={"list"}>Lista</MenuItem>
                      </Select>
        </FormControl>


        {
          regsSituation !== "inactive" &&
          <FormControl style={{minWidth: "200px", margin:"10px 20px"}}>
                  <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>Estoque</InputLabel>
                  <Select
                    style={{minWidth: "200px"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={estoque}
                    //onChange={handleChangeEstoque}
                  >
                    <MenuItem value={"Todos"}>Todos</MenuItem>
                  </Select>
        </FormControl>
        }





      </Box>

      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }} >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>

        </Stack>
      </Stack>

      {
        visuMode === "store" &&     
       <Grid container spacing={3}>

      {filteredProducts?.map((product) => (
          regsSituation === "all" &&
          <Grid key={product.id} xs={12} sm={6} md={3} >
            <ProductCard product={product} handleEditProduct={handleEditProduct}/>
          </Grid>
        ))}

        {filteredProducts?.map((product) => (
          regsSituation === "active" && product.ItemCompra.length > 0 &&
          <Grid key={product.id} xs={12} sm={6} md={3} >
            <ProductCard product={product} handleEditProduct={handleEditProduct}/>
          </Grid>
        ))}
        
        {filteredProducts?.map((product) => (
          regsSituation === "inactive" && product.ItemCompra.length < 1 &&
          <Grid key={product.id} xs={12} sm={6} md={3} >
            <ProductCard product={product} handleEditProduct={handleEditProduct}/>
          </Grid>
        ))
        }

        {
        filteredProducts?.length === 0 &&
          regsSituation === "all" &&
            user?.produtos.map((product) => (
              <Grid key={product.id} xs={12} sm={6} md={3} >

            </Grid>
            ))
        }

        {
          filteredProducts?.length === 0 &&
            regsSituation === "active" &&
              user?.produtos.map((product) => (
                product.active &&
                  <Grid key={product.id} xs={12} sm={6} md={3} >

                  </Grid>
              ))
        }

        {
          filteredProducts?.length === 0 &&
            regsSituation === "inactive" &&
              user?.produtos.map((product) => (
                product.active  === false &&
                  <Grid key={product.id} xs={12} sm={6} md={3} >

                  </Grid>
              ))
        }

      </Grid>
      }

      {
        visuMode === "list" &&
        <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>


            <UserTableHead rowCount={user?.clientes.length} 
              headLabel={[
                { id: 'data', label: 'Cod' },
                { id: 'produto', label: 'Produto' },
                { id: 'estoque', label: 'Estoque' },
                { id: 'preco', label: 'Preço' },
              ]}
            />


            <TableBody>
              {filteredProducts.map(row => ({
                ...row,
                createdAt: row.createdAt.split('/').reverse().join('-') 
              }))
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((row) => {

                const formattedDate = row.createdAt.split('-').reverse().join('/');

                if (regsSituation === "all") {

                  return (
                    <ProductsTableRow
                    key={row.id}
                    cod={row.cod}
                    product={row.nome} 
                    total={`R$ ${row.preco}`}
                    estoque={row.ItemCompra.length - row.ItemVenda.length}
                    handleEditProduct={handleEditProduct}
                    />
                  );
                } else if (regsSituation === "inactive" && (row.ItemCompra.length - row.ItemVenda.length) < 1) {

                  return (
                    <ProductsTableRow
                    key={row.id}
                    cod={row.cod}
                    product={row.nome} 
                    total={`R$ ${row.preco}`}
                    estoque={row.ItemCompra.length - row.ItemVenda.length}
                    handleEditProduct={handleEditProduct}
                    />
                  );
                } else if (regsSituation === "active" && (row.ItemCompra.length - row.ItemVenda.length) > 0) {

                  return (
                    <ProductsTableRow
                      key={row.id}
                      cod={row.cod}
                      id={row.id}
                      product={row.nome} 
                      total={`R$ ${row.preco}`}
                      estoque={row.ItemCompra.length - row.ItemVenda.length}
                      handleEditProduct={handleEditProduct}
                    />
                  );
                }
              })}


            </TableBody>


          </Table>
        </TableContainer>
      </Scrollbar>
      }
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


    </Container>
  );
}
