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



export default function CartWidget({thisSale, deleteItemVenda}) {
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
      console.log("gere parcelas automaticas")
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
        formData.amount = `${thisSale?.itens.reduce((total,item)=>{const precoComDesconto=item.produto.preco-item.disccount;const subtotal=((precoComDesconto*item.qty) - -dispatchValue);return total+subtotal;}, 0) / parcelas}`;
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
        formData.amount = `${thisSale?.itens.reduce((total,item)=>{const precoComDesconto=item.produto.preco-item.disccount;const subtotal=((precoComDesconto*item.qty) - -dispatchValue);return total+subtotal;}, 0) / parcelas}`;
        formData.active = true;
        formData.receivements = [];
        formData.description = "Título gerado a partir de uma venda"
  
        formData.user_id = user_id;
        formData.client_id = thisSale?.client_id;
        formData.venda_id = thisSale?.id;
  
        createReceivable(formData)

        if (generateDispatch){
          console.log("gera despacho")
          console.log("editar venda e adicionar valor no dispatchValue")
          console.log(thisSale.id)
          console.log("edit sale")
        }
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
      <Badge showZero badgeContent={thisSale?.itens.length || 0} color="error" max={99}>
        <Iconify icon="eva:shopping-cart-fill" width={24} height={24} />
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
              !receivableMode &&
              <Table sx={{ minWidth: 600 }} aria-label="spanning table">

              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    Confira os itens
                  </TableCell>
                  <TableCell align="right">Valor</TableCell>
                </TableRow>
                <TableRow style={{height:"100%", padding:"0"}}>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Qtd</TableCell>
                  <TableCell align="right">Valor Unit</TableCell>
                  <TableCell align="right">Desconto Unit</TableCell>
                  <TableCell align="right">Valor com Desc</TableCell>
                  <TableCell align="right">Sub Total</TableCell>
                  <TableCell align="right">...</TableCell>
                </TableRow>
              </TableHead>

              <TableBody style={{height:"100px", overflow:"scroll"}}>


                {thisSale?.itens.map((row) => (
                  <TableRow key={row.id}> 
                    <TableCell>{row.produto.nome}</TableCell>
                    <TableCell align="right">{row.qty}</TableCell>
                    <TableCell align="right">R${row.produto.preco}</TableCell>
                    <TableCell align="right">R${row.disccount}</TableCell>
                    <TableCell align="right">R${row.produto.preco - row.disccount}</TableCell>
                    <TableCell align="right">R${(row.qty * row.produto.preco) - (row.disccount * row.qty)}</TableCell>
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





                  <TableCell style={{width:"150px"}} align="right"> Total R$ { thisSale?.itens.reduce((total,item)=>{const precoComDesconto=item.produto.preco-item.disccount;const subtotal=((precoComDesconto*item.qty));return total+subtotal;}, 0) - -dispatchValue  }</TableCell>
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
            {
              receivableMode && (

                /**TABLE*/
                <Table sx={{ minWidth: 600, maxHeight: 100 }} aria-label="spanning table">


                {/**TABLE HEADER */}
                  <TableHead>

                        <TableRow>
                          <TableCell align="center" colSpan={6}>Receba Valores</TableCell>
                        </TableRow>



                        <TableRow>
                              <TableCell >Valor</TableCell>
                              <TableCell align="left">Vencimento</TableCell>
                              <TableCell align="left">Método</TableCell>
                              <TableCell align="">Quantia</TableCell>
                              <TableCell align="left"></TableCell>
                        </TableRow> 

                  </TableHead>






                  {/**RENDERED RECEIVABLES
                   *  
                   **/}
                  <TableBody>



                   {/**WHEN RECEIVING ITEM IS NOT CHOOSED YET */}
                  {
                    !receivingItem && (

                      user?.receivables.map((receivable) => {
                        let valueToRender = parseFloat(receivable.amount);
                        let index = -1;
                      
                        if (receivablesToGet.includes(receivable.id) && receivable.dueDate === new Date().toLocaleDateString()) {
                          receivable.receivements.map((receivement) => {
                            let keyValuePairs = receivement.split(', ');
                      
                            let receivableObject = {};
                      
                            for (let i = 0; i < keyValuePairs.length; i++) {
                              let pair = keyValuePairs[i].split(':');
                              let key = pair[0];
                              let value = pair[1];
                              receivableObject[key] = value;
                            }
                      
                            let amount = receivableObject['amount'];
                      
                            valueToRender -= amount;
                          });
                      
                          index += 1;
                      
                          if (valueToRender > 0) {

                            return (
                              <>
                                <TableRow key={receivable.id}>
                                  <TableCell>R$ {valueToRender.toFixed(2)}</TableCell>
                                  <TableCell align="left">{receivable.dueDate}</TableCell>
                                  <TableCell align="left">
                                    {!choosePayMethod && (
                                      <button onClick={() => {setReceivingItem(receivable); setChoosePayMethod(!choosePayMethod); }}>Receber</button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              </>
                            );

                          } else {
                            window.location.reload();
                          }

                        }
                      })
                    )
                  }









                {/**RECEIVING ITEM 
                 *  RENDER THE CHOOSED RECEIVEMENT TO CHOOSE PAYMENT METHOD
                 **/}
                  {
                    receivingItem &&


                    user?.receivables.map((receivable) => {


                      if(receivable.id === receivingItem.id) {

                        let valueToRender = parseFloat(receivable.amount);

                        receivable.receivements.map((receivement) => {
                        
                          let keyValuePairs = receivement.split(', ');
  
                          let receivableObject = {};
  
                          for (let i = 0; i < keyValuePairs.length; i++) {
                            let pair = keyValuePairs[i].split(':');
                            let key = pair[0];
                            let value = pair[1];
                            receivableObject[key] = value;
                          }
  
                          let amount = receivableObject['amount'];
  
                          valueToRender -= amount;
  
  
                        })


                        return (
                          <>
                          <TableRow key={receivingItem.id}>
                          <TableCell>R$ {valueToRender.toFixed(2)}</TableCell>
                          <TableCell align="right">{receivingItem.dueDate}</TableCell>

                          <TableCell align="right">
                            {
                              !choosePayMethod &&
                              <button onClick={()=>{ }}>Receber</button>
                            }

                            {
                              choosePayMethod &&
                              <select style={{borderRadius:"8px", border:"none", backgroundColor:"lightgray", padding:"5px", cursor: "pointer"}}
                                onChange={(e) => handleReceivablesChange(e.target.value)}
                              >
                                <option value="">Forma de Pagamento</option>
                                <option value="A Vista">A Vista</option>
                                <option value="Pix">Pix</option>
                                <option value="Cartão Débito">Cartão Débito</option>
                                <option value="Cartão Crédito">Cartão Crédito</option>
                                <option value="A Prazo">A Prazo</option>
                              </select>
                            }
                          </TableCell>
                          <TableCell>
                            <input placeholder="R$" style={{borderRadius:"8px", border:"none", backgroundColor:"lightgray", padding:"5px"}} {...register("receivingAmount")}/>
                          </TableCell>
                          <TableCell>
                            <form onSubmit={handleSubmit(onFormSubmit)}>
                              <button type='submit' onClick={()=>{setChoosePayMethod(!choosePayMethod);}}>Receber</button>
                            </form>

                          </TableCell>
      
          
      
                        </TableRow>
                                                    
                        </>
                        )
                      }


                    })

                      





                  }



                  
                  <button style={{backgroundColor:"green", color:"white", border:"none", borderRadius:"8px", padding:"10px", margin:"10px", cursor:"pointer"}} onClick={()=>{window.location.reload()}}>Concluir</button>

                  </TableBody>







                </Table>
              )
            }





            {/**CHECKOUT STEPS
             *  0) GENERATE ITEMS / 
             *  1) GENERATE NUMBER OF INSTALLMENTS /
             *  2) CHOOSE DUE DATES
             **/}
            {
              checkoutStep === 0 && (
                <FormGroup sx={{margin:"40px 0"}}>
                <FormControlLabel control={<Checkbox checked={generateReceivables} onChange={()=>{setGenerateReceivables(!generateReceivables)}}/>} label="Gerar Títulos A Receber" />

                <FormControlLabel control={<Checkbox checked={generateDispatch} onChange={()=>{setGenerateDispatch(!generateDispatch)}}/>} label="Despacho por Transportadora" />
    
                </FormGroup>
              )
            }
            {
              checkoutStep === 1 && (
                  <Box>
                                        <Label>Qtd Parcelas</Label>
                    <FormGroup sx={{ margin: "40px 0" }} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px", flexWrap:"nowrap" }}>

                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((parcela) => (
                        <FormControlLabel
                          key={parcela}
                          control={
                            <Checkbox
                              checked={parcelas === parcela} 
                              onChange={() => setParcelas(parcelas === parcela ? 0 : parcela)} 
                            />
                          }
                          label={parcela.toString()}
                        />
                      ))}
                    </FormGroup>
                    <p>Valor da parcela: R$ {((thisSale?.itens.reduce((total,item)=>{const precoComDesconto=item.produto.preco-item.disccount;const subtotal=((precoComDesconto*item.qty) - -dispatchValue);return total+subtotal;}, 0))  / parcelas).toFixed(2)}</p>
                  </Box>
              )
            }
            {
              checkoutStep === 2 && (
                <Box>
                  {/* ... (outros elementos) */}
                  <form onSubmit={handleSubmit(onFormSubmit)} style={{height:"100%", overflow:"scroll", }}>
                  {Array.from({ length: parcelas }).map((_, index) => (
                    <div style={{ display: "flex", flexDirection:"row", backgroundColor:"lightgray", width:"25%" }}>
                      <p>Parcela {index + 1} : R$ {((thisSale?.itens.reduce((total, item) => {
                        const precoComDesconto = item.produto.preco - item.disccount;
                        const subtotal = ((precoComDesconto * item.qty) - -dispatchValue);
                        return total + subtotal;
                      }, 0)) / parcelas).toFixed(2)}</p>
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
