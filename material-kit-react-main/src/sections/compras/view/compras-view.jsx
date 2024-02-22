/* eslint-disable */
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ProductCard from '../compras-card';
import ProductTableToolbar from '../vendas-table-toolbar';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Table, TableBody, TableContainer, TextField } from '@mui/material';
import Iconify from 'src/components/iconify';
import api from 'src/services/api';
import ProductCartWidget from '../compras-cart-widget';
import { ToastContainer, toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import Scrollbar from 'src/components/scrollbar';
import UserTableHead from 'src/sections/clients/clients-table-head';
import { emptyRows } from '../../clients/utils';
import TableEmptyRows from 'src/sections/clients/table-empty-rows';
import ComprasTableRow from '../compras-table-row';
import { CompraEditFormView } from '../compraEditForm';

{/**FUNÇÃO QUE RETORNA A DATA ATUAL FORMATADA*/}
function getDataAtualFormatada() {
  var data = new Date();
  var dia = data.getDate().toString().padStart(2, '0');
  var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
  var ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}

export default function ComprasView() {

      /**STATES FOR THIS COMPONENT */
      const [generateOs, setGenerateOs] = useState(false);
      const [generatePayables, setGeneratePayables] = useState(true);

      /**RENDERED ENTITIES */
      const [product, setProduct] = useState(null);
      const [thisSale, setThisSale] = useState(null);
      const [thisCompra, setThisCompra] = useState(null);
      const [thisOs, setThisOs] = useState(null);
      const [saleToEdit, setSaleToEdit] = useState(null);
      const [compraToEdit, setCompraToEdit] = useState(null);
      const [thisClient, setThisClient] = useState(null);
      const [user, setUser] = useState(null);

      /**FILTER STUFF STATES */
      const [page, setPage] = useState(0);
      const [filterName, setFilterName] = useState('');
      const [filtroNomeCliente, setFiltroNomeCliente] = useState('');
      const [regsSituation, setRegsSituation] = useState("active");
      const [filteredClients, setFilteredClients] = useState([]);
      const [filteredProducts, setFilteredProducts] = useState([]);
      const [showTypedClientResults, setShowTypedClientResults] = useState(false);
      const [filtroAno, setFiltroAno] = useState('');
      const [filtroMes, setFiltroMes] = useState('');
      const [filtroDia, setFiltroDia] = useState('');

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

      /**FILTER STUFF FUNCTIONS */
      const handleChangeregsSituation = (event) => {    setRegsSituation(event.target.value);  };

      const handleFilterByName = (event) => {
        const searchText = event.target.value;
        setFilterName(searchText);
        filterProducts(searchText);
      };

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

     /**FILTER STUFF VARIABLES */
     const comprasFiltradas = user?.compras
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
         ? row.supplier.nome_razao_social.toLowerCase().includes(filtroNomeCliente.toLowerCase())
         : true;
   
       return anoMatch && mesMatch && diaMatch && nomeMatch;
     })
     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

     /**SHOWING EXTERNAL COMPONENTS STUFF */
     const [showAdd, setShowAdd] = useState(false);
     const [showEdit, setShowEdit] = useState(false);
     const [showModalVenda, setShowModalVenda] = useState(false);
     const [showModalCompra, setShowModalCompra] = useState(false);
     const [showCart, setShowCart] = useState(false);
  
     /**FORM SUBMIT STUFF */
      const url = "vendas"
      const urlCompras = "compras"
      const urlEdit = url + `/${thisSale?.id}`;
      const urlEditCompra = url + `/${thisCompra?.id}`;
      const [submitType, setSubmitType] = useState('createSale');
      const [submitTypeCompra, setSubmitTypeCompra] = useState('createCompra');
      const { register, handleSubmit, reset, formState: { errors }  } = useForm({
        // resolver: zodResolver(RegisterClientSchema),
      });
      const onFormSubmit = (formData) => {


          formData.createdAt = getDataAtualFormatada();
          formData.lastEditted = getDataAtualFormatada();
          formData.changeMaker = user_name;
          
          formData.active = true;
          formData.description = "Compra "
          formData.dispatchValue = "0"

          formData.user_id = user_id;
          formData.supplier_id = thisClient?.id;

          createCompra(formData);
      
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

    useEffect(() => {setFilteredProducts(user?.produtos);}, [thisCompra, user]); 

    /**HANDLERS TO CHANGE STATES IN OUTSIDER COMPONENTS */
    const handleSetShowCart = (bool) => {
      setShowCart(bool);
    }
    const handleSetModalVenda = (bool) => {
      setShowModalVenda(bool);
    }
    const handleSetModalCompra = (bool) => {
      setShowModalCompra(bool);
    }
    const handleSetClient = (data) => {
      setThisClient(data);
    }
    const handleEditProduct = (id) => {  getProduct(id);  }
    
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

  /**CREATE COMPRA REQUEST IN BACKEND */
  const createCompra = async (createData) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await api.post(urlCompras, createData, config);
        if (response.data) {
          toast.success("ADICIONE OS PRODUTOS DA SUA COMPRA!", {
            position: "bottom-right", 
            autoClose: 3000, 
            hideProgressBar: false, 
            closeOnClick: true, 
            pauseOnHover: true, 
            draggable: true, 
            progress: undefined, 
          });
          handleSetModalCompra(false);

          setTimeout(() => {
            setShowCart(true);
            setSubmitType("createItemCompra");
            handleGetCompra(response.data.id);
            reset();
            getUser();
          }, 1500);
        }
      } catch (err) {
        console.error(err);
        toast.error("ERRO AO CADASTRAR COMPRA!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
        setSubmitType("createItemCompra")
      }
  };

  /**DELETE VENDA REQUEST IN BACKEND */
  const deleteCompra = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await api.delete(`${urlCompras}/${thisCompra.id}`, config);
        if (response.status === 200) {
          toast.success("COMPRA CANCELADA!", {
            position: "bottom-right", 
            autoClose: 3000, 
            hideProgressBar: false, 
            closeOnClick: true, 
            pauseOnHover: true, 
            draggable: true, 
            progress: undefined, 
          });
          handleSetModalCompra(false);
          setThisCompra(null);
          setThisOs(null);
          setThisClient(null);


            setSubmitType("createCompra");
            reset();
            //getUser();
            location.reload();

        }
      } catch (err) {
        console.error(err);
        toast.error("ERRO AO CANCELAR COMPRA!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
        setSubmitType("createCompra")
        setThisSale(null);
        setThisOs(null);
        setThisClient(null);
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
            setSaleToEdit(response.data.id)
        }
      } catch (err) {
        console.log(err);
        setThisSale(null);
      }
  }; 

  /** GET SALE BY REQUEST IN BACKEND*/
  const getCompra = async (id) => {
      try {
        const response = await api.get(`/compras/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(response.data){
            setThisCompra(response.data); 
            setCompraToEdit(response.data.id)
        }
      } catch (err) {
        console.log(err);
        setThisCompra(null);
      }
  }; 

  /**DELETE ITEM IN CART */
  const deleteItemCompra = async (itemId) => {
    
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await api.delete(`itemCompras/${itemId}`, config);
        if (response.status === 200) {
          
          toast.success("ITEM DELETADO COM SUCESSO!");
          setTimeout(() => {
            getCompra(thisCompra.id)
          }, 1500);
        }
      } catch (err) {
        console.error(err);
        toast.error("ERRO AO DELETAR ITEM!");
      }
  };

  /**HANDLE SALE TO EDIT */
  const handleCompraToEdit = (id) => {
    getCompra(id);
    setCompraToEdit(id);
    setShowEdit(true);
    setShowAdd(false);

  }

  /**HANDLE GET SALE */
  const handleGetSale = (id) => {
    getSale(id)
  }

  /**HANDLE GET SALE */
  const handleGetCompra = (id) => {
    getCompra(id)
  }
  
  return (
    <Container>
      <ToastContainer/>
      
        {/**ADD COMPRA MODAL */}
        {
          showModalCompra &&
            <div style={{position:"absolute", top:"0", left:"0", zIndex: 9999, backgroundColor:"#F9FAFA", width:"100%", height:"100%", padding:"10px"}}>
            <button style={{backgroundColor:"red", color:"white", border:"none", padding:"8px", borderRadius:"8px", cursor:"pointer"}} onClick={()=>{window.location.reload()}}>X</button>
            <h3>NOVA COMPRA:</h3>

          {
            !thisClient &&
            <TextField fullWidth label="Digitar Cliente" id="client_id" inputProps={{ maxLength: 400 }} onInput={(e) => {e.target.value =  e.target.value.toUpperCase(); setShowTypedClientResults(true); setFilteredClientsByTyping(e.target.value)}} {...register("client_id")} />
          }

          <FormControlLabel control={<Checkbox checked={generatePayables} onChange={()=>{setGeneratePayables(!generatePayables)}} />} label="Gerar Títulos A Pagar" />
          

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

                <label style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "1.2em" }}>CLIENTE:</label>
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
                  TROCAR
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
                    INICIAR COMPRA
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
                COMPRAS
              </Typography>

              {
                !thisCompra &&
                <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>{handleSetModalCompra(true)}}>
                  NOVA COMPRA
                </Button>
              }

              {
                thisCompra &&
                <>
                  <p style={{fontWeight:"bold"}}>{thisCompra.supplier.nome_razao_social}</p>
                  <Button variant="contained" color="inherit" style={{backgroundColor:"brown"}} onClick={()=>{deleteCompra()}}>
                    CANCELAR COMPRA
                  </Button>
                </>
              }


        </Box>


        <Box sx={{display:"flex", flexWrap:"wrap", justifyContent:"center", alignContent:"center", alignItems:"center", bgcolor:"white", borderRadius:"8px"}}>

              {
                thisCompra &&
                <ProductTableToolbar numSelected={0} filterName={filterName} onFilterName={handleFilterByName} />
              }

              {
                !thisCompra &&

                <>

                  <OutlinedInput
                    value={filtroNomeCliente}
                    onChange={(e) => setFiltroNomeCliente(e.target.value)}
                    placeholder="PROCURAR CLIENTE..."
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
                              <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>SITUAÇÃO</InputLabel>
                              <Select
                                style={{minWidth: "200px"}}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={regsSituation}
                                label="SITUAÇÃO"
                                onChange={handleChangeregsSituation}
                              >
                                <MenuItem value={"active"}>ATIVOS</MenuItem>
                                <MenuItem value={"inactive"}>INATIVOS</MenuItem>
                                <MenuItem value={"all"}>TODOS</MenuItem>
                              </Select>
                  </FormControl>

                  <FormControl style={{display:"flex", flexDirection:"column"}}>
                      <div>
                        <label>DIA:</label>
                        <select value={filtroDia} onChange={(e) => setFiltroDia(e.target.value)}  style={{border:"none", margin:"10px", padding:"10px", cursor:"pointer"}} >
                          <option value="">TODOS</option>
                          {Array.from({ length: 31 }, (_, index) => <option key={index + 1} value={`${index + 1 < 10 ? '0' : ''}${index + 1}`}>{index + 1}</option>)}
                        </select>
                      </div>
                      <div>
                        <label>MÊS:</label>
                        <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}  style={{border:"none", margin:"10px", padding:"10px", cursor:"pointer"}}>
                          <option value="">TODOS</option>
                          <option value="01">JANEIRO</option>
                          <option value="02">FEVEREIRO</option>
                          <option value="03">MARÇO</option>
                          <option value="04">ABRIL</option>
                          <option value="05">MAIO</option>
                          <option value="06">JUNHO</option>
                          <option value="07">JULHO</option>
                          <option value="08">AGOSTO</option>
                          <option value="09">SETEMBRO</option>
                          <option value="10">OUTUBRO</option>
                          <option value="11">NOVEMBRO</option>
                          <option value="12">DEZEMBRO</option>
                        </select>
                      </div>
                      <div>
                        <label>ANO:</label>
                        <select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)} style={{border:"none", margin:"10px", padding:"10px", cursor:"pointer"}}>
                          <option value="">TODOS</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                        </select>
                      </div>

                  </FormControl>

                </>
              }

        </Box>

        {/**GRID WITH PRODUCTS TO CHOOSE TO ADD IN COMPRA */}
        {
          thisCompra &&
          <Grid container spacing={3}>

          {filteredProducts?.map((product) => (
              <Grid key={product.id} xs={12} sm={6} md={3} >
                <ProductCard product={product} handleEditProduct={handleEditProduct} handleGetSale={handleGetSale} handleGetCompra={handleGetCompra} thisSale={thisSale} thisCompra={thisCompra} thisOs={thisOs} submitType={submitType} setSubmitType={setSubmitType} thisClient={thisClient} handleSetClient={handleSetClient} handleSetModalVenda={handleSetModalVenda} handleSetModalCompra={handleSetModalCompra} showModalVenda={showModalVenda} showModalCompra={showModalCompra} handleSetShowCart={handleSetShowCart} generateOs={generateOs}/>
              </Grid>
            ))
          }
  
    
          </Grid>
        }

        {/**GRID WITH COMPRAS ROWS*/}
        {
          !thisCompra &&
          <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>


              <UserTableHead rowCount={user?.clientes.length} 
                headLabel={[
                  { id: 'data', label: 'DATA' },
                  { id: 'nome_razao_social', label: 'NOME / RAZÃO SOCIAL' },
                  { id: 'total', label: 'TOTAL' },
                ]}
              />


              <TableBody>
                {comprasFiltradas?.map(row => ({
                  ...row,
                  createdAt: row.createdAt.split('/').reverse().join('-') 
                }))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((row) => {

                  const formattedDate = row.createdAt.split('-').reverse().join('/');

                  if (regsSituation === "all") {
                    const total = row.itemCompra.reduce((acc, item) => {
                      const preco = typeof item.cost !== 'undefined' ? parseFloat(item.cost) : 0;
                      const itemTotal = (preco - parseFloat(item.disccount));
                      return acc + itemTotal;
                    }, 0);

                    return (
                      <ComprasTableRow
                      key={row.id}
                      data={formattedDate} // Use the formatted date
                      nome_razao_social={row.supplier.nome_razao_social}
                      total={`R$ ${(total + parseFloat(row.dispatchValue)).toFixed(2)}`}
                      handleCompraToEdit={handleCompraToEdit}

                      />
                    );
                  } else if (regsSituation === "inactive" && row.active === false) {
                    const total = row.itemCompra.reduce((acc, item) => {
                      const preco = typeof item.cost !== 'undefined' ? parseFloat(item.cost) : 0;
                      const itemTotal = (preco - parseFloat(item.disccount));
                      return acc + itemTotal;
                    }, 0);

                    return (
                      <ComprasTableRow
                      key={row.id}
                      data={formattedDate} // Use the formatted date
                      nome_razao_social={row.supplier.nome_razao_social}
                      total={`R$ ${(total + parseFloat(row.dispatchValue)).toFixed(2)}`}
                      handleCompraToEdit={handleCompraToEdit}
                      />
                    );
                  } else if (regsSituation === "active" && row.active === true) {
                    const total = row.itemCompra.reduce((acc, item) => {
                      const preco = typeof item.cost !== 'undefined' ? parseFloat(item.cost) : 0;
                      const itemTotal = (preco - parseFloat(item.disccount));
                      return acc + itemTotal;
                    }, 0);

                    return (
                      <ComprasTableRow
                        key={row.id}
                        id={row.id}
                        data={formattedDate} // Use the formatted date
                        nome_razao_social={row.supplier.nome_razao_social}
                        total={`R$ ${(total + parseFloat(row.dispatchValue)).toFixed(2)}`}
                        handleCompraToEdit={handleCompraToEdit}
                      />
                    );
                  }
                })}


                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, user?.clientes.length)}
                />

              </TableBody>


            </Table>
          </TableContainer>
        </Scrollbar>
        }

      </>    
      }



      {/**MODAL TO SHOW COMPRA EDIT FORM */}
      {
        showEdit &&
        <CompraEditFormView compraToEdit={thisCompra?.id}/>
      }


      {
        !showAdd && !showEdit &&
        <ProductCartWidget deleteItemCompra={deleteItemCompra} thisCompra={thisCompra}/>

      }
    </Container>
  );
}
