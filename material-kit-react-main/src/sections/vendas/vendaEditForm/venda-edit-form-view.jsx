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

export default function VendaEditFormView(saleToEdit) {
  
  const theme = useTheme();
  const router = useRouter();


//FORM INPUTS CONFIGURATIONS
let url = "/produtos"



//STATES FOR THIS COMPONENT
const [receivableMode, setReceivableMode] = useState(false);
const [receivingItem, setReceivingItem] = useState(null);
const [receivingItemRemaining, setReceivingItemRemaining] = useState(0);
const [receivingItemPayMethod, setReceivingItemPayMethod] = useState('');
const [parcelas, setParcelas] = useState(1);
const [formaPagamentoParcelas, setFormaPagamentoParcelas] = useState(Array(parcelas).fill([]));
const [receivingItemAmount, setReceivingItemAmount] = useState(0);



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
          console.log(response.data)
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

const edit = async (createData) => {
  console.log("chegano aqui")
  try {
    // Define o cabeçalho da solicitação com o token de autenticação
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.patch(`/produtos/${sale.sale.id}`, createData, config);

    if (response.data) {
      toast.success("Produto editado com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
      // Por exemplo, redirecionar para outra página.
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao editar cliente");
    // Lida com o erro de forma apropriada, como exibir uma mensagem de erro.
  }
};
const deactivate = async () => {
  try {
    // Define o cabeçalho da solicitação com o token de autenticação
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let body = {
      "active": false
    }

    const response = await api.patch(`/produtos/${sale.sale.id}`, body, config);

    if (response.data) {
      toast.success("Produto foi desativado!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
      // Por exemplo, redirecionar para outra página.
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao desativar produto");
    // Lida com o erro de forma apropriada, como exibir uma mensagem de erro.
  }
};
const activate = async () => {
  try {
    // Define o cabeçalho da solicitação com o token de autenticação
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let body = {
      "active": true
    }

    const response = await api.patch(`/produtos/${sale.sale.id}`, body, config);

    if (response.data) {
      toast.success("Produto foi reativado!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
      // Por exemplo, redirecionar para outra página.
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao reativar produto");
    // Lida com o erro de forma apropriada, como exibir uma mensagem de erro.
  }
};
const deleteItem = async () => {
  console.log("sendo chamado pra deletar")
  console.log(sale.sale.id);
  try {
    // Define o cabeçalho da solicitação com o token de autenticação
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.delete(`/produtos/${sale.sale.id}`, config);

    if (response.status === 204) {
      toast.success("Produto foi deletado!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Você pode adicionar qualquer outra lógica aqui que desejar após o sucesso.
      // Por exemplo, redirecionar para outra página.
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao deletar produto");
    // Lida com o erro de forma apropriada, como exibir uma mensagem de erro.
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





//DEAL WITH FORM OF PAYMENT
const handleReceivablesChange = ( formaPagamento) => {
  setReceivingItemPayMethod(formaPagamento)
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


//FORM SUBMIT
const onFormSubmit = (formData) => {

  let currentReceivement = `data:${getDataAtualFormatada()}, amount:${formData.receivingAmount}, type:${formaPagamentoParcelas[0]}, user:${user_name}`
  delete formData.amount;
  delete formData.receivingAmount;
  formData.receivements = receivingItem.receivements
  formData.receivements.push(currentReceivement);
  receiveValue(formData)

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
        setThisSale(null);
      }
}; 


useEffect(() => {

  getSale(saleToEdit.saleToEdit)

}, [])



console.log(receivingItem)


//FORM INPUTS, SELECTS AND BUTTONS
const renderForm = (
  <>
    <Stack spacing={3} style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", alignContent:"center", gap:"15px", flexWrap:"wrap"}}>

    <TextField style={{width:"200px"}} autoComplete="given-name" {...register("createdAt")} value={sale?.createdAt} defaultValue={" "} name="createdAt" required fullWidth id="createdAt" label="Data de cadastro" autoFocus/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="lastEditted" value={sale?.lastEditted} defaultValue={" "} label="Última Edição" {...register("lastEditted")} name="lastEditted" autoComplete="family-name"/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="changeMaker"lastEditted label="Colaborador" {...register("changeMaker")} name="changeMaker" autoComplete="family-name" value={user_name}/>
   
    <TextField style={{width:"630px", marginTop:"0"}} required fullWidth id="description"lastEditted label="Cliente" value={sale?.client.nome_razao_social} defaultValue={" "}  name="client" autoComplete="family-name"/>
    <TextField style={{width:"630px", marginTop:"0"}} required fullWidth id="description"lastEditted label="Descrição" value={sale?.description} defaultValue={" "} name="description" autoComplete="family-name"/>
  
   

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
          <Typography variant="h4">Venda</Typography>


          <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate sx={{ mt: 1 }}>
          {renderForm}
          </Box>







          {/**TABLE ITEMS */}
          <Box>
            <Table sx={{ minWidth: 600, marginTop: "25px" }} aria-label="spanning table">

                    <TableHead>
                      <TableRow>
                        <TableCell align="center" colSpan={6}>
                          ITENS
                        </TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                      <TableRow style={{height:"100%", padding:"0"}}>
                        <TableCell>Item</TableCell>
                        <TableCell align="center">Qtd</TableCell>
                        <TableCell align="center">Valor Unit</TableCell>
                        <TableCell align="center">Desconto Unit</TableCell>
                        <TableCell align="center">Valor com Desc</TableCell>
                        <TableCell align="center">Sub Total</TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>



              {
                sale?.itens.map((item)=>{

                  const total = sale.itens.reduce((acc, item) => {
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
                          <TableCell align="center">{item.qty}</TableCell>
                          <TableCell align="center">R${item.produto.preco}</TableCell>
                          <TableCell align="center">R${item.disccount}</TableCell>
                          <TableCell align="center">R${item.produto.preco - item.disccount}</TableCell>
                          <TableCell align="center">R${(item.qty * item.produto.preco) - (item.disccount * item.qty)}</TableCell>
                          <TableCell align="center"></TableCell>
      
                        </TableRow>

      
                      <TableRow >
      
      
      
      
      
      
      
      
      
      

                      </TableRow>
      
                    </TableBody>
                    
                    </>
      


                  )
                  
                })
                
              }
              {
              <TableCell style={{width:"150px", fontWeight:"bold"}} align="right"> Total R$ {sale?.itens.reduce((acc, item) => {
                const preco = typeof item.produto.preco !== 'undefined' ? parseFloat(item.produto.preco) : 0;
                const desconto = parseFloat(item.disccount);
                const qty = typeof item.qty !== 'undefined' ? parseFloat(item.qty) : 0;
                const itemTotal = (preco - desconto) * qty;
                return acc + itemTotal;
              }, 0)}</TableCell>
              }
              {
                sale?.dispatchValue !== "0" &&
              <TableCell style={{width:"150px", fontWeight:"bold"}} align="right"> Frete R$ {sale?.dispatchValue}</TableCell>
              }

            </Table>
          </Box>












          {/**TABLE RECEIVABLES */}
          <Box>
          {

              receivableMode && (

                /**TABLE*/
                <Table sx={{ minWidth: 600, maxHeight: 100 }} aria-label="spanning table">


                {/**TABLE HEADER */}
                  <TableHead>

                        <TableRow>
                          <TableCell align="center" colSpan={6}>Receber este valor</TableCell>
                        </TableRow>




                  </TableHead>






                  {/**RENDERED RECEIVABLES
                   *  
                   **/}
                  <Box>



                {/**RECEIVING ITEM 
                 *  RENDER THE CHOOSED RECEIVEMENT TO CHOOSE PAYMENT METHOD
                 **/}
                  {
                    receivableMode &&

                      <Box component="form" >
                          <TableRow key={receivingItem.id}>
                          <TableCell>R$ {receivingItemRemaining}</TableCell>
                          <TableCell align="right">{receivingItem.dueDate}</TableCell>

                          <TableCell align="right">



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

                          </TableCell>
                          <TableCell>
                            <input placeholder="R$" style={{borderRadius:"8px", border:"none", backgroundColor:"lightgray", padding:"5px"}} onChange={(e)=>{setReceivingItemAmount(e.target.value)}}/>
                          </TableCell>
                          <TableCell>
                            <Box>/
                              <p onClick={()=>{receiveValue({data: getDataAtualFormatada(), amount: receivingItemAmount, type: receivingItemPayMethod, user: user_name});}} style={{cursor:"pointer", border:"2pt solid black", padding:"4px", borderRadius:"8px"}}>Receber</p>
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
            !receivableMode &&
            <Table sx={{ minWidth: 600, marginTop: "25px" }} aria-label="spanning table">
            <TableHead>

              <TableRow>
                <TableCell align="center" colSpan={6}>PARCELAS</TableCell>
              </TableRow>



              <TableRow>
                    <TableCell align="center">Vencimento</TableCell>
                    <TableCell align="center">Quantia</TableCell>
                    <TableCell align="center">Recebido</TableCell>
                    <TableCell align="center">...</TableCell>
              </TableRow> 

            </TableHead>



              {
                sale?.receivables.map((receivable)=>{

                  const dataArray = receivable.receivements;
                  let totalReceived = 0;
                  dataArray.forEach(item => {
                    const amountMatch = item.match(/amount:(\d+)/);
                    if (amountMatch && amountMatch[1]) {
                      totalReceived += parseInt(amountMatch[1], 10);
                    }
                  });

                  const canReceive = receivable.amount - totalReceived !== 0;

                  return(

                    <>

                      <TableBody style={{height:"100px", overflow:"scroll"}}>
      
                      <TableRow key={receivable.id}>
                                  <TableCell align="center">{receivable.dueDate}</TableCell>
                                  <TableCell align="center">R$ {parseFloat(receivable.amount).toFixed(2)}</TableCell>
                                  <TableCell align="center">R$ {totalReceived.toFixed(2)}</TableCell>
                                  {
                                    canReceive &&
                                    <TableCell align="center"><p style={{border:"none", padding:"15px", backgroundColor:"green", color:"white", fontWeight:"bold", borderRadius:"18px", cursor:"pointer", boxShadow:"1pt 1pt 5pt black"}} onClick={()=>{ handleReceivingItemChange(receivable); console.log("fui clicado") }}>Receber</p></TableCell>
                                  }
                                  {
                                    !canReceive &&
                                    <TableCell align="center"><p style={{border:"none", padding:"15px", backgroundColor:"lightblue", color:"black", fontWeight:"bold", borderRadius:"18px", cursor:"pointer", boxShadow:"1pt 1pt 5pt black"}}>OK</p></TableCell>
                                  }
                                  
                      </TableRow>

      
                    </TableBody>
                    </>
      


                  )
                })
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
                  onClick={()=>{deleteSale(sale?.id)}}
                >
                  Cancelar Venda
                </Button>
            </Box>

          </Stack>

        </Card>
      </Stack>

    </Box>
  );
}
