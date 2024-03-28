import { sleep } from 'k6';
import { getConsultaDinamica, postCadastroDinamico, getGenericoComBody, autenticar, getGenerico, obterLog, postGenerico } from '../Base/EstruturaRest.js';

function gerarRelatorio(pUsuario) {


  getGenericoComBody('/api/relatorio/pedido/venda/78', pUsuario, bodyGerarRelatorio, 'Gerar Relatório');
}
