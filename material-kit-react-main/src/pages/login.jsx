/* eslint-disable */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect  } from 'react';

import { LoginView } from 'src/sections/login';
import { useRouter } from 'src/routes/hooks';
import api from 'src/services/api';
import { useForm } from 'react-hook-form';
import "react-toastify/dist/ReactToastify.css";

// ----------------------------------------------------------------------

export default function LoginPage() {

  return (
    <>
      <Helmet>
        <title> LOGIN </title>
      </Helmet>

      <LoginView />
    </>
  );
}
