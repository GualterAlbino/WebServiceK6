import { getGenerico, postGenerico } from '../Base/EstruturaRest.js';

/**
 * Consulta todos os relatorios disponiveis para a conexao do usuario,
 * e retorna um codigo de relatorio aleatorio
 */
export function consultarRelatoriosEspecificos(pUsuario = null) {
  try {
    if (!pUsuario) return;
    const response = getGenerico('/api/bi/relatorios', pUsuario, 'Consultar Relatórios');
    const relatorios = JSON.parse(response.body);

    //Selecionar um relatorio aleatoriamente
    const valorMaximo = relatorios.length - 1;
    const indiceAleatorio = Math.floor(Math.random() * valorMaximo);

    const relatorio = relatorios[indiceAleatorio];

    return relatorio.codigo;
  } catch (error) {
    return null;
  }
}

/**
 * Cosulta e retorna os filtros disponiveis para um relatorio especifico com os valores padrão preenchidos pra cada filtro
 */
export function consultarFiltrosRelatorioEspecifico(pUsuario = null, pCodigoRelatorio = null) {
  try {
    if (!pUsuario || !pCodigoRelatorio) return;
    const response = getGenerico(`/api/bi/relatorios/${pCodigoRelatorio}`, pUsuario, 'Consultar Filtros Relatório Especifico');
    const filtros = JSON.parse(response.body);
    return filtros;
  } catch (error) {
    return null;
  }
}

/**
 * Gera um relatorio especifico com os filtros passados
 */
export function gerarRelatorioEspecifico(pUsuario = null, pCodigoRelatorio = null, pBodyGerarRelatorio = null) {
  if (!pUsuario || !pCodigoRelatorio || !pBodyGerarRelatorio) return;

  const response = postGenerico(`/api/bi/relatorios}/${pCodigoRelatorio}`, pBodyGerarRelatorio, pUsuario, 'Gerar Relatório Especifico');
  const relatorio = JSON.parse(response.body);
  return relatorio;
}
