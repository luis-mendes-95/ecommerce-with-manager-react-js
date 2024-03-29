/* eslint-disable */
import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

export default function ProductsTableRow({
  id,
  cod,
  transferMode,
  product,
  nome_razao_social,
  total,
  estoque,
  selected,
  handleEditProduct,
  handleTransferItems,
  estoqueToRender
}) {

  const [open, setOpen] = useState(null);
  const [isChecked, setIsChecked] = useState(false);


  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };



  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected} sx={{cursor:"pointer"}} onClick={()=>{ if(!transferMode){handleEditProduct(id)};}}>

        {
          transferMode &&
          <>
            <TableCell>
              <Checkbox checked={isChecked} onChange={()=>{setIsChecked(!isChecked); handleTransferItems("check", id, !isChecked, estoqueToRender)}}/>
            </TableCell>

            <TableCell style={{width:"10%"}}>
              <TextField style={{width:"100%"}} onInput={(e)=>{handleTransferItems("qty", id, e.target.value, estoqueToRender)}}/>
            </TableCell>
          </>
        }
     
        <TableCell>{cod}</TableCell>

        <TableCell>{product}</TableCell>

        <TableCell>{estoque}</TableCell>

        <TableCell>{total}</TableCell>

      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

ProductsTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
