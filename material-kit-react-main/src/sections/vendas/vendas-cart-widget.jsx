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


  const [showCartModal, setShowCartModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [parcelas, setParcelas] = useState(1);
  const [formaPagamentoParcelas, setFormaPagamentoParcelas] = useState(Array(parcelas).fill([]));


  const [freteValue, setFreteValue] = useState(0);

  const [generateReceivables, setGenerateReceivables] = useState(true);
  const [generateOs, setGenerateOs] = useState(false);
  const [generateDispatch, setGenerateDispatch] = useState(true);


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
  



  return (
    <>
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

                <TableRow>
                  <TableCell align="right"> Total R$ {thisSale?.itens.reduce((total,item)=>{const precoComDesconto=item.produto.preco-item.disccount;const subtotal=precoComDesconto*item.qty;return total+subtotal;}, 0)}</TableCell>
                </TableRow>

              </TableBody>

            </Table>

            {
              checkoutStep === 0 &&
                <FormGroup sx={{margin:"40px 0"}}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Gerar Títulos A Receber" />
                <FormControlLabel control={<Checkbox />} label="Gerar Ordem de Serviço" />
                <FormControlLabel control={<Checkbox />} label="Despacho por Transportadora" />
    
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
                  <p>Valor da parcela: R$ {((thisSale?.itens.reduce((total,item)=>{const precoComDesconto=item.produto.preco-item.disccount;const subtotal=precoComDesconto*item.qty;return total+subtotal;}, 0))  / parcelas).toFixed(2)}</p>
                </Box>
              )
            }


            {checkoutStep === 2 && (
              <Box>
                {/* ... (outros elementos) */}
                {Array.from({ length: parcelas }).map((_, index) => (
                  <div style={{display:"flex", flexDirection:"column"}}>
                    <p> Parcela {index + 1} : R$ {((thisSale?.itens.reduce((total, item) => {
                      const precoComDesconto = item.produto.preco - item.disccount;
                      const subtotal = precoComDesconto * item.qty;
                      return total + subtotal;
                    }, 0)) / parcelas).toFixed(2)}</p>
                    <FormGroup sx={{ margin: "0 0" }} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px", flexWrap: "nowrap" }}>
                      {/* Substituir os Checkbox por Select */}
                      <select
                        value={formaPagamentoParcelas[index]}
                        onChange={(e) => handleReceivablesChange(index, e.target.value)}
                      >
                        <option value="">Forma de Pagamento</option>
                        <option value="A Vista">A Vista</option>
                        <option value="Pix">Pix</option>
                        <option value="Cartão Débito">Cartão Débito</option>
                        <option value="Cartão Crédito">Cartão Crédito</option>
                        <option value="A Prazo">A Prazo</option>
                      </select>
                      <TextField placeholder='01/01/2018' label='Data Vencimento' defaultValue={getDataAtualFormatada()}></TextField>
                    </FormGroup>
                  </div>
                ))}
              </Box>
            )}

          
                    {
                      checkoutStep !== 2 &&
                      <Button sx={{bgcolor:"green", color:"white"}} onClick={()=>{setCheckoutStep(checkoutStep + 1);}} >Continuar</Button>
                    }

                    {
                      checkoutStep === 2 &&
                      <Button sx={{bgcolor:"green", color:"white"}} onClick={()=>{setCheckoutStep(checkoutStep + 1);}} disabled={formaPagamentoParcelas.length !== parcelas}>Continuar</Button>
                    }



          </TableContainer>




        </div>
      </div>
    }
    </>

  );
}
