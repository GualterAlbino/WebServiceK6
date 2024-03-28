import { sleep } from 'k6';
import { bodyGerarRelatorio1 } from '../DadosBody/Relatorio.js';
import { bodyGravarPedido1 } from '../DadosBody/PedidoDeVenda.js';
import { autenticar, getGenerico, getGenericoComBody } from '../Base/EstruturaRest.js';
import { consultarPedidos, abrirCadastroPedido, excluirPedidoVenda, incluirPedidoVenda } from './OperacoesPedidoDeVenda.js';
import { abrirCadastroCliente, consultarClientes, entrarModoEdicaoCliente, gravarCadastroEditadoCliente } from './OperacoesClientes.js';

export function FluxoAutenticacao(pUsuario = null) {
  //------------------
  // Fluxo de autenticação
  //-----------------
  if (!pUsuario) return;

  autenticar(pUsuario);

  const infoProfile = JSON.parse(getGenerico('/api/profile/info', pUsuario, 'Info do Perfil').body);
  if (!infoProfile) return;
  /*
  let empresa = infoProfile.empresas[0].codigo;
  let unidadeFabril = 0;
  if (infoProfile.utilizaUnidadeFabril) {
    unidadeFabril = infoProfile.unidadesFabris[0].codigo;
  }

  autenticar(pUsuario, empresa, unidadeFabril);

  getGenerico('/api/profile/config', pUsuario, 'Config do Perfil');

  getGenerico('/api/mensagem/quantidade', pUsuario, 'Qtd de Mensagens');
  */
}

export function FluxoEdicaoCliente(pUsuario = null) {
  //------------------
  // Fluxo completo de consulta/edição de clientes
  //-----------------
  const codigoCliente = consultarClientes(pUsuario);
  sleep('1s');

  const cadastroCliente = abrirCadastroCliente(pUsuario, codigoCliente);
  sleep('1s');

  entrarModoEdicaoCliente(pUsuario, codigoCliente);
  sleep('1s');

  gravarCadastroEditadoCliente(pUsuario, cadastroCliente);
  sleep('1s');
}

export function FluxoGerarRelatorio(pUsuario = null) {
  if (!pUsuario) return;

  getGenericoComBody('/api/relatorio/pedido/venda/78', pUsuario, bodyGerarRelatorio1, 'Gerar Relatório');
}

export function FluxoIncluirPedidoVenda(pUsuario = null) {
  if (!pUsuario) return;

  incluirPedidoVenda(pUsuario, bodyGravarPedido1);
}

export function FluxoExcluirPedidoVenda(pUsuario = null) {
  if (!pUsuario) return;

  const codigoPedido = consultarPedidos(pUsuario);

  if (!codigoPedido) return;

  abrirCadastroPedido(pUsuario, codigoPedido);

  excluirPedidoVenda(pUsuario, codigoPedido);
}
