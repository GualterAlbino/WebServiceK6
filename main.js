// k6 run --insecure-skip-tls-verify main.js
import { sleep } from 'k6';
import { obterLog } from './Base/EstruturaRest.js';
import { USUARIOS_VIRTUAIS, QTD_USUARIOS_VIRTUAIS, TEMPO_DURACAO_TESTE } from './Base/Constantes.js';
import { FluxoAutenticacao, FluxoEdicaoCliente, FluxoIncluirPedidoVenda, FluxoExcluirPedidoVenda, FluxoGerarRelatorio } from './Fluxos/Fluxos.js';

// Configurações do teste
export let options = {
  vus: QTD_USUARIOS_VIRTUAIS, // Usuários virtuais simultâneos
  duration: TEMPO_DURACAO_TESTE // Duração do teste
};

// Função principal do teste
export default async function () {
  const valorMaximo = USUARIOS_VIRTUAIS.length;
  const indiceAleatorio = Math.floor(Math.random() * valorMaximo);
  const usuario = USUARIOS_VIRTUAIS[indiceAleatorio];

  FluxoAutenticacao(usuario);
  sleep('1s');
  FluxoEdicaoCliente(usuario);
  sleep('1s');
  FluxoIncluirPedidoVenda(usuario);
  sleep('1s');
  FluxoExcluirPedidoVenda(usuario);
  sleep('1s');
  FluxoGerarRelatorio(usuario);
  sleep('1s');

  obterLog(usuario);
  sleep('1s');

}
