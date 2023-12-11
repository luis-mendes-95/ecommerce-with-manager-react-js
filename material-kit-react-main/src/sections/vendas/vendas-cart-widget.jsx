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








  /** GET USER BY REQUEST IN BACKEND AND TAKES TOKEN FROM LOCALSTORAGE*/
  const user_id = localStorage.getItem('tejas.app.user_id');
  const token = localStorage.getItem('tejas.app.token');
  const user_name = localStorage.getItem('tejas.app.user_name');
  // const user_name = localStorage.getItem('user_name');
  const [user, setUser] = useState(null);
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







  const [showCartModal, setShowCartModal] = useState(false);
  const [receivableMode, setReceivableMode] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [parcelas, setParcelas] = useState(1);
  const [formaPagamentoParcelas, setFormaPagamentoParcelas] = useState(Array(parcelas).fill([]));
  const [dueDates, setDueDates] = useState([`${getDataAtualFormatada()}`,`${getDataAtualFormatada()}`]);
  const [dispatchValue, setDispatchValue] = useState(0);
  const [generateReceivables, setGenerateReceivables] = useState(true);
  const [generateOs, setGenerateOs] = useState(false);
  const [generateDispatch, setGenerateDispatch] = useState(false);
  const [showForm, SetShowForm] = useState("new");
  const [receivablesToGet, setReceivablesToGet] = useState([]);
  const [choosePayMethod, setChoosePayMethod] = useState(false);
















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
  const { register, handleSubmit } = useForm({
    //resolver: zodResolver(LoginUserSchema),
  });
  const onFormSubmit = (formData) => {

    let wait = true;

    let numIndexes = parcelas.length;

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
    })

    setTimeout(() => {
      setReceivableMode(true);
    }, 1000);

  
  };
       





  const cartModalFlipFlop = () => {
    setShowCartModal(!showCartModal);
  }
  




  const handleReceivablesChange = (parcelaIndex, formaPagamento) => {
    setFormaPagamentoParcelas(prevState => {
      const updatedFormaPagamentoParcelas = [...prevState];
      updatedFormaPagamentoParcelas[parcelaIndex] = formaPagamento;
      return updatedFormaPagamentoParcelas;
    });
  };
  
  console.log(formaPagamentoParcelas)


  return (
    <>
    <ToastContainer/>
    <StyledRoot onClick={cartModalFlipFlop}>
      <Badge showZero badgeContent={thisSale?.itens.length || 0} color="error" max={99}>
        <Iconify icon="eva:shopping-cart-fill" width={24} height={24} />
      </Badge>
    </StyledRoot>

    {
      showCartModal && 
      <div style={{backgroundColor:"black", position:"fixed", top:"0",left:"0", width:"100vw", height:"100%", zIndex:"9999", display:"flex", justifyContent:"center", alignItems:"center"}}>

        <div style={{color:"white", width:"100%"}}>
          <div style={{display:"flex", width:"100%", justifyContent:"space-between", position:"absolute", top:"0", left:"0"}}>
            <h1 style={{margin:"0", padding:"0", textShadow:"1pt 1pt 5pt black"}}>CHECKOUT</h1>
            <button style={{height:"50px", width:"50px", backgroundColor:"brown", color:"white", fontWeight:"bold", border:"none", cursor:"pointer", borderBottomLeftRadius:"40px"}} onClick={cartModalFlipFlop}>X</button>
          </div>


          <TableContainer component={Paper}>
            
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
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Qtd</TableCell>
                  <TableCell align="right">Valor Unit</TableCell>
                  <TableCell align="right">Desconto Unit</TableCell>
                  <TableCell align="right">Valor com Desc</TableCell>
                  <TableCell align="right">Sub Total</TableCell>
                  <TableCell align="right">...</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>


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
                    <TextField align="right" label='Valor Frete' onChange={(e)=>{setDispatchValue(e.target.value)}}/> 
                  </TableCell>
                  }
                  <TableCell align="right"> Total R$ { thisSale?.itens.reduce((total,item)=>{const precoComDesconto=item.produto.preco-item.disccount;const subtotal=((precoComDesconto*item.qty) - -dispatchValue);return total+subtotal;}, 0)  }</TableCell>
                </TableRow>

              </TableBody>

            </Table>
            }


























            {
              receivableMode &&
              <Table sx={{ minWidth: 600 }} aria-label="spanning table">
              <TableHead>

                <TableRow>
                  <TableCell align="center" colSpan={5}>
                    Receba Valores
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell >Valor</TableCell>
                  <TableCell align="right">Vencimento</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell align="right">...</TableCell>
                </TableRow>
                
              </TableHead>
              <TableBody>



                {
                  user?.receivables.map((receivable) => {
                    
                    let index = -1;

                    if(receivablesToGet.includes(receivable.id)){

                      index += 1;

                      return (
                        <TableRow key={receivable.id}>
                        <TableCell>{receivable.description}</TableCell>
                        <TableCell>R$ {receivable.amount}</TableCell>
                        <TableCell align="right">{receivable.dueDate}</TableCell>
                        <TableCell>

                        </TableCell>
                        <TableCell align="right">
                          <button>Receber</button>
                          {
                            choosePayMethod &&
                             <select
                               onChange={(e) => handleReceivablesChange(index, e.target.value)}
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
    
        
    
                      </TableRow>
                      )

                    }

                  })
                }






              </TableBody>

            </Table>
            }

























            {
              checkoutStep === 0 &&
                <FormGroup sx={{margin:"40px 0"}}>
                <FormControlLabel control={<Checkbox checked={generateReceivables} />} label="Gerar Títulos A Receber" />
                <FormControlLabel control={<Checkbox />} label="Gerar Ordem de Serviço" />
                <FormControlLabel control={<Checkbox />} label="Despacho por Transportadora" onChange={()=>{setGenerateDispatch(!generateDispatch)}}/>
    
                </FormGroup>
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


            {checkoutStep === 2 && (
              <Box>
                {/* ... (outros elementos) */}
                <form onSubmit={handleSubmit(onFormSubmit)}>
                {Array.from({ length: parcelas }).map((_, index) => (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p>Parcela R$ {index + 1} : R$ {((thisSale?.itens.reduce((total, item) => {
                      const precoComDesconto = item.produto.preco - item.disccount;
                      const subtotal = ((precoComDesconto * item.qty) - -dispatchValue);
                      return total + subtotal;
                    }, 0)) / parcelas).toFixed(2)}</p>
                    <FormGroup sx={{ margin: "0 0" }} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px", flexWrap: "nowrap" }}>
                      {/* Substituir os Checkbox por Select */}

                      <TextField
                        placeholder='01/01/2018'
                        label='Data Vencimento'
                        defaultValue={getDataAtualFormatada()}
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
            )}
            
          
            {
              checkoutStep !== 2 && checkoutStep !== 4 && !receivableMode &&
              <Button sx={{bgcolor:"green", color:"white"}} onClick={()=>{setCheckoutStep(checkoutStep + 1);}} >Continuar</Button>
            }



          </TableContainer>




        </div>
      </div>
    }
    </>

  );
}
