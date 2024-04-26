import { getGenerico } from '../Base/EstruturaRest.js';

/**
 * Consulta todos os indicadores disponiveis para a conexao do usuario,
 * e retorna um codigo de indicador aleatorio
 */
export function consultarIndicadores(pUsuario = null) {
  try {
    if (!pUsuario) return;

    const indicadores = getGenerico('/api/bi/indicadores', pUsuario, 'Indicadores(Consultar)').body;

    if (!JSON.parse(indicadores)) {
      return;
    }

    //Selecionar um indicador aleatoriamente
    const valorMaximo = JSON.parse(indicadores).length - 1;
    const indiceAleatorio = Math.floor(Math.random() * valorMaximo);

    const indicador = JSON.parse(indicadores)[indiceAleatorio].codigo;

    return indicador;
  } catch (error) {
    return null;
  }
}

/**
 * Consulta um único indicador detalhado, trazendo seu valor e outras informações,
 */
export function consultarIndicadorDetalhado(pUsuario = null, codigoIndicador = null) {
  if (!pUsuario) return;
  if (!codigoIndicador) return;

  const indicador = getGenerico('/api/bi/indicadores/' + codigoIndicador, pUsuario, 'Indicadores(Consulta Detalhada)').body;

  if (!JSON.parse(indicador)) {
    return;
  }

  return indicador;
}
