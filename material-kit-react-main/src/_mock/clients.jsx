/* eslint-disable */
import { sample } from 'lodash';
import { faker } from '@faker-js/faker';
import api from 'src/services/api';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------


export const users = [...Array(24)].map((_, index) => ({

  
  nome_razao_social: "teste",
  apelido_nome_fantasia: `teste`,
  celular: "teste",
  telefone: "teste",
  cidade: "teste",
  estado: "teste",

}));
