/* eslint-disable */
import { Box } from '@mui/material';
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



const TAX_RATE = 0.07;

function ccyFormat(num) {
  return parseFloat(num).toFixed(2);
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}



function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;





































export default function CartWidget({thisSale}) {

  const [showCartModal, setShowCartModal] = useState(false);

  const cartModalFlipFlop = () => {
    setShowCartModal(!showCartModal);
  }


  console.log(thisSale?.itens.length)

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
            <button style={{height:"50px", width:"50px", backgroundColor:"brown", color:"white", fontWeight:"bold", border:"none"}} onClick={cartModalFlipFlop}>X</button>
          </div>


          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={4}>
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
                    <button>x</button>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell align="right"> Total R$ {thisSale?.itens.reduce((total,item)=>{const precoComDesconto=item.produto.preco-item.disccount;const subtotal=precoComDesconto*item.qty;return total+subtotal;}, 0)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>




        </div>
      </div>
    }
    </>

  );
}
