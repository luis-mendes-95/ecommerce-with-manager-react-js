/* eslint-disable */
import { Helmet } from 'react-helmet-async';
import { ComprasView } from 'src/sections/compras/view';



// ----------------------------------------------------------------------

export default function ComprasPage() {
  return (
    <>
      <Helmet>
        <title> COMPRAS </title>
      </Helmet>

      <ComprasView />
      
    </>
  );
}
