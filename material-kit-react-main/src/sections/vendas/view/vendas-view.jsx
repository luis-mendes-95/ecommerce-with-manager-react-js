/* eslint-disable */
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ProductCard from '../vendas-card';
import ProductTableToolbar from '../vendas-table-toolbar';
import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Table, TableBody, TableContainer, TextField } from '@mui/material';
import Iconify from 'src/components/iconify';
import { ProductAddFormView } from '../vendaAddForm';
import { ProductEditFormView } from '../vendaEditForm';
import api from 'src/services/api';
import ProductCartWidget from '../vendas-cart-widget';
import { id } from 'date-fns/locale';
import { ToastContainer, toast } from "react-toastify";
import { Toastify } from 'toastify';
import { useForm } from 'react-hook-form';
import Scrollbar from 'src/components/scrollbar';
import UserTableHead from 'src/sections/clients/clients-table-head';
import { emptyRows, applyFilter, getComparator } from '../../clients/utils';
import TableEmptyRows from 'src/sections/clients/table-empty-rows';
import ClientTableRow from 'src/sections/clients/clients-table-row';
import VendasTableRow from '../vendas-table-row';
import ClientTableToolbar from 'src/sections/clients/client-table-toolbar';







{/**FUNÇÃO QUE RETORNA A DATA ATUAL FORMATADA*/}
function getDataAtualFormatada() {
  var data = new Date();
  var dia = data.getDate().toString().padStart(2, '0');
  var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
  var ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}






export default function VendasView() {







  



      /**STATES FOR THIS COMPONENT */



      /**RENDERED ENTITIES */
      const [product, setProduct] = useState(null);
      const [thisSale, setThisSale] = useState(null);
      const [thisClient, setThisClient] = useState(null);
      const [user, setUser] = useState(null);





      /**FILTER STUFF STATES */
      const [page, setPage] = useState(0);
      const [filterName, setFilterName] = useState('');
      const [filtroNomeCliente, setFiltroNomeCliente] = useState('');
      const [regsSituation, setRegsSituation] = useState("active");
      const [clientFilterName, setClientFilterName] = useState('');
      const [filteredClients, setFilteredClients] = useState([]);
      const [productFilterName, setProductFilterName] = useState('');
      const [filteredProducts, setFilteredProducts] = useState([]);
      const [showTypedClientResults, setShowTypedClientResults] = useState(false);
      const [filtroAno, setFiltroAno] = useState('');
      const [filtroMes, setFiltroMes] = useState('');
      const [filtroDia, setFiltroDia] = useState('');




      /**FILTER STUFF FUNCTIONS */
      const handleChangeregsSituation = (event) => {    setRegsSituation(event.target.value);  };






      /**FILTER STUFF VARIABLES */
      const vendasFiltradas = user?.vendas
      .map(row => ({
        ...row,
        createdAt: row.createdAt.split('/').reverse().join('-') // Change date format to "YYYY-MM-DD"
      }))
      .filter(row => {
        const dataFormatada = row.createdAt.split('-').map(Number);
        const anoMatch = filtroAno ? dataFormatada[0] === Number(filtroAno) : true;
        const mesMatch = filtroMes ? dataFormatada[1] === Number(filtroMes) : true;
        const diaMatch = filtroDia ? dataFormatada[2] === Number(filtroDia) : true;
        const nomeMatch = filtroNomeCliente
          ? row.client.nome_razao_social.toLowerCase().includes(filtroNomeCliente.toLowerCase())
          : true;
    
        return anoMatch && mesMatch && diaMatch && nomeMatch;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));






      /**SHOWING EXTERNAL COMPONENTS STUFF */
      const [showAdd, setShowAdd] = useState(false);
      const [showEdit, setShowEdit] = useState(false);
      const [showModalVenda, setShowModalVenda] = useState(false);
      const [showCart, setShowCart] = useState(false);






      /**FORM SUBMIT STUFF */
      const url = "vendas"
      const urlEdit = url + `/${thisSale?.id}`;
      const [submitType, setSubmitType] = useState('createSale');
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




    /** LOCALSTORAGE STUFF*/
    const user_id = localStorage.getItem('tejas.app.user_id');
    const token = localStorage.getItem('tejas.app.token');
    const user_name = localStorage.getItem('tejas.app.user_name');






    /**GET USER FROM BACKEND */
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


  







    /**HANDLERS TO CHANGE STATES IN OUTSIDER COMPONENTS */
    const handleSetShowCart = (bool) => {
      setShowCart(bool);
    }
    const handleSetModalVenda = (bool) => {
      setShowModalVenda(bool);
    }
    const handleGetSale = (id) => {
      getSale(id)
    }
    const handleSetClient = (data) => {
      setThisClient(data);
    }
    const handleSetSubmitType = (string) => {
      setSubmitType(string);
    }
    const handleEditProduct = (id) => {    getProduct(id);  }





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




  /**CREATE VENDA REQUEST IN BACKEND */
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
        handleSetModalVenda(false);
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





/**GET CLIENT REQUEST IN BACKEND */
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
        setThisSale(null);
      }
}; 



  /**DELETE ITEM IN CART */
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









  
  return (
    <Container>
      <ToastContainer/>


      
    {/**ADD SALE MODAL */}
      {
        showModalVenda &&
          <div style={{position:"absolute", top:"0", left:"0", zIndex: 9999, backgroundColor:"#F9FAFA", width:"100%", height:"100%", padding:"10px"}}>
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
            !showTypedClientResults && !thisClient &&
              user?.clientes.map((client)=>{
                return (
                  <p style={{cursor:"pointer", backgroundColor:"lightgray", padding:"5px", borderRadius:"8px"}} key={client.id} onClick={()=>{getClient(client.id)}}>{client.nome_razao_social}</p>
                )
              })
          }





          {
            thisClient &&
              <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    alignSelf: "flex-end",
                    background: "none",
                    border: "none",
                    fontSize: "1.5em",
                    cursor: "pointer",
                    color: "#555",
                    padding: "5px",
                    marginRight: "10px",
                  }}
                >
                  &#x2715;
                </button>
                <label style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "1.2em" }}>Cliente:</label>
                <button
                  style={{
                    maxWidth: "200px",
                    padding: "8px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "20px",
                    fontSize: "1em",
                  }}
                  onClick={() => { handleSetClient(null) }}
                >
                  Trocar
                </button>
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSubmit(onFormSubmit)(e); }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%", marginBottom: "20px" }}>
                    <p style={{ padding: "10px", borderRadius: "8px", backgroundColor: "#ecf0f1" }} key={thisClient.id}>
                      {thisClient.nome_razao_social}
                    </p>
                    <TextField
                      fullWidth
                      label="Observações"
                      id="description"
                      inputProps={{ maxLength: 400 }}
                      onInput={(e) => { e.target.value = e.target.value.toUpperCase(); setShowTypedClientResults(true); setFilteredClientsByTyping(e.target.value) }}
                      {...register("description")}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#2ecc71",
                      color: "white",
                      textShadow: "2pt 2pt 5pt black",
                      padding: "10px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1.2em",
                    }}
                  >
                    Iniciar Venda
                  </button>
                </form>
              </div>

          
           }






          </div>
      }










    {!showAdd && !showEdit &&
    <>
      <Box sx={{display:"flex", justifyContent:"space-between", alignContent:"flex-start", alignItems:"flex-start"}}>
        <Typography variant="h4" sx={{ mb: 5 }}>
              Vendas
            </Typography>
            <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>{handleSetModalVenda(true)}}>
            Nova Venda
          </Button>

{
  /**
   *         <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>{setShowAdd(true); setShowEdit(false);}}>
            Nova Venda
        </Button>
   */
}
      </Box>


      <Box sx={{display:"flex", flexWrap:"wrap", justifyContent:"center", alignContent:"center", alignItems:"center", bgcolor:"white", borderRadius:"8px"}}>
        {
          thisSale &&
          <ProductTableToolbar filterName={productFilterName} />
        }
        {
          !thisSale &&
          <>
            <OutlinedInput
              value={filtroNomeCliente}
              onChange={(e) => setFiltroNomeCliente(e.target.value)}
              placeholder="Procurar cliente..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled', width: 20, height: 20 }}
                  />
                </InputAdornment>
              }
            />
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
        <FormControl style={{display:"flex", flexDirection:"column"}}>
             <div>
               <label>Dia:</label>
               <select value={filtroDia} onChange={(e) => setFiltroDia(e.target.value)}  style={{border:"none", margin:"10px", padding:"10px", cursor:"pointer"}} >
                 <option value="">Todos</option>
                 {Array.from({ length: 31 }, (_, index) => <option key={index + 1} value={`${index + 1 < 10 ? '0' : ''}${index + 1}`}>{index + 1}</option>)}
               </select>
             </div>
             <div>
               <label>Mês:</label>
               <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}  style={{border:"none", margin:"10px", padding:"10px", cursor:"pointer"}}>
                 <option value="">Todos</option>
                 <option value="01">Janeiro</option>
                 <option value="02">Fevereiro</option>
                 <option value="03">Março</option>
                 <option value="04">Abril</option>
                 <option value="05">Maio</option>
                 <option value="06">Junho</option>
                 <option value="07">Julho</option>
                 <option value="08">Agosto</option>
                 <option value="09">Setembro</option>
                 <option value="10">Outubro</option>
                 <option value="11">Novembro</option>
                 <option value="12">Dezembro</option>
               </select>
             </div>
             <div>
               <label>Ano:</label>
               <select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)} style={{border:"none", margin:"10px", padding:"10px", cursor:"pointer"}}>
                 <option value="">Todos</option>
                 <option value="2023">2023</option>
                 <option value="2022">2022</option>
               </select>
             </div>

        </FormControl>
        </>
        }

      </Box>

      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }} >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
   {/** <ProductFilters openFilter={openFilter} onOpenFilter={handleOpenFilter} onCloseFilter={handleCloseFilter} /> */}

          {/**<ProductSort /> */}
        </Stack>
      </Stack>






      {/**GRID WITH PRODUCTS TO CHOOSE TO ADD IN SALE */}
      {
        thisSale &&
        <Grid container spacing={3}>
        {filteredProducts?.map((product) => (
            regsSituation === "all" &&
            <Grid key={product.id} xs={12} sm={6} md={3} >
              <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient} handleSetModalVenda={handleSetModalVenda} showModalVenda={showModalVenda} handleSetShowCart={handleSetShowCart}/>
  
            </Grid>
          ))}
  
          {filteredProducts?.map((product) => (
            regsSituation === "active" && product.active &&
            <Grid key={product.id} xs={12} sm={6} md={3} >
              <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient} handleSetModalVenda={handleSetModalVenda} showModalVenda={showModalVenda} handleSetShowCart={handleSetShowCart}/>
            </Grid>
          ))}
          
          {filteredProducts?.map((product) => (
            regsSituation === "inactive" && product.active === false &&
            <Grid key={product.id} xs={12} sm={6} md={3} >
              <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient} handleSetModalVenda={handleSetModalVenda} showModalVenda={showModalVenda} handleSetShowCart={handleSetShowCart}/>
            </Grid>
          ))
          }
  
          {
            filteredProducts.length === 0 &&
              regsSituation === "all" &&
                user?.produtos.map((product) => (
                  <Grid key={product.id} xs={12} sm={6} md={3} >
                  <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient} handleSetModalVenda={handleSetModalVenda} showModalVenda={showModalVenda} handleSetShowCart={handleSetShowCart}/>
                </Grid>
                ))
          }
  
          {
            filteredProducts.length === 0 &&
              regsSituation === "active" &&
                user?.produtos.map((product) => (
                  product.active &&
                    <Grid key={product.id} xs={12} sm={6} md={3} >
                      <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient} handleSetModalVenda={handleSetModalVenda} showModalVenda={showModalVenda} handleSetShowCart={handleSetShowCart}/>
                    </Grid>
                ))
          }
  
          {
            filteredProducts.length === 0 &&
              regsSituation === "inactive" &&
                user?.produtos.map((product) => (
                  product.active  === false &&
                    <Grid key={product.id} xs={12} sm={6} md={3} >
                      <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} thisSale={thisSale} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient} handleSetModalVenda={handleSetModalVenda} showModalVenda={showModalVenda} handleSetShowCart={handleSetShowCart}/>
                    </Grid>
                ))
          }
  
        </Grid>
      }


      {
        !thisSale &&
        <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>


            <UserTableHead rowCount={user?.clientes.length} 
              headLabel={[
                { id: 'data', label: 'Data' },
                { id: 'nome_razao_social', label: 'Nome / Razão Social' },
                { id: 'total', label: 'Total' },
              ]}
            />


            <TableBody>
              {vendasFiltradas?.map(row => ({
                ...row,
                createdAt: row.createdAt.split('/').reverse().join('-') // Change date format to "YYYY-MM-DD"
              }))
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
              .map((row) => {
                const formattedDate = row.createdAt.split('-').reverse().join('/'); // Change date format back to "DD/MM/YYYY"

                if (regsSituation === "all") {
                  const total = row.itens.reduce((acc, item) => {
                    const preco = typeof item.produto.preco !== 'undefined' ? parseFloat(item.produto.preco) : 0;
                    const qty = typeof item.qty !== 'undefined' ? parseFloat(item.qty) : 0;
                    const itemTotal = preco * qty;
                    return acc + itemTotal;
                  }, 0);

                  return (
                    <VendasTableRow
                      key={row.id}
                      id={row.id}
                      data={formattedDate} // Use the formatted date
                      nome_razao_social={row.client.nome_razao_social}
                      total={`R$ ${total.toFixed(2)}`}
                      handleClick={() => handleClick(row.id)}
                    />
                  );
                } else if (regsSituation === "inactive" && row.active === false) {
                  const total = row.itens.reduce((acc, item) => {
                    const preco = typeof item.produto.preco !== 'undefined' ? parseFloat(item.produto.preco) : 0;
                    const qty = typeof item.qty !== 'undefined' ? parseFloat(item.qty) : 0;
                    const itemTotal = preco * qty;
                    return acc + itemTotal;
                  }, 0);

                  return (
                    <VendasTableRow
                      key={row.id}
                      nome_razao_social={row.nome_razao_social}
                      total={`R$ ${total.toFixed(2)}`}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={() => handleClick(row.id)}
                    />
                  );
                } else if (regsSituation === "active" && row.active === true) {
                  const total = row.itens.reduce((acc, item) => {
                    const preco = typeof item.produto.preco !== 'undefined' ? parseFloat(item.produto.preco) : 0;
                    const qty = typeof item.qty !== 'undefined' ? parseFloat(item.qty) : 0;
                    const itemTotal = preco * qty;
                    return acc + itemTotal;
                  }, 0);

                  return (
                    <VendasTableRow
                      key={row.id}
                      data={formattedDate} // Use the formatted date
                      nome_razao_social={row.client.nome_razao_social}
                      total={`R$ ${total.toFixed(2)}`}
                      handleClick={() => handleClick(row.id)}
                    />
                  );
                }
              })}


              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, user?.clientes.length)}
              />

              {/**              {notFound && <TableNoData query={filterName} />} */}
            </TableBody>


          </Table>
        </TableContainer>
      </Scrollbar>
      }

    </>    
    }


    <ProductCartWidget thisSale={thisSale} deleteItemVenda={deleteItemVenda}/>
    </Container>
  );
}
