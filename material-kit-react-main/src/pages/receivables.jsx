/* eslint-disable */
import { Helmet } from 'react-helmet-async';

import ReceivablesView from 'src/sections/receivables/view/receivables-view';

// ----------------------------------------------------------------------

export default function ReceivablesPage() {
  return (
    <>
      <Helmet>
        <title> Gesttor </title>
      </Helmet>

      <ReceivablesView />
    </>
  );
}
