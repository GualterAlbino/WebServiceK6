import { sleep } from 'k6';
import { getConsultaDinamica, postCadastroDinamico } from '../Base/EstruturaRest.js';

/**
 * Consulta um cliente aleatoriamente, e retorna o codigo desse cliente
 */
export function consultarClientes(pUsuario = null) {
  if (!pUsuario) return;

  const bodyConsultarClientes = {
    filtros: [
      {
        atributo: 'razaoSocial',
        valor: 'A',
        condicao: 'queContem'
      }
    ],
    tipo: 'classe',
    nome: 'TConsultaClienteDAO',
    tamanhoPaginacao: 100,
    pagina: 0
  };
  const clientes = getConsultaDinamica(pUsuario, bodyConsultarClientes, 'Cliente(Consultar)').body;
  sleep('3s');

  if (!JSON.parse(clientes)) {
    return;
  }

  //Selecionar um cliente aleatoriamente
  const valorMaximo = JSON.parse(clientes).length - 1;
  const indiceAleatorio = Math.floor(Math.random() * valorMaximo);

  const codigoCliente = JSON.parse(clientes)[indiceAleatorio].codigo;
  return codigoCliente;
}

/**
 * Abre o cadastro de um cliente e retorna os dados desse cliente
 */
export function abrirCadastroCliente(pUsuario = null, pCodigoCliente = null) {
  //Abrir o Cadastro de Cliente
  const bodyAbrirCadastroCliente = {
    nomeClasse: 'TCadastroClienteDAO',
    metodo: 'abrir',
    parametros: {
      codigo: pCodigoCliente
    }
  };
  //Pegar os dados do cliente
  const cadastroCliente = postCadastroDinamico(pUsuario, bodyAbrirCadastroCliente, 'Cadastro de Cliente(Abrir)').body;

  return cadastroCliente;
}

/**
 * Altera o estado do cadastro relacionado ao codigo do cliente para EDIÇÃO
 */
export function entrarModoEdicaoCliente(pUsuario = null, pCodigoCliente = null) {
  if (!pCodigoCliente) return;
  if (!pUsuario) return;

  //Entrar em modo de edição
  const bodyEditarCadastroCliente = {
    nomeClasse: 'TCadastroClienteDAO',
    metodo: 'alterar'
  };
  postCadastroDinamico(pUsuario, bodyEditarCadastroCliente, 'Cadastro Cliente(Editar)');
}

/**
 * Grava a edição do cliente de acordo com os dados passados
 */
export function gravarCadastroEditadoCliente(pUsuario = null, pCadastroCliente = null) {
  if (!pCadastroCliente) return;
  if (!pUsuario) return;

  //Gravar edicao
  const bodyGravarCadastroCliente = {
    nomeClasse: 'TCadastroClienteDAO',
    metodo: 'gravar',
    parametros: JSON.parse(pCadastroCliente)
  };
  postCadastroDinamico(pUsuario, bodyGravarCadastroCliente, 'Cadastro de Cliente(Gravar)');
}
