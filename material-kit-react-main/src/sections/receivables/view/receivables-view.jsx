/* eslint-disable */
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ProductCard from '../receivables-card';
import ProductTableToolbar from '../receivables-table-toolbar';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Table, TableBody, TableContainer, TextField } from '@mui/material';
import Iconify from 'src/components/iconify';
import api from 'src/services/api';
import ProductCartWidget from '../receivables-cart-widget';
import { ToastContainer, toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import Scrollbar from 'src/components/scrollbar';
import UserTableHead from 'src/sections/clients/clients-table-head';
import { emptyRows } from '../../clients/utils';
import TableEmptyRows from 'src/sections/clients/table-empty-rows';
import ReceivablesTableRow from '../receivables-table-row';
import { VendaEditFormView } from '../receivablesEditForm';
import ReceivableEditFormView from '../receivablesEditForm/receivables-edit-form-view';

{/**FUNÇÃO QUE RETORNA A DATA ATUAL FORMATADA*/}
function getDataAtualFormatada() {
  var data = new Date();
  var dia = data.getDate().toString().padStart(2, '0');
  var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
  var ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}

export default function ReceivablesView() {

      /**STATES FOR THIS COMPONENT */
      const [generateOs, setGenerateOs] = useState(false);

      /**RENDERED ENTITIES */
      const [product, setProduct] = useState(null);
      const [thisSale, setThisSale] = useState(null);
      const [thisReceivable, setThisReceivable] = useState(null);
      const [thisOs, setThisOs] = useState(null);
      const [saleToEdit, setSaleToEdit] = useState(null);
      const [receivableToEdit, setReceivableToEdit] = useState(null);
      const [thisClient, setThisClient] = useState(null);
      const [user, setUser] = useState(null);
      const [showReceivableInputs, setShowReceivableInputs] = useState(false);
      const [qtyParcelas, setQtyParcelas] = useState(1);
      const [dates, setDates] = useState(Array(parseInt(qtyParcelas)).fill(''));

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

      /**DATA TO ADD */
      const [currentClientId, setCurrentClientId] = useState("");
      const [currentAmount, setCurrentAmount] = useState("");
      const [currentDescription, setCurrentDescription] = useState("");

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

      const handleDateChange = (index) => (event) => {
        let input = event.target.value;
        input = input.replace(/\D/g, ''); // remove non-digits
        input = input.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3'); // add slashes
    
        const newDates = [...dates];
        newDates[index] = input;
        setDates(newDates);
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
      const receivablesFiltrados = user?.receivables
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
      const [showModalReceivable, setShowModalReceivable] = useState(false);
      const [showCart, setShowCart] = useState(false);

      /**FORM SUBMIT STUFF */
      const url = "receivables"
      const urlEdit = url + `/${thisReceivable?.id}`;
      const [submitType, setSubmitType] = useState('createReceivable');
      const { register, handleSubmit, reset, formState: { errors }  } = useForm({});
      const onFormSubmit = (formData) => {

        if (submitType === "createReceivable") {

          formData.createdAt = getDataAtualFormatada();
          formData.lastEditted = getDataAtualFormatada();
          formData.changeMaker = user_name;

          //dueDate
          formData.status = "Pendente"
          //amount
          formData.active = true;
          formData.receivements = [];
          //description

          formData.user_id = user_id;
          formData.client_id = thisClient?.id;
          formData.venda_id = thisVenda?.id;

          createReceivable(formData)


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
    const handleSetModalReceivable = (bool) => {
      setShowModalReceivable(bool);
    }
    const handleSetClient = (data) => {
      setThisClient(data);
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
      const filteredClients = user?.receivables.filter((receivable) => {
        return receivable.client.nome_razao_social.includes(string);
      });
      setFilteredClients(filteredClients);
    }      
  }

  /**CREATE VENDA REQUEST IN BACKEND */
  const createOs = async (createData) => {


      createData.descricao = createData.description;
      delete createData.description;
      createData.status = "Aguardando Arte"
      createData.mockup = "data:image/png;base64,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"
      createData.active = true;

      console.log(createData)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.post("os", createData, config);
      if (response.data) {
        toast.success("Ordem de serviço gerada!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
        setThisOs(response.data)
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
    }
  };

  /**CREATE VENDA REQUEST IN BACKEND */
  const deleteOs = async () => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.delete(`os/${thisOs.id}`,  config);
      if (response.status === 200) {
        toast.success("Ordem de serviço deletada!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
        setThisOs(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao deletar ordem de serviço!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });
      setThisOs(null);
    }
  };

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
        createData.venda_id = response.data.id;
        if(generateOs){
          createOs(createData);
        }
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

  /**CREATE RECEIVABLE REQUEST IN BACKEND */
  const createReceivable = async (createData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.post(url, createData, config);
      if (response.data) {
        toast.success("Título a Receber gerado com sucesso!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
        handleSetModalReceivable(false);
        setTimeout(() => {
          setShowCart(true);
          handleGetSale(response.data.id);
          reset();
          getUser();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar título a receber!", {
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

  /**DELETE VENDA REQUEST IN BACKEND */
  const deleteVenda = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.delete(`${url}/${thisSale.id}`, config);
      console.log("to deletano")
      console.log(response)
      if (response.status === 200) {
        toast.success("Venda cancelada!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
        handleSetModalVenda(false);
        setThisSale(null);
        setThisOs(null);
        setThisClient(null);

        setTimeout(() => {
          setSubmitType("createReceivable");
          reset();
          getUser();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cancelar venda!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });
      setSubmitType("createReceivable")
      setThisSale(null);
      setThisOs(null);
      setThisClient(null);
    }
  };

  /**DELETE RECEIVABLE REQUEST IN BACKEND */
  const deleteReceivable = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.delete(`${url}/${thisReceivable.id}`, config);
      if (response.status === 200) {
        toast.success("Título a Receber excluído!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
        handleSetModalReceivable(false);
        setThisReceivable(null);
        setThisOs(null);
        setThisClient(null);

        setTimeout(() => {
          reset();
          getUser();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cancelar título a receber!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });
      setThisReceivable(null);
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

  /** GET RECEIVABLE BY REQUEST IN BACKEND*/
  const getReceivable = async (id) => {
    try {
      const response = await api.get(`/${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.data){
          setThisReceivable(response.data); 
          setReceivableToEdit(response.data.id)
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
      const response = await api.delete(`itemVendas/${itemId}`, config);
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

  /**HANDLE SALE TO EDIT */
  const handleSaleToEdit = (id) => {
    getSale(id);
    setSaleToEdit(id);
    setShowEdit(true);
    setShowAdd(false);
  }

  /**HANDLE SALE TO EDIT */
  const handleReceivableToEdit = (id) => {
    getReceivable(id);
    setReceivableToEdit(id);
    setShowEdit(true);
    setShowAdd(false);
  }

  /**HANDLE GET SALE */
  const handleGetSale = (id) => {
    getSale(id)
  }

  /**HANDLE GET RECEIVABLE */
  const handleGetReceivable= (id) => {
    getReceivable(id)
  }

  const handleCreateReceivable = () => {

    dates.map((date, index)=>{

      let createData = {
        createdAt : getDataAtualFormatada(),
        lastEditted: getDataAtualFormatada(),
        changeMaker: user_name,

        dueDate: date,
        status: "Pendente",
        amount: (parseFloat(currentAmount) / dates.length).toString(),
        active: true,
        receivements: [],
        description: dates.length > 1 ? currentDescription + ` Parcela ${index + 1}` : currentDescription,

        user_id: user_id,
        client_id: thisClient.id,
  
      }

      createReceivable(createData)

    })


  }

  useEffect(() => {  setFilteredProducts(user?.produtos)  }, [user, thisReceivable])
  
  return (
    <Container>
      <ToastContainer/>
      
        {/**ADD RECEIVABLE MODAL */}
        {
          showModalReceivable &&
            <div style={{position:"absolute", top:"0", left:"0", zIndex: 9999, backgroundColor:"#F9FAFA", width:"100%", height:"100%", padding:"10px"}}>
              <button style={{backgroundColor:"red", color:"white", border:"none", padding:"8px", borderRadius:"8px", cursor:"pointer"}} onClick={()=>{window.location.reload()}}>X</button>
              <h3>Novo Título a Receber:</h3>

            {
              !thisClient &&
              <TextField fullWidth label="Digitar Cliente" id="client_id" inputProps={{ maxLength: 400 }} onInput={(e) => {e.target.value =  e.target.value.toUpperCase(); setShowTypedClientResults(true); setFilteredClientsByTyping(e.target.value)}} {...register("client_id")} />
            }
          
            {
              showTypedClientResults && !thisClient &&
                filteredClients?.map((client)=>{
                  return (
                    <p style={{cursor:"pointer", backgroundColor:"lightgray", padding:"5px", borderRadius:"8px"}} key={client.id} onClick={()=>{getClient(client.id); setCurrentClientId(client.id);}}>{client.nome_razao_social}</p>
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
                        {thisClient?.nome_razao_social}
                      </p>
                      <TextField
                        fullWidth
                        label="Descrição"
                        id="description"
                        inputProps={{ maxLength: 400 }}
                        onInput={(e) => { e.target.value = e.target.value.toUpperCase(); setShowTypedClientResults(true); setFilteredClientsByTyping(e.target.value); setCurrentDescription(e.target.value); }}
                        {...register("description")}
                      />
                    </div>
                    <button
                      onClick={()=>{setShowModalReceivable(false); setShowReceivableInputs(true);}}
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
                      Inserir Valores
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
                  Títulos a Receber
                </Typography>

                <h2>{thisClient?.nome_razao_social}</h2>

                {
                  !showReceivableInputs ?
                  (
                    <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>{handleSetModalReceivable(true)}}>
                      Novo Título a Receber
                    </Button>
                  )
                  :
                  (
                    <Button variant="contained" color="inherit" style={{backgroundColor:"brown"}} onClick={()=>{location.reload()}}>
                      Cancelar
                    </Button>
                  )
                }

                {
                  thisReceivable &&
                  <>
                    <p style={{fontWeight:"bold"}}>{thisReceivable.client.nome_razao_social}</p>
                    <Button variant="contained" color="inherit" style={{backgroundColor:"brown"}} onClick={()=>{deleteReceivable()}}>
                      Cancelar Título
                    </Button>
                  </>
                }


          </Box>


          <Box sx={{display:"flex", flexWrap:"wrap", justifyContent:"center", alignContent:"center", alignItems:"center", bgcolor:"white", borderRadius:"8px"}}>
            {
              thisReceivable &&
              <ProductTableToolbar numSelected={0} filterName={filterName} onFilterName={handleFilterByName} />
            }
            {
              !thisReceivable &&
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

          {
            !showReceivableInputs ?
            (
              <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>


                  <UserTableHead rowCount={user?.clientes.length} 
                    headLabel={[
                      { id: 'data', label: 'Data' },
                      { id: 'nome_razao_social', label: 'Nome / Razão Social' },
                      { id: 'dueDate', label: 'Data de Vencimento' },
                      { id: 'total', label: 'Total' },
                    ]}
                  />


                  <TableBody>
                    {receivablesFiltrados?.map(row => ({
                      ...row,
                      createdAt: row.createdAt.split('/').reverse().join('-') // Change date format to "YYYY-MM-DD"
                    }))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((row) => {
                      const formattedDate = row.createdAt.split('-').reverse().join('/'); 
                      if (regsSituation === "all") {
                        console.log(row)
                        const total = row.itens?.reduce((acc, item) => {
                          const preco = typeof item.produto.preco !== 'undefined' ? parseFloat(item.produto.preco) : 0;
                          const qty = typeof item.qty !== 'undefined' ? parseFloat(item.qty) : 0;
                          const itemTotal = (preco - parseFloat(item.disccount)) * qty;
                          return acc + itemTotal;
                        }, 0);

                        return (
                          <ReceivablesTableRow
                          key={row.id}
                          data={formattedDate} // Use the formatted date
                          nome_razao_social={row.client.nome_razao_social}
                          total={`R$ ${row.amount}`}
                          dueDate={row.dueDate}
                          handleReceivableToEdit={handleReceivableToEdit}
                          />
                        );
                      } else if (regsSituation === "inactive" && row.active === false) {
                        const total = row.itens.reduce((acc, item) => {
                          const preco = typeof item.produto.preco !== 'undefined' ? parseFloat(item.produto.preco) : 0;
                          const qty = typeof item.qty !== 'undefined' ? parseFloat(item.qty) : 0;
                          const itemTotal = (preco - parseFloat(item.disccount)) * qty;
                          return acc + itemTotal;
                        }, 0);

                        return (
                          <ReceivablesTableRow
                          key={row.id}
                          data={formattedDate} // Use the formatted date
                          nome_razao_social={row.client.nome_razao_social}
                          total={`R$ ${row.amount}`}
                          dueDate={row.dueDate}
                          handleReceivableToEdit={handleReceivableToEdit}
                          />
                        );
                      } else if (regsSituation === "active" && row.active === true) {
                        const total = row.itens?.reduce((acc, item) => {
                          const preco = typeof item.produto.preco !== 'undefined' ? parseFloat(item.produto.preco) : 0;
                          const qty = typeof item.qty !== 'undefined' ? parseFloat(item.qty) : 0;
                          const itemTotal = (preco - parseFloat(item.disccount)) * qty;
                          return acc + itemTotal;
                        }, 0);

                        return (
                          <ReceivablesTableRow
                          key={row.id}
                          data={formattedDate} // Use the formatted date
                          nome_razao_social={row.client.nome_razao_social}
                          total={`R$ ${row.amount}`}
                          dueDate={row.dueDate}
                          handleReceivableToEdit={handleReceivableToEdit}
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
            )
            :
            (
              <Box>
                      <Typography variant="h6" gutterBottom>
        Preencha os valores a receber
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            {...register("amount")}
            label="Quantia Total"
            fullWidth
            autoComplete="given-name"
            variant="standard"
            onInput={(e)=>{setCurrentAmount(e.target.value)}}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            onInput={(e)=>{
              if (e.target.value !== "") {
                setQtyParcelas(e.target.value); console.log(qtyParcelas);
              } else {
                setQtyParcelas(1);
              }
            }}
            label="Qtd Parcelas"
            fullWidth
            autoComplete="family-name"
            variant="standard"
          />
        </Grid>
        {
          Array.from({length: parseInt(qtyParcelas)}, (v, i) => i).map((parcela, index)=>{
            return(
              <Grid item xs={12} sm={6} key={index}>
              <TextField
                required
                id={`address${index}`}
                name={`address${index}`}
                label={`Data de Vencimento da Parcela ${index + 1}`}
                fullWidth
                autoComplete="shipping address-line1"
                variant="standard"
                value={dates[index]}
                onChange={handleDateChange(index)}
              />
            </Grid>
            )
          })
        }

      </Grid> 
      <Button style={{backgroundColor:"green", color:"white", margin:"20px 0"}} onClick={()=>{handleCreateReceivable()}}>Criar</Button>
              </Box>
              
            )
          }

        </>    
        }

        {
          showEdit &&
          <ReceivableEditFormView receivableToEdit={receivableToEdit} updateReceivable={getReceivable}/>
        }

        {
          !showAdd && !showEdit &&
          <ProductCartWidget thisSale={thisSale} deleteItemVenda={deleteItemVenda}/>

        }

    </Container>
  );
}
