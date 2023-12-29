/* eslint-disable */
import { Box, Button, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Label from 'src/components/label';
import { useForm } from 'react-hook-form';
import api from 'src/services/api';
import { ToastContainer, toast } from "react-toastify";
import { Toastify } from 'toastify';
import "react-toastify/dist/ReactToastify.css";

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 999,
  right: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(16),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: Number(theme.shape.borderRadius) * 2,
  borderBottomLeftRadius: Number(theme.shape.borderRadius) * 2,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 },
}));
function getDataAtualFormatada() {
  var data = new Date();
  var dia = data.getDate().toString().padStart(2, '0');
  var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
  var ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}



export default function CartWidget({thisSale, deleteItemVenda, thisOs}) {
  //FORM INPUTS CONFIGURATIONS
  let url = "/clientes"

  //GET FROM LOCALSTORAGE
  const user_id = localStorage.getItem('tejas.app.user_id');
  const token = localStorage.getItem('tejas.app.token');
  const user_name = localStorage.getItem('tejas.app.user_name');





  //STATES FOR THIS COMPONENT
  const [user, setUser] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [receivableMode, setReceivableMode] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [parcelas, setParcelas] = useState(1);
  const [formaPagamentoParcelas, setFormaPagamentoParcelas] = useState(Array(parcelas).fill([]));
  const [dueDates, setDueDates] = useState([`${getDataAtualFormatada()}`]);
  const [dispatchValue, setDispatchValue] = useState(0);
  const [generateReceivables, setGenerateReceivables] = useState(true);

  const [generateDispatch, setGenerateDispatch] = useState(false);
  const [showForm, SetShowForm] = useState("new");
  const [receivablesToGet, setReceivablesToGet] = useState([]);
  const [choosePayMethod, setChoosePayMethod] = useState(false);
  const [receivingItem, setReceivingItem] = useState(null);
  let newArrayDueDates = []








/**CART SHOW AND HIDE */
  const cartModalFlipFlop = () => {
    setShowCartModal(!showCartModal);
  }









  /**CREATE VENDA REQUEST IN BACKEND */
  const addDispatchValue = async (id, createData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.patch(`vendas/${id}`, createData, config);
      if (response.data) {
        toast.success("Valor do frete adicionado!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar frete!", {
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








 /** GET USER BY REQUEST IN BACKEND AND TAKES TOKEN FROM LOCALSTORAGE*/
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
        //setUser(null);
        //se der erro setar botao login
      }
    }
  }; 
  
  React.useEffect(() => {
  getUser();
  }, []);





/**CREATE RECEIVABLE REQUEST IN BACKEND */
  const createReceivable = async (createData) => {
    console.log("agora verifica a cacilda do valor do frete")
    console.log(thisSale.dispatchValue)
    console.log(dispatchValue.toString())

    if(thisSale.dispatchValue === "0") {
      addDispatchValue(thisSale.id, {dispatchValue: dispatchValue.toString()})
    }

    try {
      // Define o cabeçalho da solicitação com o token de autenticação
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await api.post("/receivables", createData, config);
  
      if (response.status === 201) {
        toast.success();
        toast.success("Título a receber cadastrado com sucesso!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });

        setCheckoutStep(checkoutStep + 1)
        getUser();
        
        const receivablesIdArray = [...receivablesToGet];
        receivablesIdArray.push(response.data.id)
        setReceivablesToGet((prevReceivables) => {
          return [...prevReceivables, response.data.id];
        });
  
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar título a receber");
    }
  };





/**PATCH REQUEST TO ADD RECEIVEMENT TO A RECEIVABLE */
const receiveValue = async (createData) => {

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.patch(`/receivables/${receivingItem.id}`, createData, config);

    if (response.status === 200) {
      toast.success();
      toast.success("Valor recebido com sucesso!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });

      getUser();
      setReceivingItem(null);
      reset();
      
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao receber valor");
  }
};







  /**USE FORM FROM REACT HOOK FORMS */
  const { register, handleSubmit, reset } = useForm({
    //resolver: zodResolver(LoginUserSchema),
  });






  /**ON FORM SUBMIT FUNCTION */
  const onFormSubmit = (formData) => {


    if (dueDates.length < parcelas) {

      for (let i = 0; i < parcelas; i++) { 
      let currentDueDate = getDataAtualFormatada();
      newArrayDueDates.push(currentDueDate);
      }

      if(!receivableMode) { 






      
        newArrayDueDates.forEach((item, index)=>{
  
        formData.createdAt = getDataAtualFormatada();
        formData.lastEditted = getDataAtualFormatada();
        formData.changeMaker = user_name;
  
        formData.dueDate = item;
        formData.status = "Pendente";
        formData.amount = `${thisSale?.itens.reduce((total,item)=>{const precoComDesconto=item.produto.preco-item.disccount;const subtotal=((precoComDesconto*item.qty) + (dispatchValue / thisSale.itens.length));return total+subtotal;}, 0) / parcelas}`;
        formData.active = true;
        formData.receivements = [];
        formData.description = "Título gerado a partir de uma venda"
  
        formData.user_id = user_id;
        formData.client_id = thisSale?.client_id;
        formData.venda_id = thisSale?.id;
  
        createReceivable(formData)
      })
  
      setTimeout(() => {
        setReceivableMode(true);
      }, 1000);
   
      } else {
  
  
        let currentReceivement = `data:${getDataAtualFormatada()}, amount:${formData.receivingAmount}, type:${formaPagamentoParcelas[0]}, user:${user_name}`
        delete formData.amount;
        delete formData.receivingAmount;
        formData.receivements = receivingItem.receivements
        formData.receivements.push(currentReceivement);
        receiveValue(formData)
      }



    } else if (dueDates.length === parcelas) {
      console.log("gere as dueDates digitadas: ")
      console.log(dueDates)
      for (let i = 0; i < dueDates.length; i++) { 
      let currentDueDate = dueDates[i];
      newArrayDueDates.push(currentDueDate);

      
      }

      if(!receivableMode) { 



      
        dueDates.forEach((item, index)=>{
  
        formData.createdAt = getDataAtualFormatada();
        formData.lastEditted = getDataAtualFormatada();
        formData.changeMaker = user_name;
  
        formData.dueDate = item;
        formData.status = "Pendente";
        formData.amount = `${thisSale?.itens.reduce((total,item)=>{const precoComDesconto=item.produto.preco-item.disccount;const subtotal=((precoComDesconto*item.qty) + (dispatchValue / thisSale.itens.length));return total+subtotal;}, 0) / parcelas}`;
        formData.active = true;
        formData.receivements = [];
        formData.description = "Título gerado a partir de uma venda"
  
        formData.user_id = user_id;
        formData.client_id = thisSale?.client_id;
        formData.venda_id = thisSale?.id;

        console.log("ca estou")
        console.log(formData)
  
        createReceivable(formData)

      })
  
      setTimeout(() => {
        setReceivableMode(true);
      }, 1000);
   
      } else {
  
  
        let currentReceivement = `data:${getDataAtualFormatada()}, amount:${formData.receivingAmount}, type:${formaPagamentoParcelas[0]}, user:${user_name}`
        delete formData.amount;
        delete formData.receivingAmount;
        formData.receivements = receivingItem.receivements
        formData.receivements.push(currentReceivement);
        receiveValue(formData)
      }
    }




  
  } 
       
 



  /**SETS THE PAYMENT METHOD ON THE MOMENT OF RECEIVING */
  const handleReceivablesChange = ( formaPagamento) => {
    setFormaPagamentoParcelas(prevState => {
      const updatedFormaPagamentoParcelas = [...prevState];
      updatedFormaPagamentoParcelas[0] = formaPagamento;
      return updatedFormaPagamentoParcelas;
    });
  };
  


  return (
    <>
    <ToastContainer/>
    <StyledRoot onClick={cartModalFlipFlop}>
      <Badge showZero badgeContent={thisOs?.itens.length || 0} color="error" max={99}>
        <Iconify icon="eva:file-text-outline" width={24} height={24} />
      </Badge>
    </StyledRoot>





    
{/**
 * IF CART IS SHOWN, RENDER ALL THIS
 * 
 */}
    {
      showCartModal && 
      <div style={{backgroundColor:"black", position:"fixed", top:"0",left:"0", width:"100vw", height:"100%", zIndex:"9999", display:"flex", justifyContent:"center", alignItems:"flex-start"}}>






{/**TITLE */}
        <div style={{color:"white", width:"100%"}}>
          <div style={{display:"flex", width:"100%", justifyContent:"space-between", position:"absolute", top:"0", left:"0"}}>
            <h1 style={{margin:"0", padding:"0", textShadow:"1pt 1pt 5pt black"}}></h1>
            <button style={{height:"50px", width:"50px", backgroundColor:"brown", color:"white", fontWeight:"bold", border:"none", cursor:"pointer", borderBottomLeftRadius:"40px"}} onClick={cartModalFlipFlop}>X</button>
          </div>






{/**TABLE WITH CART CONTENT */}
          <TableContainer component={Paper}>
            




{/**RENDER ITEMS IN CART, 
 *  
 **/}


            {
              /**
               * RECEIVABLE MODE STARTS FALSE, BECAUSE IT IS NEEDED TO CREATE A RECEIVABLE FIRST, AND THEN RECEIVE IT.
               * THIS BLOCK OF CODE RENDERS THE CART ITENS 
               * AND HAS A CONDITIONAL FOR DISPATCHMENT VALUES
               */
            }
            {
              <Table sx={{ minWidth: 600 }} aria-label="spanning table">

              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    ITENS DA ORDEM DE SERVIÇO
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow style={{height:"100%", padding:"0"}}>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Qtd</TableCell>
                  <TableCell align="center">Descrição</TableCell>
                  <TableCell align="center">Tipo de Arte</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Mockup</TableCell>
                  <TableCell align="right">...</TableCell>
                </TableRow>
              </TableHead>

              <TableBody style={{height:"100px", overflow:"scroll"}}>


                {thisOs?.itens.map((row) => (
                  <TableRow key={row.id}> 
                    <TableCell>{row.produto.nome}</TableCell>
                    <TableCell align="right">{row.qtd}</TableCell>
                    <TableCell align="center">{row.descricao}</TableCell>
                    <TableCell align="center">{row.tipo_arte}</TableCell>
                    <TableCell align="center" style={{backgroundColor: row.status === "Aguardando Arte" && 'orange'}}>{row.status}</TableCell>
                    <TableCell align="right" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center", alignItems:"center"}}>
                      <img style={{height:"80px", margin:"5px"}} src={row.mockup === "" ? "https://img.freepik.com/psd-gratuitas/molduras-de-fotos_53876-57749.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1703116800&semt=ais" : row.mockup}/>
                      <button>+</button>
                    </TableCell>
                    <TableCell align="right"><button style={{backgroundColor:"brown", color:"white", border:"none", padding:"15px", borderRadius:"8px", fontWeight:"bolder", cursor:"pointer"}} onClick={()=>{deleteItemVenda(row.id); setParcelas(0); setFormaPagamentoParcelas([]); setCheckoutStep(0);}} >X</button></TableCell>

                  </TableRow>
                ))}

                <TableRow >





                  {
                    generateDispatch &&
                    <TableCell align='right'> 
                    <TextField style={{width:"110px"}} align="right" label='Valor Frete' onChange={(e)=>{setDispatchValue(e.target.value)}}/> 
                  </TableCell>
                  }





                 
                </TableRow>

              </TableBody>

              </Table>
            }

{
              <Table sx={{ minWidth: 600 }} aria-label="spanning table">

              <TableHead>
                <TableRow>
                <TableCell align="center" colSpan={6}>
                    INSTRUÇÕES
                  </TableCell>
                  <TableCell align="center" colSpan={6}>
                    <button style={{backgroundColor:"green", color:"white", border:"none", padding:"8px", borderRadius:"8px", cursor:"pointer"}}>+ Nova Instrução</button>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>

              <TableBody style={{height:"100px", overflow:"scroll"}}>


                {thisOs?.instrucoes.map((row) => (
                  <TableRow key={row.id}> 
                    <TableCell>{row.produto.nome}</TableCell>
                    <TableCell align="right">{row.qtd}</TableCell>
                    <TableCell align="center">{row.descricao}</TableCell>
                    <TableCell align="center">{row.tipo_arte}</TableCell>
                    <TableCell align="center" style={{backgroundColor: row.status === "Aguardando Arte" && 'orange'}}>{row.status}</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"><button style={{backgroundColor:"brown", color:"white", border:"none", padding:"15px", borderRadius:"8px", fontWeight:"bolder", cursor:"pointer"}} onClick={()=>{deleteItemVenda(row.id); setParcelas(0); setFormaPagamentoParcelas([]); setCheckoutStep(0);}} >X</button></TableCell>

                  </TableRow>
                ))}

                <TableRow >

                 
                </TableRow>

              </TableBody>

              </Table>
            }



            {
              /**
               * WHEN RECEIVABLE MODE IS ON, IS BECAUSE RECEIVABLE IS CREATED AND THEN IT'S TIME TO RECEIVE IT 
               * RENDER ALL INSIDE THIS BLOCK OF CODE
               */
            }





            {/**CHECKOUT STEPS
             *  0) GENERATE ITEMS / 
             *  1) GENERATE NUMBER OF INSTALLMENTS /
             *  2) CHOOSE DUE DATES
             **/}


            {
              checkoutStep === 2 && (
                <Box>
                  {/* ... (outros elementos) */}
                  <form onSubmit={handleSubmit(onFormSubmit)} style={{height:"100%", overflow:"scroll", }}>
                  {Array.from({ length: parcelas }).map((_, index) => (
                    <div style={{ display: "flex", flexDirection:"row", backgroundColor:"lightgray", width:"25%" }}>
                      <p>Parcela {index + 1} : R$ {((thisSale?.itens.reduce((total, item) => {
                        const precoComDesconto = item.produto.preco - item.disccount;
                        const subtotal = ((precoComDesconto * item.qty));
                        return total + subtotal;
                      }, 0)) / parcelas + (dispatchValue / parcelas)).toFixed(2)}</p>
                      <FormGroup sx={{ margin: "0 0" }} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px", flexWrap: "nowrap", maxHeight:"80px" }}>
                        {/* Substituir os Checkbox por Select */}

                        <TextField
                          placeholder='01/01/2018'
                          label='Data Vencimento'
                          defaultValue={getDataAtualFormatada()}
                          style={{margin:"10px 0"}}
                          value={dueDates[index]}
                          onChange={(e) => {
                            const newDueDates = [...dueDates];
                            newDueDates[index] = e.target.value;
                            setDueDates(newDueDates);
                          }}
                        />
                      </FormGroup>
                    </div>
                  ))}

                  <Button sx={{bgcolor:"green", color:"white"}} type='submit' >Continuar</Button>
                  </form>
                </Box>
              )
            }

            {
              checkoutStep !== 2 && checkoutStep !== 4 && !receivableMode && (
              <Button sx={{bgcolor:"#1877F2", color:"white", margin:"0 10px"}} onClick={()=>{if(checkoutStep > 0){setCheckoutStep(checkoutStep - 1);}}} >Voltar</Button>
              )
            }

            {
              checkoutStep !== 2 && checkoutStep !== 4 && !receivableMode && (
              <Button sx={{bgcolor:"green", color:"white"}} onClick={()=>{setCheckoutStep(checkoutStep + 1);}} >Continuar</Button>
              )
            }






          </TableContainer>





        </div>
      </div>
    }
    </>

  );
}
