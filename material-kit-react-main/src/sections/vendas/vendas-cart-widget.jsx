/* eslint-disable */
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
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














export default function CartWidget({thisSale, deleteItemVenda}) {

  const [showCartModal, setShowCartModal] = useState(false);

  const cartModalFlipFlop = () => {
    setShowCartModal(!showCartModal);
  }



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
            <h1 style={{margin:"0", padding:"0"}}>CHECKOUT</h1>
            <button style={{height:"50px", width:"50px", backgroundColor:"brown", color:"white", fontWeight:"bold", border:"none", cursor:"pointer", borderBottomLeftRadius:"40px"}} onClick={cartModalFlipFlop}>X</button>
          </div>


          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={5}>
                    Confira os itens
                  </TableCell>
                  <TableCell align="right">Valor</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Qtd</TableCell>
                  <TableCell align="right">Valor Unit</TableCell>
                  <TableCell align="right">Desconto Unit</TableCell>
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
                    <TableCell align="right">R${(row.qty * row.produto.preco) - (row.disccount * row.qty)}</TableCell>
                    <TableCell align="right"><button style={{backgroundColor:"brown", color:"white", border:"none", padding:"15px", borderRadius:"8px", fontWeight:"bolder", cursor:"pointer"}} onClick={()=>{deleteItemVenda(row.id)}} >X</button></TableCell>

                  </TableRow>
                ))}

                <TableRow>
                  <TableCell align="right"> Total R$ {thisSale?.itens.reduce((total,item)=>{const precoComDesconto=item.produto.preco-item.disccount;const subtotal=precoComDesconto*item.qty;return total+subtotal;}, 0)}</TableCell>
                </TableRow>

              </TableBody>

            </Table>

            <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Gerar Ordem de Serviço" />
            <FormControlLabel control={<Checkbox defaultChecked />} label="Gerar Títulos A Receber" />

            </FormGroup>



          </TableContainer>




        </div>
      </div>
    }
    </>

  );
}
