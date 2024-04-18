import { sleep } from 'k6';
import { bodyGerarRelatorio1, bodyGerarRelatorio2 } from '../DadosBody/Relatorio.js';
import { bodyGravarPedido1 } from '../DadosBody/PedidoDeVenda.js';
import { autenticar, getGenerico, postCadastroDinamico } from '../Base/EstruturaRest.js';
import { consultarPedidos, abrirCadastroPedido, excluirPedidoVenda, incluirPedidoVenda, validarDiferenciacoes } from './OperacoesPedidoDeVenda.js';
import { abrirCadastroCliente, consultarClientes, entrarModoEdicaoCliente, gravarCadastroEditadoCliente } from './OperacoesClientes.js';
import { gerarRelatorio } from '../Fluxos/OperacoesRelatorio.js';

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

export function FluxoGerarRelatorio(pUsuario = null, pTipo = null, pCodigoRelatorio = null, pBody = null) {
  if (!pUsuario) return;
  pTipo = 'cliente';
  pCodigoRelatorio = 45;
  pBody = bodyGerarRelatorio2;
  gerarRelatorio(pUsuario, pTipo, pCodigoRelatorio, pBody);
  //getGenericoComBody('/api/relatorio/pedido/venda/78', pUsuario, bodyGerarRelatorio1, 'Gerar Relatório');
}

export function FluxoIncluirPedidoVenda(pUsuario = null) {
  if (!pUsuario) return;

  const retorno = validarDiferenciacoes(pUsuario, bodyGravarPedido1.parametros);

  if (!retorno) return;

  incluirPedidoVenda(pUsuario, bodyGravarPedido1);
}

export function FluxoExcluirPedidoVenda(pUsuario = null) {
  if (!pUsuario) return;

  const codigoPedido = consultarPedidos(pUsuario);

  if (!codigoPedido) return;

  abrirCadastroPedido(pUsuario, codigoPedido);

  excluirPedidoVenda(pUsuario, codigoPedido);
}

export function FluxoDuplicarPedidoVenda(pUsuario = null) {
  if (!pUsuario) return;

  let pedido = null;
  let pedidoDuplicado = null;

  let codigoTabela = null;
  let codigoPedido = null;
  let codigoCliente = null;
  let codigoCondicao = null;

  codigoPedido = consultarPedidos(pUsuario);
  if (!codigoPedido) return;

  pedido = JSON.parse(abrirCadastroPedido(pUsuario, codigoPedido));
  if (!pedido) return;

  codigoCliente = pedido.cliente.codigo;
  if (!codigoCliente) return;

  codigoTabela = pedido.cliente.padraoCompra.tabelaPreco.codigo;
  if (!codigoTabela) return;

  codigoCondicao = pedido.cliente.padraoCompra.tabelaPreco.condicoes[0].codigo;
  if (!codigoCondicao) return;

  pedidoDuplicado = JSON.parse(duplicarPedidoVenda(pUsuario, codigoPedido, codigoCliente, codigoTabela, codigoCondicao));
  if (!pedidoDuplicado) return;

  const bodyGravarPedido = {
    nomeClasse: 'TCadastroPedidoVendaDAO',
    metodo: 'gravar',
    parametros: pedidoDuplicado
  };


  //Gravar Pedido
  postCadastroDinamico(pUsuario, bodyGravarPedido, 'Cadastro de Pedido(Gravar)');
}
