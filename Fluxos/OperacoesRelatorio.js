import { sleep } from 'k6';
import { getConsultaDinamica, postCadastroDinamico, getGenericoComBody, autenticar, getGenerico, obterLog, postGenerico } from '../Base/EstruturaRest.js';

export function gerarRelatorio(pUsuario, pTipo, pCodigoRelatorio, pBodyGerarRelatorio) {


  getGenericoComBody(`/api/relatorio/pedido/${pTipo}/${pCodigoRelatorio}`, pUsuario, pBodyGerarRelatorio, 'Gerar Relatório');
}
