/* eslint-disable */
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ProductCard from '../product-card';
import ProductTableToolbar from '../product-table-toolbar';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableContainer, TextField } from '@mui/material';
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
import { toast } from 'react-toastify';


function getDataAtualFormatada() {
  var data = new Date();
  var dia = data.getDate().toString().padStart(2, '0');
  var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
  var ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}

export default function ProductsView() {

    /** GET USER BY REQUEST IN BACKEND AND TAKES TOKEN FROM LOCALSTORAGE*/
    const [user, setUser] = useState(null);
    const user_id = localStorage.getItem('tejas.app.user_id');
    const token = localStorage.getItem('tejas.app.token');
    const user_name = localStorage.getItem('tejas.app.user_name');
    const [transferMode, setTransferMode] = useState(false);

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
    const [showCategorias, setShowCategorias] = useState(false);
    const [showModelos, setShowModelos] = useState(false);
    const [showMarcas, setShowMarcas] = useState(false);
    const [addEstoque, setAddEstoque] = useState(false);
    const [addCategoria, setAddCategoria] = useState(false);
    const [addMarca, setAddMarca] = useState(false);
    const [addModelo, setAddModelo] = useState(false);
    const [addingEstoque, setAddingEstoque] = useState("");
    const [addingMarca, setAddingMarca] = useState("");
    const [addingModelo, setAddingModelo] = useState("");
    const [addingCategoria, setAddingCategoria] = useState("");
    const [estoqueToRender, setEstoqueToRender] = useState("Todos");
    const [estoqueDestino, setEstoqueDestino] = useState("");
    const [transferItemsChecks, setTransferItemsChecks] = useState([]);
    const [transferItemsQties, setTransferItemsQties] = useState([]);
    const [categoria, setCategoria] = useState("Todas");
    const [marca, setMarca] = useState("Todas");
    const [modelo, setModelo] = useState("Todos");
    const [tamanho, setTamanho] = useState("Todas");

    const handleTransferItems = (type, id, value, estoque) => {

      
        if (type === "check") {
          let existingItem = transferItemsChecks.find(item => item.id === id);
          if (existingItem) {
            const novoArray = [...transferItemsChecks];
            const index = novoArray.findIndex(item => item.id === id);
            if (index !== -1) {
              const novoItem = { ...novoArray[index], value: value };
              novoArray[index] = novoItem;
              setTransferItemsChecks(novoArray);
              console.log(transferItemsChecks);
            }
          } else {
            // Adicione um novo item ao array se o índice não foi encontrado
            const novoItem = { id: id, value: value };
            setTransferItemsChecks(prevArray => [...prevArray, novoItem]);
            console.log(transferItemsChecks);
          }
        } else if (type === "qty") {
          let existingItem = transferItemsQties.find(item => item.id === id);
          if (existingItem) {
            const novoArray = [...transferItemsQties];
            const index = novoArray.findIndex(item => item.id === id);
            if (index !== -1) {
              const novoItem = { ...novoArray[index], value: value };
              novoArray[index] = novoItem;
              setTransferItemsQties(novoArray);
              console.log(transferItemsQties);
            }
          } else {
            // Adicione um novo item ao array se o índice não foi encontrado
            const novoItem = { id: id, value: value };
            setTransferItemsQties(prevArray => [...prevArray, novoItem]);
            console.log(transferItemsQties);
          }
          }
      
    }


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
        setProduct(null);
      }
  }; 


  const createEstoque = async (estoqueNome) => {

    let createData = {
      createdAt: getDataAtualFormatada(),
      lastEditted: getDataAtualFormatada(),
      changeMaker: user_name,

      nome: addingEstoque,

      user_id: user_id
    }



    try {

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await api.post("/estoque", createData, config);
  
      if (response.status === 201) {
        toast.success();
        toast.success("Estoque criado!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });

        getUser();  
        setAddingEstoque("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar estoque");
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

  const deleteEstoque = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.delete(`estoque/${id}`, config);


      if (response.status === 200) {
        toast.success("Estoque deletado!", {
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
      toast.error("Erro ao deletar estoque!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });
      setSubmitType("createSale")
      setThisSale(null);
      setThisOs(null);
      setThisClient(null);
    }
  };

  const transferItem = async (createData, id) => {
    try {
      // Define o cabeçalho da solicitação com o token de autenticação
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await api.patch(`/itemCompras/${id}`, createData, config);
  
      if (response.data) {
        toast.success("Item transferido com sucesso!");
        getUser();
        // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
        // Por exemplo, redirecionar para outra página.
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao transferir item");
      // Lida com o erro de forma apropriada, como exibir uma mensagem de erro.
    }
  };

  const transferItems = () => {
    const mapTransferItemsQties = new Map(transferItemsQties.map(item => [item.id, item]));
    const resultadoTransferItems = transferItemsChecks.map(itemChecks => ({
      id: itemChecks.id,
      state: itemChecks.value,
      qty: mapTransferItemsQties.get(itemChecks.id).value,
      origem: estoqueToRender,
      destino: estoqueDestino
    }));


    
    user?.produtos.map((produto)=>{

      let itemsTransfered = 0;

      resultadoTransferItems.map((itemToTransfer)=>{
        console.log(itemToTransfer)
        if(itemToTransfer.id === produto.id) {

          //console.log("Transfira " + itemToTransfer.qty + " itemCompra do produto com id: " + itemToTransfer.id + " cujo estoque esteja atualmente em " + itemToTransfer.origem + " e vai para " + itemToTransfer.destino)
       


          produto.ItemCompra.map((itemCompra) => {
            if (itemCompra.estoque === itemToTransfer.origem && itemsTransfered < itemToTransfer.qty) {
                itemsTransfered += 1;
                console.log("Altere o estoque de " + itemToTransfer.qty + " itens deste para: " + itemToTransfer.destino)     
                let createData = {estoque: itemToTransfer.destino}
                transferItem(createData, itemCompra.id)     
              }

          })
       
        }
      })

    })

  }




{/**  const handleOpenFilter = () => {    setOpenFilter(true);  };  const handleCloseFilter = () => {    setOpenFilter(false);  }; */}


  const handleEditProduct = (id) => {    getProduct(id);  }
  
useEffect(() => {

setFilteredProducts(user?.produtos);

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

        <Button variant="contained" color="inherit" style={showEstoques ? ({backgroundColor:"lightgray", color:"black"}) : {backgroundColor:"#00B8D9"}} onClick={()=>{setShowEstoques(!showEstoques); if(showCategorias === true){setShowCategorias(false)};  if(showModelos === true){setShowModelos(false)}; if(showMarcas === true){setShowMarcas(false)};}}>
            Estoques
        </Button>

        <Button variant="contained" color="inherit" style={showCategorias ? ({backgroundColor:"lightgray", color:"black"}) : {backgroundColor:"#00B8D9"}} onClick={()=>{setShowCategorias(!showCategorias); if(showEstoques === true){setShowEstoques(false)};  if(showModelos === true){setShowModelos(false)}; if(showMarcas === true){setShowMarcas(false)};}}>
            Categorias
        </Button>

        <Button variant="contained" color="inherit" style={showModelos ? ({backgroundColor:"lightgray", color:"black"}) : {backgroundColor:"#00B8D9"}} onClick={()=>{setShowModelos(!showModelos); if(showEstoques === true){setShowEstoques(false)};  if(showMarcas === true){setShowMarcas(false)}; if(showCategorias === true){setShowCategorias(false)};}}>
            Modelos
        </Button>

        <Button variant="contained" color="inherit" style={showMarcas ? ({backgroundColor:"lightgray", color:"black"}) : {backgroundColor:"#00B8D9"}} onClick={()=>{setShowMarcas(!showMarcas); if(showEstoques === true){setShowEstoques(false)};  if(showModelos === true){setShowModelos(false)}; if(showCategorias === true){setShowCategorias(false)};}}>
            Marcas
        </Button>
        

      </Box>

      <Box>
      
      {
        showEstoques && user?.estoques.length < 0 &&
          
          <p>Nenhum estoque cadastrado.</p>
          
      }
      {
        showCategorias && user?.categorias.length < 0 &&
          
          <p>Nenhuma categoria cadastrada.</p>
          
      }
      {
        showMarcas && user?.Marca.length < 0 &&
          
          <p>Nenhuma marca cadastrada.</p>
          
      }
      {
        showModelos && user?.Modelo.length < 0 &&
          
          <p>Nenhum modelo cadastrada.</p>
          
      }
      {
          showEstoques && user?.estoques.length > 0 &&  
          

            <Box style={{backgroundColor:"white", width:"100%", color:"black"}}>

              {
                            user?.estoques.map((estoque)=>{
                              return (
                                <Box style={{display:"flex", justifyContent:"space-between", alignContent:"center", alignItems:"center", backgroundColor:"lightgray"}}>
                                  <p style={{padding:"8px"}}>{estoque.nome.toUpperCase()}</p>
                                  <Button style={{backgroundColor:"red", color:"white"}} onClick={()=>{deleteEstoque(estoque.id)}}>X</Button>
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
        showCategorias &&
          <Box style={{backgroundColor:"white", padding:"8px"}}>
            <TextField label="Nome da categoria" onInput={(e)=>{setAddingCategoria(e.target.value)}}></TextField>
            <Button style={{backgroundColor:"lightblue", padding:"8px", margin:"8px"}} onClick={()=>{createCategoria(addingCategoria);}}>Criar</Button>
          </Box>

      }

      {
        showEstoques &&
          <Box style={{backgroundColor:"white", padding:"8px"}}>
            <TextField label="Nome do estoque" onInput={(e)=>{setAddingEstoque(e.target.value)}}></TextField>
            <Button style={{backgroundColor:"lightblue", padding:"8px", margin:"8px"}} onClick={()=>{createEstoque(addingEstoque);}}>Criar</Button>
          </Box>

      }


      
      {
        showMarcas &&
          <Box style={{backgroundColor:"white", padding:"8px"}}>
            <TextField label="Nome da marca" onInput={(e)=>{setAddingMarca(e.target.value)}}></TextField>
            <Button style={{backgroundColor:"lightblue", padding:"8px", margin:"8px"}} onClick={()=>{createMarca(addingMarca);}}>Criar</Button>
          </Box>

      }

      { 
        showModelos &&
          <Box style={{backgroundColor:"white", padding:"8px"}}>
            <TextField label="Nome do modelo" onInput={(e)=>{setAddingModelo(e.target.value); console.log(addingModelo)}}></TextField>
            <Button style={{backgroundColor:"lightblue", padding:"8px", margin:"8px"}} onClick={()=>{createModelo(addingModelo);}}>Criar</Button>
          </Box>

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
                        onChange={(e)=>{setVisuMode(e.target.value);setTransferMode(false);}}
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
                    value={estoqueToRender}
                    onChange={(e)=>{setEstoqueToRender(e.target.value); setTransferMode(false);}}
                  >
                    <MenuItem value={"Todos"}>Todos</MenuItem>
                    {
                      user?.estoques.map((estoque)=>{
                        return(
                          <MenuItem value={estoque.nome}>{estoque.nome}</MenuItem>
                        )
                      })
                    }
                  </Select>
        </FormControl>
        }

      <FormControl style={{minWidth: "200px", margin:"10px 20px"}}>
              <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>Categoria</InputLabel>
              <Select
                style={{minWidth: "200px"}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoria}
                onChange={(e)=>{setCategoria(e.target.value);}}
              >
                <MenuItem value={"Todas"}>Todas</MenuItem>
                {
                  user?.categorias.map((categoria)=>{
                    return(
                      <MenuItem value={categoria.id}>{categoria.nome}</MenuItem>
                    )
                  })
                }
              </Select>
        </FormControl>

        <FormControl style={{minWidth: "200px", margin:"10px 20px"}}>
              <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>Modelo</InputLabel>
              <Select
                style={{minWidth: "200px"}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={modelo}
                onChange={(e)=>{setModelo(e.target.value);}}
              >
                <MenuItem value={"Todos"}>Todos</MenuItem>
                {
                  user?.Modelo.map((modelo)=>{
                    return(
                      <MenuItem value={modelo.id}>{modelo.nome}</MenuItem>
                    )
                  })
                }
              </Select>
        </FormControl>

        <FormControl style={{minWidth: "200px", margin:"10px 20px"}}>
              <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>Marca</InputLabel>
              <Select
                style={{minWidth: "200px"}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={marca}
                onChange={(e)=>{setMarca(e.target.value);}}
              >
                <MenuItem value={"Todas"}>Todas</MenuItem>
                {
                  user?.Marca.map((marca)=>{
                    return(
                      <MenuItem value={marca.id}>{marca.nome}</MenuItem>
                    )
                  })
                }
              </Select>
        </FormControl>

        <FormControl style={{minWidth: "200px", margin:"10px 20px"}}>
              <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>Tamanho</InputLabel>
              <Select
                style={{minWidth: "200px"}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tamanho}
                onChange={(e)=>{setTamanho(e.target.value);}}
              >
                <MenuItem value={"Todas"}>Todos</MenuItem>
                <MenuItem value={"PP"}>PP</MenuItem>
                <MenuItem value={"P"}>P</MenuItem>
                <MenuItem value={"M"}>M</MenuItem>
                <MenuItem value={"G"}>G</MenuItem>
                <MenuItem value={"GG"}>GG</MenuItem>
                <MenuItem value={"G1"}>G1</MenuItem>
                <MenuItem value={"G2"}>G2</MenuItem>
                <MenuItem value={"G3"}>G3</MenuItem>
                <MenuItem value={"G4"}>G4</MenuItem>
                <MenuItem value={"G5"}>G5</MenuItem>

              </Select>
        </FormControl>






      </Box>

      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }} >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>

        </Stack>
      </Stack>





























      {
        visuMode === "store" &&     
       <Grid container spacing={3}>

      {filteredProducts?.map((product) => {
        let currentProduct = { ...product }; 
        let itemsToRender = [];
        console.log(product)

        if (regsSituation === "all" && estoqueToRender === "Todos" && (modelo === "Todos" || modelo === product.modeloId) && (marca === "Todas" || marca === product.marcaId) && (categoria === "Todas" || categoria === product.categoriaId) && (tamanho === "Todas" || tamanho === product.tamanho)) {
          return (
            <Grid key={product.id} xs={12} sm={6} md={3} >
              <ProductCard product={product} handleEditProduct={handleEditProduct}/>
            </Grid>
          );
        } else if (regsSituation === "all" && estoqueToRender !== "Todos" && (modelo === "Todos" || modelo === product.modeloId) && (marca === "Todas" || marca === product.marcaId) && (categoria === "Todas" || categoria === product.categoriaId) && (tamanho === "Todas" || tamanho === product.tamanho) ) {
          
          currentProduct.ItemCompra = currentProduct.ItemCompra.filter((itemCompra) => {
            if (itemCompra.estoque === estoqueToRender) {
              itemsToRender.push(itemCompra);
              return true;
            }
            return false;
          });

            return (
              <Grid key={currentProduct.id} xs={12} sm={6} md={3} >
                <ProductCard product={currentProduct} handleEditProduct={handleEditProduct}/>
              </Grid>
            );


        }

        return null; 
      })}


        {filteredProducts?.map((product) => {
                  let currentProduct = { ...product };  // Criar uma cópia do objeto para evitar mutações indesejadas
                  let itemsToRender = [];

            if (regsSituation === "active" && product.ItemCompra.length > 0 && estoqueToRender === "Todos" && (modelo === "Todos" || modelo === product.modeloId) && (marca === "Todas" || marca === product.marcaId) && (categoria === "Todas" || categoria === product.categoriaId) && (tamanho === "Todas" || tamanho === product.tamanho)) {
              return (
                <Grid key={product.id} xs={12} sm={6} md={3} >
                <ProductCard product={product} handleEditProduct={handleEditProduct}/>
              </Grid>
              )
            } else if (regsSituation === "active" && estoqueToRender !== "Todos" && (modelo === "Todos" || modelo === product.modeloId) && (marca === "Todas" || marca === product.marcaId) && (categoria === "Todas" || categoria === product.categoriaId) && (tamanho === "Todas" || tamanho === product.tamanho)) {
              currentProduct.ItemCompra = currentProduct.ItemCompra.filter((itemCompra) => {
                if (itemCompra.estoque === estoqueToRender) {
                  itemsToRender.push(itemCompra);
                  return true;
                }
                return false;
              });
    

              if (currentProduct.ItemCompra.length > 0) {
                return (
                  <Grid key={currentProduct.id} xs={12} sm={6} md={3} >
                    <ProductCard product={currentProduct} handleEditProduct={handleEditProduct}/>
                  </Grid>
                );
              }
    

            }
    
            // Adicione lógica aqui se necessário para outros casos
    
            return null; // Retorna null se nenhum caso for atendido
          })}

        
        {filteredProducts?.map((product) => (
          regsSituation === "inactive" && product.ItemCompra.length < 1 && (modelo === "Todos" || modelo === product.modeloId) && (marca === "Todas" || marca === product.marcaId) && (categoria === "Todas" || categoria === product.categoriaId) && (tamanho === "Todas" || tamanho === product.tamanho) &&
          <Grid key={product.id} xs={12} sm={6} md={3} >
            <ProductCard product={product} handleEditProduct={handleEditProduct}/>
          </Grid>
        ))
        }

        {
        filteredProducts?.length === 0 &&
          regsSituation === "all" && (modelo === "Todos" || modelo === product.modeloId) && (marca === "Todas" || marca === product.marcaId) && (categoria === "Todas" || categoria === product.categoriaId) && (tamanho === "Todas" || tamanho === product.tamanho) &&
            user?.produtos.map((product) => (
              <Grid key={product.id} xs={12} sm={6} md={3} >

            </Grid>
            ))
        }

        {
          filteredProducts?.length === 0 &&
            regsSituation === "active" && (modelo === "Todos" || modelo === product.modeloId) && (marca === "Todas" || marca === product.marcaId) && (categoria === "Todas" || categoria === product.categoriaId) && (tamanho === "Todas" || tamanho === product.tamanho) &&
              user?.produtos.map((product) => (
                product.active &&
                  <Grid key={product.id} xs={12} sm={6} md={3} >

                  </Grid>
              ))
        }

        {
          filteredProducts?.length === 0 &&
            regsSituation === "inactive" && (modelo === "Todos" || modelo === product.modeloId) && (marca === "Todas" || marca === product.marcaId) && (categoria === "Todas" || categoria === product.categoriaId) && (tamanho === "Todas" || tamanho === product.tamanho) &&
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
          {
            estoqueToRender !== "Todos" &&
            <Button style={{backgroundColor:"black", color:"white"}} onClick={()=>{setTransferMode(!transferMode); console.log(transferMode)}}>Transferir Itens</Button>
          }
          <Table sx={{ minWidth: 800 }}>
            


            {
              transferMode &&
              <UserTableHead rowCount={user?.clientes.length} 
              headLabel={[
                { id: 'checkbox', label: 'Selecionar' },
                { id: 'qtd', label: 'Qtd' },
                { id: 'cod', label: 'Cod' },
                { id: 'produto', label: 'Produto' },
                { id: 'estoque', label: 'Estoque' },
                { id: 'preco', label: 'Preço' },
              ]}
            />
            }

            {
              !transferMode &&
              <UserTableHead rowCount={user?.clientes.length} 
              headLabel={[
                { id: 'cod', label: 'Cod' },
                { id: 'produto', label: 'Produto' },
                { id: 'estoque', label: 'Estoque' },
                { id: 'preco', label: 'Preço' },
              ]}
            />
            }


            <TableBody>
              {filteredProducts.map(row => ({
                ...row,
                createdAt: row.createdAt.split('/').reverse().join('-') 
              }))
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((row) => {
                let currentProduct = { ...row };  // Criar uma cópia do objeto para evitar mutações indesejadas
                let itemsToRender = [];

                const formattedDate = row.createdAt.split('-').reverse().join('/');

                if (regsSituation === "all" && estoqueToRender === "Todos" && (modelo === "Todos" || modelo === row.modeloId) && (marca === "Todas" || marca === row.marcaId) && (categoria === "Todas" || categoria === row.categoriaId) && (tamanho === "Todas" || tamanho === row.tamanho)) {

                  return (
                    <ProductsTableRow
                    id={row.id}
                    key={row.id}
                    cod={row.cod}
                    transferMode={transferMode}
                    product={row.nome} 
                    total={`R$ ${row.preco}`}
                    estoque={row.ItemCompra.length - row.ItemVenda.length}
                    handleEditProduct={handleEditProduct}
                    handleTransferItems={handleTransferItems}
                    estoqueToRender={estoqueToRender}
                    />
                  );
                } else if (regsSituation === "inactive" && (row.ItemCompra.length - row.ItemVenda.length) < 1 && (modelo === "Todos" || modelo === row.modeloId) && (marca === "Todas" || marca === row.marcaId) && (categoria === "Todas" || categoria === row.categoriaId) && (tamanho === "Todas" || tamanho === row.tamanho)) {

                  return (
                    <ProductsTableRow
                    id={row.id}
                    key={row.id}
                    cod={row.cod}
                    product={row.nome} 
                    total={`R$ ${row.preco}`}
                    estoque={row.ItemCompra.length - row.ItemVenda.length}
                    handleEditProduct={handleEditProduct}
                    handleTransferItems={handleTransferItems}
                    estoqueToRender={estoqueToRender}
                    />
                  );
                } else if (regsSituation === "active" && (row.ItemCompra.length - row.ItemVenda.length) > 0 && estoqueToRender === "Todos" && (modelo === "Todos" || modelo === row.modeloId) && (marca === "Todas" || marca === row.marcaId) && (categoria === "Todas" || categoria === row.categoriaId) && (tamanho === "Todas" || tamanho === row.tamanho)) {

                  return (
                    <ProductsTableRow
                      id={row.id}
                      key={row.id}
                      cod={row.cod}
                      product={row.nome} 
                      total={`R$ ${row.preco}`}
                      estoque={row.ItemCompra.length - row.ItemVenda.length}
                      handleEditProduct={handleEditProduct}
                      handleTransferItems={handleTransferItems}
                      estoqueToRender={estoqueToRender}
                    />
                  );
                } else if (regsSituation === "all" && estoqueToRender !== "Todos" && (modelo === "Todos" || modelo === row.modeloId) && (marca === "Todas" || marca === row.marcaId) && (categoria === "Todas" || categoria === row.categoriaId) && (tamanho === "Todas" || tamanho === row.tamanho)) {
                  currentProduct.ItemCompra = currentProduct.ItemCompra.filter((itemCompra) => {
                    if(itemCompra.estoque === estoqueToRender) {
                      itemsToRender.push(itemCompra);
                      return true;
                    }
                    return false;
                  })
                  return (
                            <ProductsTableRow
                            id={row.id}
                            key={currentProduct.id}
                            cod={currentProduct.cod}
                            transferMode={transferMode}
                            product={currentProduct.nome} 
                            total={`R$ ${currentProduct.preco}`}
                            estoque={currentProduct.ItemCompra.length - currentProduct.ItemVenda.length}
                            handleEditProduct={handleEditProduct}
                            handleTransferItems={handleTransferItems}
                            estoqueToRender={estoqueToRender}
                            />
                          );
                } else if (regsSituation === "active" && estoqueToRender !== "Todos" && (modelo === "Todos" || modelo === row.modeloId) && (marca === "Todas" || marca === row.marcaId) && (categoria === "Todas" || categoria === row.categoriaId) && (tamanho === "Todas" || tamanho === row.tamanho)) {
                  currentProduct.ItemCompra = currentProduct.ItemCompra.filter((itemCompra) => {
                    if (itemCompra.estoque === estoqueToRender) {
                      itemsToRender.push(itemCompra);
                      return true;
                    }
                    return false;
                  })
                  if (currentProduct.ItemCompra.length > 0) {
                    return (
                        <ProductsTableRow
                        id={row.id}
                        key={currentProduct.id}
                        cod={currentProduct.cod}
                        transferMode={transferMode}
                        product={currentProduct.nome} 
                        total={`R$ ${currentProduct.preco}`}
                        estoque={currentProduct.ItemCompra.length - currentProduct.ItemVenda.length}
                        handleEditProduct={handleEditProduct}
                        handleTransferItems={handleTransferItems}
                        estoqueToRender={estoqueToRender}
                        />
                    );
                  }
                }
              })}


            </TableBody>


          </Table>
        </TableContainer>

        {
                transferMode &&
                <Box style={{display:"flex", justifyContent:"center"}}>
                  <FormControl style={{minWidth: "200px", margin:"10px 20px"}}>
                                      <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>Estoque Destino</InputLabel>
                                      <Select
                                        style={{minWidth: "200px"}}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={estoqueDestino}
                                        onChange={(e)=>{setEstoqueDestino(e.target.value);}}
                                      >
                                        <MenuItem value={"Todos"}>Todos</MenuItem>
                                        {
                                          user?.estoques.map((estoque)=>{
                                            return(
                                              estoque.nome !== estoqueToRender &&
                                              <MenuItem value={estoque.nome}>{estoque.nome}</MenuItem>
                                            )
                                          })
                                        }
                                      </Select>
                  </FormControl>
                  <Button style={{backgroundColor:"green", color:"white"}} onClick={transferItems}>Transferir</Button>
                </Box>
              }
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
