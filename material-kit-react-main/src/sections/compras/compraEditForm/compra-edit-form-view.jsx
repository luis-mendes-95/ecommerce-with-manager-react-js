/* eslint-disable */
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from 'src/routes/hooks';
import { bgGradient } from 'src/theme/css';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import api from 'src/services/api';
import { useForm } from 'react-hook-form';
import { Toastify } from 'toastify';
import { TableCell } from '@mui/material';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';

// ----------------------------------------------------------------------

function getDataAtualFormatada() {
  var data = new Date();
  var dia = data.getDate().toString().padStart(2, '0');
  var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 porque os meses começam do 0
  var ano = data.getFullYear();
  return dia + '/' + mes + '/' + ano;
}

export default function CompraEditFormView(compraToEdit) {
  
  const theme = useTheme();
  const router = useRouter();


//FORM INPUTS CONFIGURATIONS
let url = "/produtos"



//STATES FOR THIS COMPONENT
const [receivableMode, setReceivableMode] = useState(false);
const [payableMode, setPayableMode] = useState(false);
const [receivingItem, setReceivingItem] = useState(null);
const [payingItem, setPayingItem] = useState(null);
const [receivingItemRemaining, setReceivingItemRemaining] = useState(0);
const [payingItemRemaining, setPayingItemRemaining] = useState(0);
const [receivingItemPayMethod, setReceivingItemPayMethod] = useState('');
const [payingItemPayMethod, setPayingItemPayMethod] = useState('');
const [parcelas, setParcelas] = useState(1);
const [formaPagamentoParcelas, setFormaPagamentoParcelas] = useState(Array(parcelas).fill([]));
const [receivingItemAmount, setReceivingItemAmount] = useState(0);
const [payingItemAmount, setPayingItemAmount] = useState(0);
const [aggregatedItems, setAggregatedItems] = useState([]);



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





//USE FORM CALLING FUNCTIONS
const { register, handleSubmit } = useForm({
  //resolver: zodResolver(LoginUserSchema),
});


/**PATCH REQUEST TO ADD RECEIVEMENT TO A RECEIVABLE */
const receiveValue = async (createData) => {

  if (receivingItemAmount <= receivingItemRemaining && receivingItemAmount > 0) {
    let receivements = {
      receivements: receivingItem?.receivements
  
    }
  
    receivements.receivements.push(createData)
  
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await api.patch(`/receivables/${receivingItem.id}`, receivements, config);
  
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
        getSale(saleToEdit.id);
        setReceivingItem(null);
        setReceivableMode(false);
        
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao receber valor");
    }
  } else {
    toast.error("Verifique o valor restante, e o valor que está sendo recebido!")
  }



};

/**PATCH REQUEST TO ADD PAYMENT TO A PAYABLE */
const payValue = async (createData) => {

  if (payingItemAmount <= payingItemRemaining && payingItemAmount > 0) {
    let payments = {
      payments: payingItem?.payments
    }
  
    payments.payments.push(createData)
  
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await api.patch(`/payables/${payingItem.id}`, payments, config);
  
      if (response.status === 200) {
        toast.success();
        toast.success("Valor pago com sucesso!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
  
        getUser();
        getCompra(compraToEdit.id);
        setPayingItem(null);
        setPayableMode(false);
        
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao executar pagamento");
    }
  } else {
    toast.error("Verifique o valor restante, e o valor que está sendo pago!")
  }



};

/**DELETE SALE AND CHECK IF THERE'S ANY RECEIVABLED PAID, IF TRUE, IT GENERATES CREDIT INSIDE THE CLIENT*/
const deleteSale = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.delete(`vendas/${id}`, config);
      if (response.status === 200) {
        toast.success("Venda deletada com sucesso!", {
          position: "bottom-right", 
          autoClose: 3000, 
          hideProgressBar: false, 
          closeOnClick: true, 
          pauseOnHover: true, 
          draggable: true, 
          progress: undefined, 
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao deletar venda!", {
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

/**DELETE COMPRA */
const deleteCompra = async (id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.delete(`compras/${id}`, config);
    if (response.status === 200) {
      toast.success("Compra deletada com sucesso!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao deletar compra!", {
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





//DEAL WITH FORM OF RECEIVEMENT
const handleReceivablesChange = ( formaPagamento) => {
  setReceivingItemPayMethod(formaPagamento)
};

//DEAL WITH FORM OF PAYMENT
const handlePayablesChange = ( formaPagamento) => {
  setPayingItemPayMethod(formaPagamento)
};


const renderPaymentRow = (payment) => {
  const dataArray = payment.payments; 
  let totalPaid = 0;

  dataArray.forEach((item) => {
    const amountMatch = item.match(/amount:(\d+)/);
    if (amountMatch && amountMatch[1]) {
      totalPaid += parseInt(amountMatch[1], 10);
    }
  });

  const canPay = payment.amount - totalPaid !== 0;

  return (
    <TableBody style={{ height: "100px", overflow: "scroll" }}>
      <TableRow key={payment.id}>
        <TableCell align="center">{payment.dueDate}</TableCell>
        <TableCell align="center">R$ {parseFloat(payment.amount).toFixed(2)}</TableCell>
        <TableCell align="center">R$ {totalPaid.toFixed(2)}</TableCell>
        {canPay && (
          <TableCell align="center">
            <p
              style={{
                border: "none",
                padding: "15px",
                backgroundColor: "green",
                color: "white",
                fontWeight: "bold",
                borderRadius: "18px",
                cursor: "pointer",
                boxShadow: "1pt 1pt 5pt black",
              }}
              onClick={() => {
                const paymentData = `data:${getDataAtualFormatada()}, amount:${payingItemAmount}, type:${payingItemPayMethod}, user:${user_name}`;
                handlePayment(
                  getDataAtualFormatada(),
                  payingItemAmount,
                  payingItemPayMethod,
                  user_name
                );
                payValue(paymentData);
              }}
            >
              Pagar
            </p>
          </TableCell>
        )}
        {!canPay && (
          <TableCell align="center">
            <p
              style={{
                border: "none",
                padding: "15px",
                backgroundColor: "lightblue",
                color: "black",
                fontWeight: "bold",
                borderRadius: "18px",
                cursor: "pointer",
                boxShadow: "1pt 1pt 5pt black",
              }}
            >
              OK
            </p>
          </TableCell>
        )}
      </TableRow>
    </TableBody>
  );
};








const handleReceivingItemChange = (receivable) => {

  setReceivingItem(receivable); 
 
  
  setTimeout(() => {
    setReceivableMode(true);
  }, 1500);

    // Obter o valor inicial de 'amount'
  let totalAmount = parseFloat(receivable.amount);

  // Iterar sobre os receivements e subtrair os valores correspondentes
  receivable.receivements.forEach(receivement => {
    const receivementParts = receivement.split(', ');
    const amountPart = receivementParts.find(part => part.startsWith('amount:'));
    
    if (amountPart) {
      const amountValue = parseFloat(amountPart.split(':')[1]);
      totalAmount -= amountValue;
    }
  });

  // Agora, 'totalAmount' contém o resultado da subtração
  setReceivingItemRemaining(totalAmount)

}

const handlePayingItemChange = (payable) => {

  setPayingItem(payable); 
 
  
  setTimeout(() => {
    setPayableMode(true);
  }, 1500);

  let totalAmount = parseFloat(payable.amount);

  payable.payments.forEach(payment => {
    const paymentParts = payment.split(', ');
    const amountPart = paymentParts.find(part => part.startsWith('amount:'));
    
    if (amountPart) {
      const amountValue = parseFloat(amountPart.split(':')[1]);
      totalAmount -= amountValue;
    }
  });

  setPayingItemRemaining(totalAmount)

}


//FORM SUBMIT
const onFormSubmit = (formData) => {

  let currentPayment = `data:${getDataAtualFormatada()}, amount:${formData.payingAmount}, type:${formaPagamentoParcelas[0]}, user:${user_name}`
  delete formData.amount;
  delete formData.payingAmount;
  formData.payments = payingItem.payments
  formData.payments.push(currentPayment);

  payValue(formData)

 }
      



 /** GET SALE BY REQUEST IN BACKEND*/
const [sale, setSale] = useState(null);
const getSale = async (id) => {
      try {
        const response = await api.get(`/vendas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(response.data){
            setSale(response.data); 
        }
      } catch (err) {
        console.log(err);
      }
}; 

 /** GET COMPRA BY REQUEST IN BACKEND*/
 const [compra, setCompra] = useState(null);
 const getCompra = async (id) => {
       try {
         const response = await api.get(`/compras/${id}`, {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         });
         if(response.data){
             setCompra(response.data); 
         }
       } catch (err) {
         console.log(err);
       }
 }; 

useEffect(() => {

  getCompra(compraToEdit.compraToEdit)

}, [compraToEdit])

useEffect(() =>{


  const aggregatedMap = new Map();
    
  compra?.itemCompra.forEach((row) => {
    const id = row.produto.id;
    const existingItem = aggregatedMap.get(id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      aggregatedMap.set(id, { ...row, qty: 1 });
    }
  });

  const aggregatedArray = Array.from(aggregatedMap.values());

  setAggregatedItems(aggregatedArray);
  console.log(aggregatedArray)

}, [compra])





//FORM INPUTS, SELECTS AND BUTTONS
const renderForm = (
  <>
    <Stack spacing={3} style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", alignContent:"center", gap:"15px", flexWrap:"wrap"}}>

    <TextField style={{width:"200px"}} autoComplete="given-name" {...register("createdAt")} value={compra?.createdAt} defaultValue={" "} name="createdAt" required fullWidth id="createdAt" label="Data de cadastro" autoFocus/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="lastEditted" value={compra?.lastEditted} defaultValue={" "} label="Última Edição" {...register("lastEditted")} name="lastEditted" autoComplete="family-name"/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="changeMaker"lastEditted label="Colaborador" {...register("changeMaker")} name="changeMaker" autoComplete="family-name" value={user_name}/>
   
    <TextField style={{width:"630px", marginTop:"0"}} required fullWidth id="description"lastEditted label="Cliente" value={compra?.supplier.nome_razao_social} defaultValue={" "}  name="client" autoComplete="family-name"/>
    <TextField style={{width:"630px", marginTop:"0"}} required fullWidth id="description"lastEditted label="Descrição" value={compra?.description} defaultValue={" "} name="description" autoComplete="family-name"/>
  
   

    </Stack>





  </>
);




  //RETURN IN HTML
  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <ToastContainer />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1, overflowX: "auto" }}>
        <Card sx={{p: 5,width: 1,maxWidth: 820,}}      
          >
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2, mr: 3, bgcolor:"brown"}}
              onClick={()=>{window.location.reload()}}
            >
              Voltar
            </Button>
          <Typography variant="h4">Compra</Typography>


          <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate sx={{ mt: 1 }}>
          {renderForm}
          </Box>







          {/**TABLE ITEMS */}
          <Box>
            <Table sx={{ minWidth: 600, marginTop: "25px" }} aria-label="spanning table">

                    <TableHead>
                      <TableRow>
                        <TableCell align="center" colSpan={7}>
                          ITENS
                        </TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                      <TableRow style={{height:"100%", padding:"0"}}>
                        <TableCell>Item</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">Qtd</TableCell>
                        <TableCell align="center">Valor Unit</TableCell>
                        <TableCell align="center">Desconto Unit</TableCell>
                        <TableCell align="center">Valor com Desc</TableCell>
                        <TableCell align="center">Sub Total</TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>



              {
                aggregatedItems?.map((item)=>{

                  console.log(item.produto.id) /**se o id for o mesmo, tem que renderizar isso abaixo apenas uma vez e adicionar um campo que já está sendo esperado */

                  const total = compra.itemCompra.reduce((acc, item) => {
                    const preco = typeof item.produto.preco !== 'undefined' ? parseFloat(item.produto.preco) : 0;
                    const qty = typeof item.qty !== 'undefined' ? parseFloat(item.qty) : 0;
                    const itemTotal = preco * qty;
                    return acc + itemTotal;
                  }, 0);



                  return(



                    <>

      
                    <TableBody style={{height:"100px", overflow:"scroll"}}>
      
      

                        <TableRow key={item.id}> 

                        <TableCell>{item.produto.nome}</TableCell>
                        <TableCell><img src={item.produto.imagem_principal}/></TableCell>

                          <TableCell align="center">{item.qty}{/**aqui a quantidade conforme a quantidade de ids de produto repetidos */}</TableCell>
                          <TableCell align="center">R${item.cost}</TableCell>
                          <TableCell align="center">R${item.disccount}</TableCell>
                          <TableCell align="center">R${item.cost - item.disccount}</TableCell>
                          <TableCell align="center">R${(item.qty * item.cost) - (item.disccount * item.qty)}</TableCell>
                          <TableCell align="center"></TableCell>
      
                        </TableRow>

      
                      <TableRow >
      
      
      
      
                      {
                        compra?.dispatchValue !== "0" &&
                          <TableCell style={{width:"150px", fontWeight:"bold"}} align="right"> Frete R$ {compra?.dispatchValue}</TableCell>
                      }
      
      
      
      
      

                      </TableRow>
      
                    </TableBody>
                    
                    </>
      


                  )
                  
                })
                
              }

                {
                <TableCell style={{width:"150px", fontWeight:"bold"}} align="right"> Total R$ {aggregatedItems.reduce((acc, item) => {
  
                  const preco = typeof item.cost !== 'undefined' ? parseFloat(item.cost) : 0;
                  const desconto = parseFloat(item.disccount);
                  const qty = typeof item.qty !== 'undefined' ? parseFloat(item.qty) : 0;
                  const itemTotal = (preco - desconto) * qty;
                  return acc + itemTotal + parseFloat(compra?.dispatchValue);
                }, 0)}</TableCell>

              }


            </Table>
          </Box>












          {/**TABLE PAYABLES */}
          <Box>
          {

              payableMode && (

                /**TABLE*/
                <Table sx={{ minWidth: 600, maxHeight: 100 }} aria-label="spanning table">


                {/**TABLE HEADER */}
                  <TableHead>

                        <TableRow>
                          <TableCell align="center" colSpan={6}>Pagar este valor</TableCell>
                        </TableRow>




                  </TableHead>






                  {/**RENDERED PAYABLES
                   *  
                   **/}
                  <Box>



                {/**PAYING ITEM 
                 *  RENDER THE CHOOSED PAYMENT TO CHOOSE PAYMENT METHOD
                 **/}
                  {
                    payableMode &&

                      <Box component="form" >
                          <TableRow key={payingItem?.id}>
                          <TableCell>R$ {payingItemRemaining}</TableCell>
                          <TableCell align="right">{payingItem?.dueDate}</TableCell>

                          <TableCell align="right">

                              <select style={{borderRadius:"8px", border:"none", backgroundColor:"lightgray", padding:"5px", cursor: "pointer"}}
                                onChange={(e) => handlePayablesChange(e.target.value)}
                              >
                                <option value="">Forma de Pagamento</option>
                                <option value="A Vista">A Vista</option>
                                <option value="Pix">Pix</option>
                                <option value="Cartão Débito">Cartão Débito</option>
                                <option value="Cartão Crédito">Cartão Crédito</option>
                                <option value="A Prazo">A Prazo</option>
                              </select>

                          </TableCell>
                          <TableCell>
                            <input placeholder="R$" style={{borderRadius:"8px", border:"none", backgroundColor:"lightgray", padding:"5px"}} onChange={(e)=>{setPayingItemAmount(e.target.value)}}/>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <p onClick={()=>{payValue(`data:${getDataAtualFormatada()}, amount:${payingItemAmount}, type:${payingItemPayMethod}, user:${user_name}`)}} style={{cursor:"pointer", border:"2pt solid black", padding:"4px", borderRadius:"8px"}}>Pagar</p>
                            </Box>

                          </TableCell>
      
                        </TableRow>
                                                    
                      </Box>

                  }



                  
                  <button style={{backgroundColor:"green", color:"white", border:"none", borderRadius:"8px", padding:"10px", margin:"10px", cursor:"pointer"}} onClick={()=>{window.location.reload()}}>Concluir</button>

                  </Box>







                </Table>
              )

          }
          {
            !payableMode &&
            <Table sx={{ minWidth: 600, marginTop: "25px" }} aria-label="spanning table">
            <TableHead>

              <TableRow>
                <TableCell align="center" colSpan={6}>PARCELAS</TableCell>
              </TableRow>



              <TableRow>
                    <TableCell align="center">Vencimento</TableCell>
                    <TableCell align="center">Quantia</TableCell>
                    <TableCell align="center">Pago</TableCell>
                    <TableCell align="center">...</TableCell>
              </TableRow> 

            </TableHead>



            {
              compra?.payables
              .slice()
              .sort((a, b) => new Date(a.dueDate.split('/').reverse().join('-')) - new Date(b.dueDate.split('/').reverse().join('-')))
              .map((payable) => {
                  const dataArray = payable.payments;
                  let totalPaid = 0;

                  dataArray.forEach((item) => {
                    const amountMatch = item.match(/amount:(\d+)/);
                    if (amountMatch && amountMatch[1]) {
                      totalPaid += parseInt(amountMatch[1], 10);
                    }
                  });

                  const canPay = payable.amount - totalPaid !== 0;

                  return (
                    <TableBody style={{ height: "100px", overflow: "scroll" }}>
                      <TableRow key={payable.id}>
                        <TableCell align="center">{payable.dueDate}</TableCell>
                        <TableCell align="center">R$ {parseFloat(payable.amount).toFixed(2)}</TableCell>
                        <TableCell align="center">R$ {totalPaid.toFixed(2)}</TableCell>
                        {canPay && (
                          <TableCell align="center">
                            <p
                              style={{
                                border: "none",
                                padding: "15px",
                                backgroundColor: "green",
                                color: "white",
                                fontWeight: "bold",
                                borderRadius: "18px",
                                cursor: "pointer",
                                boxShadow: "1pt 1pt 5pt black",
                              }}
                              onClick={() => {
                                handlePayingItemChange(payable);
                              }}
                            >
                              Pagar
                            </p>
                          </TableCell>
                        )}
                        {!canPay && (
                          <TableCell align="center">
                            <p
                              style={{
                                border: "none",
                                padding: "15px",
                                backgroundColor: "lightblue",
                                color: "black",
                                fontWeight: "bold",
                                borderRadius: "18px",
                                cursor: "pointer",
                                boxShadow: "1pt 1pt 5pt black",
                              }}
                            >
                              OK
                            </p>
                          </TableCell>
                        )}
                      </TableRow>
                    </TableBody>
                  );
                })
            }

            </Table>
          }
          </Box>









          {/**TABLE PAYMENTS */}
          <Box>

          {
            !payableMode &&
            <Table sx={{ minWidth: 600, marginTop: "25px" }} aria-label="spanning table">
            <TableHead>

              <TableRow>
                <TableCell align="center" colSpan={6}>PAGAMENTOS</TableCell>
              </TableRow>



              <TableRow>
                    <TableCell align="center">Data</TableCell>
                    <TableCell align="center">Quantia</TableCell>
                    <TableCell align="center">Método</TableCell>
                    <TableCell align="center">Usuário</TableCell>
              </TableRow> 

            </TableHead>



            {
              compra?.payables.map((payable, index) => (
                <TableBody key={index} style={{ height: "100px", overflow: "scroll" }}>
                  <TableRow style={{ borderBottom: "1px solid #ccc" }}>

                    <TableCell align="center" style={{ padding: "10px", fontSize: "16px", fontWeight: "bold" }}>
                      {payable.payments.map((payment, paymentIndex) => (
                        <div key={paymentIndex} style={{ marginTop: "10px" }}>
                          <div style={{ marginBottom: "5px", fontSize: "14px" }}>Data: {payment.split(', ')[0].split(':')[1]}</div>
                        </div>
                      ))}
                    </TableCell>

                    <TableCell align="center" style={{ padding: "10px", fontSize: "16px", fontWeight: "bold" }}>
                    {payable.payments.map((payment, paymentIndex) => (
                        <div key={paymentIndex} style={{ marginTop: "10px" }}>
                          <div style={{ marginBottom: "5px", fontSize: "14px" }}>R$ {payment.split(', ')[1].split(':')[1]}</div>
                        </div>
                      ))}
                    </TableCell>

                    <TableCell align="center" style={{ padding: "10px", fontSize: "16px", fontWeight: "bold" }}>
                    {payable.payments.map((payment, paymentIndex) => (
                        <div key={paymentIndex} style={{ marginTop: "10px" }}>
                          <div style={{ marginBottom: "5px", fontSize: "14px" }}>Tipo: {payment.split(', ')[2].split(':')[1]}</div>
                        </div>
                      ))}
                    </TableCell>

                    <TableCell align="center" style={{ padding: "10px", fontSize: "16px", fontWeight: "bold" }}>
                    {payable.payments.map((payment, paymentIndex) => (
                        <div key={paymentIndex} style={{ marginTop: "10px" }}>
                          <div style={{ marginBottom: "5px", fontSize: "14px" }}>Usuário: {payment.split(', ')[3].split(':')[1]}</div>
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))
            }

            </Table>
          }
          </Box>













          <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>

            <Box>

                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "brown" }}
                  onClick={()=>{window.location.reload()}}
                >
                  Voltar
                </Button>


                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2, mr: 3, bgcolor: "black", color: "white" }}
                  onClick={()=>{deleteCompra(compra?.id)}}
                >
                  Cancelar Compra
                </Button>
            </Box>

          </Stack>

        </Card>
      </Stack>

    </Box>
  );
}
