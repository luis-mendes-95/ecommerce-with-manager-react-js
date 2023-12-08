/* eslint-disable */
import { Helmet } from 'react-helmet-async';
import { VendasView } from 'src/sections/vendas/view';



// ----------------------------------------------------------------------

export default function VendasPage() {
  return (
    <>
      <Helmet>
        <title> Vendas </title>
      </Helmet>

      <VendasView />
      
    </>
  );
}
