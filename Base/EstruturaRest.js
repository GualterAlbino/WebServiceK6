import http from 'k6/http';
import { HOST } from './Constantes.js';
import { sleep } from 'k6';
let contador = 0;

function montarLog(pUsuario = null, pDescricao = null, pResponse = null) {
  if (!pUsuario || !pDescricao || !pResponse) return;
  try {
    const status = pResponse.status;
    const resposta = pResponse.body;
    const tempo = pResponse.timings.duration / 1000;
    const log = `[${++contador}][${pUsuario.username}] - ${pDescricao} - Status: ${status} - Tempo: ${tempo}s`;

    if (status >= 200 && status < 300) {
      console.log(log);
    } else if (status == 400 || status == 500) {
      console.error(log);

      if (resposta.includes('Access violation at address')) {
        console.error('\n\n\n');
        console.error('[][][][][][][][]');
        console.error(`[${contador}][${pUsuario.username}] Erro: ${resposta}`);
        console.error('[][][][][][][][]');
        console.error('\n\n\n');
      }
      console.error(`[${contador}][${pUsuario.username}] Erro: ${resposta}`);
    } else {
      console.warn(log);
    }
  } catch (error) {
    console.log('\n\n');
    console.error(`Erro ao montar log: ${error}`);
    console.log('\n\n');
  }
}

export function getGenerico(pEndpoint = null, pUsuario = null, pDescricao = null) {
  if (!pEndpoint || !pUsuario || !pDescricao) return;

  const URLMontada = `${HOST}${pEndpoint}`;
  const res = http.get(URLMontada, {
    headers: {
      Authorization: pUsuario.token
    }
  });

  montarLog(pUsuario, pDescricao, res);
  return res;
}

export function getGenericoComBody(pEndpoint = null, pUsuario = null, pBody = null, pDescricao = null) {
  if (!pEndpoint || !pUsuario || !pBody || !pDescricao) return;
  const URLMontada = `${HOST}${pEndpoint}`;
  const res = http.post(URLMontada, JSON.stringify(pBody), {
    headers: {
      Authorization: pUsuario.token
    },
    timeout: 300000
  });

  montarLog(pUsuario, pDescricao, res);
  return res;
}

export function postGenerico(pEndpoint = null, pBody = null, pUsuario = null, pDescricao = null) {
  if (!pEndpoint || !pBody || !pUsuario || !pDescricao) return;
  const URLMontada = `${HOST}${pEndpoint}`;
  const res = http.post(URLMontada, JSON.stringify(pBody), {
    headers: {
      Authorization: pUsuario.token
    }
  });

  montarLog(pUsuario, pDescricao, res);
  return res;
}

export function getConsultaDinamica(pUsuario = null, pBody = null, pDescricao = null) {
  if (!pUsuario || !pBody || !pDescricao) return;
  const URLMontada = `${HOST}/api/consulta/dinamica`;
  const res = http.post(URLMontada, JSON.stringify(pBody), {
    headers: {
      Authorization: pUsuario.token,
      'Content-Type': 'application/json'
    }
  });

  montarLog(pUsuario, pDescricao, res);
  return res;
}

export function postCadastroDinamico(pUsuario = null, pBody = null, pDescricao = null) {
  if (!pUsuario || !pBody || !pDescricao) return;
  const URLMontada = `${HOST}/api/cadastro/dinamico`;
  const res = http.post(URLMontada, JSON.stringify(pBody), {
    headers: {
      Authorization: pUsuario.token,
      'Content-Type': 'application/json'
    }
  });

  montarLog(pUsuario, pDescricao, res);
  return res;
}

export function obterLog(pUsuario = null) {
  if (!pUsuario) return;
  const URLMontada = `${HOST}/log`;
  let res = http.get(URLMontada, {});

  montarLog(pUsuario, 'Log - Monitor', res);

  return res;
}

// Função btoa para codificar em base64 (implementação em JavaScript)
function btoa(str) {
  let base64 = '';
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  for (let i = 0; i < str.length; i += 3) {
    const a = str.charCodeAt(i);
    const b = str.charCodeAt(i + 1);
    const c = str.charCodeAt(i + 2);

    const d = (a << 16) | (b << 8) | c;

    base64 += charset.charAt((d >> 18) & 63) + charset.charAt((d >> 12) & 63) + charset.charAt((d >> 6) & 63) + charset.charAt(d & 63);
  }

  // Adicionar padding '=' se necessário
  const padding = str.length % 3;
  if (padding === 1) base64 += '==';
  else if (padding === 2) base64 += '=';

  return base64;
}

export async function autenticar(pUsuario = null, pEmpresa = null, pUnidadeFabril = null) {
  if (!pUsuario) return;

  // Codificar as credenciais em base64
  let credentials = `${pUsuario.username}:${pUsuario.password}`;
  let encodedCredentials = btoa(credentials);

  let url = `${HOST}/auth/login/vendas`;
  if (pEmpresa) {
    url = `${url}/${pEmpresa}`;
  }
  if (pUnidadeFabril) {
    url = `${url}/${pUnidadeFabril}`;
  }

  // Fazer a solicitação HTTP com o cabeçalho de autorização
  let res = http.get(`${url}`, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`
    }
  });

  if (!res) {
    return;
  }
  montarLog(pUsuario, 'Login', res);
  //const body = JSON.parse(JSON.stringify(res)).body;
  //pUsuario.token = body;
  return res;
}
