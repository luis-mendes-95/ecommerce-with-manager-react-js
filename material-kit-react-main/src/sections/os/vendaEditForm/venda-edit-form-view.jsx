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

export default function VendaEditFormView({osToEdit, getOs, thisOs}) {
  
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
const [addingMockup, setAddingMockup] = useState(false);
const [addingPrintFile, setAddingPrintFile] = useState(null);
const [itemAddingMockup, setItemAddingMockup] = useState(null);
const [itemAddingPrintFile, setItemAddingPrintFile] = useState(null);
const [urlAddingMockup, setUrlAddingMockup] = useState(null);
const [urlAddingFile, setUrlAddingFile] = useState(null);
const [urlAddingPrintFile, setUrlAddingPrintFile] = useState(null);



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


const handleUrlMockup = (value) => {
  setUrlAddingMockup(value)
}




const handleUrlPrintFile = (value) => {
  setUrlAddingPrintFile(value)
}


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
        getSale(osToEdit.id);
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


/**DELETE OS */
const deleteOs = async (id) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.delete(`os/${id}`, config);
    if (response.status === 200) {
      toast.success("Ordem de Serviço deletada com sucesso!", {
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
    toast.error("Erro ao deletar ordem de serviço!", {
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



const handlePaymentChange = (payment) => {
  // Handle the change as needed
  console.log('Payment Change:', payment);
};

const renderPaymentRow = (payment) => {
  const dataArray = payment.payments; // Assuming payments is the correct field
  let totalReceived = 0;

  dataArray.forEach((item) => {
    const amountMatch = item.match(/amount:(\d+)/);
    if (amountMatch && amountMatch[1]) {
      totalReceived += parseInt(amountMatch[1], 10);
    }
  });

  const canReceive = payment.amount - totalReceived !== 0;

  return (
    <TableBody style={{ height: "100px", overflow: "scroll" }}>
      <TableRow key={payment.id}>
        <TableCell align="center">{payment.dueDate}</TableCell>
        <TableCell align="center">R$ {parseFloat(payment.amount).toFixed(2)}</TableCell>
        <TableCell align="center">R$ {totalReceived.toFixed(2)}</TableCell>
        {canReceive && (
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
                const paymentData = `data:${getDataAtualFormatada()}, amount:${receivingItemAmount}, type:${receivingItemPayMethod}, user:${user_name}`;
                handlePayment(
                  getDataAtualFormatada(),
                  receivingItemAmount,
                  receivingItemPayMethod,
                  user_name
                );
                receiveValue(paymentData);
              }}
            >
              Receber
            </p>
          </TableCell>
        )}
        {!canReceive && (
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



/**HANDLE GET OS */
const handleGetOs = (id) => {
  getOs(id)
}


const addOrChangeMockup = async (id) => {

  let createData = {
    mockup: urlAddingMockup,
    status: "Aguardando Cliente"
  }





  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.patch(`itemOs/${id}`, createData, config);
    if (response.data) {
      toast.success("Mockup editado!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });
      setAddingMockup(!addingMockup);
      handleGetOs(response.data.id);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao editar mockup!", {
      position: "bottom-right", 
      autoClose: 3000, 
      hideProgressBar: false, 
      closeOnClick: true, 
      pauseOnHover: true, 
      draggable: true, 
      progress: undefined, 
    });
  }

  handleOsStatusByItems();
}




const addOrChangePrintFile = async (id) => {

  let createData = {
    printFile: urlAddingPrintFile,
    status: "Aguardando Impressão"
  }





  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.patch(`itemOs/${id}`, createData, config);
    if (response.data) {
      toast.success("Arquivo de impressão inserido!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });
      setAddingPrintFile(!addingPrintFile);
      handleGetOs(response.data.id);
      handleOsStatusByItems();
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao inserir arquivo de impressão!", {
      position: "bottom-right", 
      autoClose: 3000, 
      hideProgressBar: false, 
      closeOnClick: true, 
      pauseOnHover: true, 
      draggable: true, 
      progress: undefined, 
    });
  }
}



const handleOsStatusByItems = async () => {

  let aguardandoArte = 0
  let aguardandoCliente = 0
  let aprovado = 0
  let aguardandoImpressao = 0
  let emProducao = 0
  let concluido = 0

  let osStatus = "";

  thisOs.itens.map((item)=>{

    if(item.status === "Aguardando Arte" || item.status === "AGUARDANDO ARTE") {
      aguardandoArte += 1;
    } else if (item.status === "Aguardando Cliente" || item.status === "AGUARDANDO CLIENTE") {
      aguardandoCliente += 1;
    } else if (item.status === "APROVADO" || item.status === "Aprovado") {
      aprovado += 1;
    } else if (item.status === "Aguardando Impressão" || item.status === "AGUARDANDO IMPRESSÃO") {
      aguardandoImpressao += 1;
    } else if (item.status === "EM PRODUÇÃO" || item.status === "Em Produção") {
      emProducao += 1;
    } else if (item.status === "CONCLUÍDO" || item.status === "Concluído") {
      concluido += 1;
    }  
  })

  if (aguardandoArte > 0) {
    osStatus = "Aguardando Arte"
  } else if (aguardandoArte === 0 && aguardandoCliente > 0) {
    osStatus = "Aguardando Cliente"
  } else if (aguardandoArte === 0 && aguardandoCliente === 0 && aprovado > 0) {
    osStatus = "Aprovado"
  } else if (aguardandoArte === 0 && aguardandoCliente === 0 && aprovado === 0 && aguardandoImpressao > 0) {
    osStatus = "Aguardando Impressão"
  } else if (aguardandoArte === 0 && aguardandoCliente === 0 && aprovado === 0 && aguardandoImpressao > 0 && emProducao > 0) {
    osStatus = "Em Produção"
  } else if (aguardandoArte === 0 && aguardandoCliente === 0 && aprovado === 0 && aguardandoImpressao > 0 && emProducao === 0 && concluido > 0) {
    osStatus = "Concluído"
  }

  let createData = {
    status: osStatus
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.patch(`os/${thisOs.id}`, createData, config);
    if (response.data) {
      toast.success("Status atualizado!", {
        position: "bottom-right", 
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
      });
      handleGetOs(thisOs.id);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao atualizar status!", {
      position: "bottom-right", 
      autoClose: 3000, 
      hideProgressBar: false, 
      closeOnClick: true, 
      pauseOnHover: true, 
      draggable: true, 
      progress: undefined, 
    });
  }
}





const handleAddOrChangeMockup = (id) => {
  setAddingMockup(!addingMockup)
  setItemAddingMockup(id);
}




const handleAddOrChangePrintFile = (id) => {
  setAddingPrintFile(!addingPrintFile)
  setItemAddingPrintFile(id);
}



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
      





useEffect(() => {

  getOs(osToEdit.osToEdit)

}, [])



//FORM INPUTS, SELECTS AND BUTTONS
const renderForm = (
  <>
    <Stack spacing={3} style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", alignContent:"center", gap:"15px", flexWrap:"wrap"}}>

    <TextField style={{width:"200px"}} autoComplete="given-name" {...register("createdAt")} value={thisOs?.createdAt} defaultValue={" "} name="createdAt" required fullWidth id="createdAt" label="Data de cadastro" autoFocus/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="lastEditted" value={thisOs?.lastEditted} defaultValue={" "} label="Última Edição" {...register("lastEditted")} name="lastEditted" autoComplete="family-name"/>
    <TextField style={{width:"200px", marginTop:"0"}} required fullWidth id="changeMaker"lastEditted label="Colaborador" {...register("changeMaker")} name="changeMaker" autoComplete="family-name" value={user_name}/>
   
    <TextField style={{width:"630px", marginTop:"0"}} required fullWidth id="description"lastEditted label="Cliente" value={thisOs?.client.nome_razao_social} defaultValue={" "}  name="client" autoComplete="family-name"/>
    <TextField style={{width:"630px", marginTop:"0"}} required fullWidth id="description"lastEditted label="Descrição" value={thisOs?.descricao} defaultValue={" "} name="description" autoComplete="family-name"/>
  
   

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
          <Typography variant="h4">Ordem de Serviço</Typography>


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

                      </TableRow>
                      <TableRow style={{height:"100%", padding:"0"}}>
                      <TableCell>Item</TableCell>
                        <TableCell align="center">Descrição</TableCell>
                        <TableCell align="center">Qtd</TableCell>
                        <TableCell align="center">Mockup</TableCell>
                        <TableCell align="center">Arquivo para Impressão</TableCell>
                        <TableCell align="center">Tipo de Arte</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>



              {
                thisOs?.itens.map((item)=>{

                  console.log(item)


                  return(



                    <>

      
                    <TableBody style={{height:"100px", overflow:"scroll"}}>
      
      

                        <TableRow key={item.id}> 
                          <TableCell>{item.produto.nome}</TableCell>
                          <TableCell align="center">{item.descricao}</TableCell>
                          <TableCell align="center">{item.qtd}</TableCell>
                          <TableCell align="center">
                            <img style={{width:"150px"}} src={item.mockup}/>
                            {
                              !addingMockup && 
                              <button onClick={()=>{handleAddOrChangeMockup(item.id)}} style={{backgroundColor:"lightgreen", width:"90px", color:"black", fontWeight:"bold", border:"none", padding:"8px", cursor:"pointer"}}>+</button>
                            }

                            {
                              addingMockup && itemAddingMockup === item.id &&
                              <Box style={{display:"flex", alignItems:"center", flexDirection:"column"}}>
                                  <TextField label="Url da imagem" onInput={(e)=>{handleUrlMockup(e.target.value)}}></TextField>

                                  ou

                                  <button style={{padding:"10px"}}>Fazer Upload de Imagem</button>
                                  <button style={{padding:"5px", margin:"5px", backgroundColor:"green", color:"white", border:"none", borderRadius:"8px", cursor:"pointer"}} onClick={()=>{addOrChangeMockup(item.id)}}>Enviar</button>
                                  <button style={{padding:"5px", margin:"5px", backgroundColor:"brown", color:"white", border:"none", borderRadius:"8px", cursor:"pointer"}} onClick={()=>{setAddingMockup(false); setItemAddingMockup(null);}}>Cancelar</button>
                              </Box>
                            }
                          </TableCell>
                          <TableCell align="center">





                            {
                              item.printFile !== "" &&
                              <button>Baixar</button>
                            }
                            {
                              item.printFile === "" &&
                              <p>Nenhum</p>
                            }







                            {
                              !addingPrintFile && 
                              <button onClick={()=>{handleAddOrChangePrintFile(item.id)}} style={{backgroundColor:"lightgreen", width:"90px", color:"black", fontWeight:"bold", border:"none", padding:"8px", cursor:"pointer"}}>+</button>
                            }

                            {
                              addingPrintFile && itemAddingPrintFile === item.id &&
                              <Box style={{display:"flex", alignItems:"center", flexDirection:"column"}}>
                                  <TextField label="Url do arquivo" onInput={(e)=>{handleUrlPrintFile(e.target.value)}}></TextField>

                                  ou

                                  <button style={{padding:"10px"}}>Fazer Upload do arquivo</button>
                                  <button style={{padding:"5px", margin:"5px", backgroundColor:"green", color:"white", border:"none", borderRadius:"8px", cursor:"pointer"}} onClick={()=>{addOrChangePrintFile(item.id)}}>Enviar</button>
                                  <button style={{padding:"5px", margin:"5px", backgroundColor:"brown", color:"white", border:"none", borderRadius:"8px", cursor:"pointer"}} onClick={()=>{setAddingPrintFile(false); setItemAddingPrintFile(null);}}>Cancelar</button>
                              </Box>
                            } 





                          </TableCell>
                          <TableCell align="center">{item.tipo_arte}</TableCell>
  

                          {
                            item.status === "Aguardando Arte" &&
                            <TableCell align="center" style={{backgroundColor:"orange"}}>{item.status.toUpperCase()}</TableCell>
                          }


                          {
                            item.status === "Aguardando Cliente" &&
                            <TableCell align="center" style={{backgroundColor:"lightblue"}}>{item.status}</TableCell>
                          }




      
                        </TableRow>

      
                      <TableRow >
      
      
      
      
      
      
      
      
      
      

                      </TableRow>
      
                    </TableBody>
                    
                    </>
      


                  )
                  
                })
                
              }


            </Table>
          </Box>




















          {/**TABLE PAYMENTS */}
          <Box>


            <Table sx={{ minWidth: 600, marginTop: "25px" }} aria-label="spanning table">
            <TableHead>

              <TableRow>
                <TableCell align="center" colSpan={6}>INSTRUÇÕES</TableCell>
              </TableRow>



              <TableRow>
                    <TableCell align="left">Data</TableCell>
                    <TableCell align="left">Usuário</TableCell>
                    <TableCell align="center">Descrição</TableCell>

              </TableRow> 

            </TableHead>



            {
              thisOs?.instrucoes.map((instrucao, index) => (
                <TableBody key={index} style={{ height: "10px", overflow: "scroll" }}>
                  <TableRow style={{ borderBottom: "1px solid #ccc" }}>

                  <TableCell align="left" style={{ padding: "10px", fontSize: "16px", fontWeight: "bold" }}>{instrucao.createdAt}</TableCell>
                  <TableCell align="left" style={{ padding: "10px", fontSize: "16px", fontWeight: "bold" }}>{instrucao.changeMaker}</TableCell>
                  <TableCell align="center" style={{  }}>{instrucao.descricao}</TableCell>

                  </TableRow>
                </TableBody>
              ))
            }

            </Table>

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
                  onClick={()=>{deleteOs(thisOs?.id)}}
                >
                  Cancelar Ordem de Serviço
                </Button>
            </Box>

          </Stack>

        </Card>
      </Stack>

    </Box>
  );
}
