/* eslint-disable */
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------


export default function ShopProductCard({ product, handleEditProduct }) {

  console.log(product)


  const renderStatus = (
    <Label
      variant="filled"
      color={(product.ItemCompra.length > 0   && 'info') || 'error'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {product.ItemCompra.length < 1 &&
        <span>Sem estoque</span>
      }

      {product.ItemCompra.length > 0 &&
        <span> ({product.ItemCompra.length - product.ItemVenda.length}) Em Estoque</span>
      }

    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={product.imagem_principal}
      src={product.imagem_principal}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      R{fCurrency(product.preco)}
    </Typography>
  );

  return (
    <Card onClick={()=>{handleEditProduct(product.id)}} sx={{ cursor:"pointer" }}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderStatus}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" Wrap>
          {product.nome}
        </Link>
        <span style={{fontSize:"10px"}}>Cod: {product.cod}</span>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {renderPrice}
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
        </Stack>

      </Stack>
    </Card>
  );

}

ShopProductCard.propTypes = {
  product: PropTypes.object,
};
