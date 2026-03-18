/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Handshake, Building2, Plus, Save, FileText, CheckCircle2, UploadCloud, CheckSquare, Scale, ThumbsUp, ThumbsDown, FileSignature } from 'lucide-react';

declare const pdfMake: any;

interface Company {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnae: string;
  endereco: string;
  cidade?: string;
  estado?: string;
  representante: string;
  cpfRepresentante: string;
  documentos: string;
}

interface Opportunity {
  id: number;
  numero: string;
  tipo: string;
  objeto: string;
  valor: number;
  regiao: string;
  estado: string;
  cidade: string;
  dataAbertura: string;
  orgao: string;
}

const oportunidadesExemplo: Opportunity[] = [
  // Região Norte
  { id: 1, numero: "90021/2025", tipo: "pregao", objeto: "Aquisição de equipamentos de informática para secretaria de educação", valor: 150000.00, regiao: "norte", estado: "RO", cidade: "Porto Velho", dataAbertura: "19/01/2026 às 08:00", orgao: "Secretaria de Educação de Porto Velho" },
  { id: 2, numero: "80015/2025", tipo: "dispensa", objeto: "Contratação de serviço de manutenção de ar condicionado", valor: 25000.00, regiao: "norte", estado: "AM", cidade: "Manaus", dataAbertura: "25/01/2026 às 10:00", orgao: "Secretaria de Saúde de Manaus" },
  { id: 3, numero: "70009/2025", tipo: "licitacao", objeto: "Execução de obra de construção de escola pública", valor: 850000.00, regiao: "norte", estado: "AC", cidade: "Rio Branco", dataAbertura: "01/02/2026 às 09:00", orgao: "Secretaria de Educação do Acre" },

  // Região Nordeste
  { id: 4, numero: "10045/2025", tipo: "pregao", objeto: "Aquisição de material de limpeza para hospitais públicos", valor: 80000.00, regiao: "nordeste", estado: "BA", cidade: "Salvador", dataAbertura: "20/01/2026 às 14:00", orgao: "Secretaria de Saúde da Bahia" },
  { id: 5, numero: "20032/2025", tipo: "dispensa", objeto: "Contratação de serviço de transporte de passageiros", valor: 35000.00, regiao: "nordeste", estado: "PE", cidade: "Recife", dataAbertura: "28/01/2026 às 11:00", orgao: "Secretaria de Transportes de Pernambuco" },

  // Região Sudeste
  { id: 6, numero: "30078/2025", tipo: "licitacao", objeto: "Execução de obra de reforma de praça pública", valor: 500000.00, regiao: "sudeste", estado: "SP", cidade: "São Paulo", dataAbertura: "05/02/2026 às 10:00", orgao: "Prefeitura de São Paulo" },
  { id: 7, numero: "40056/2025", tipo: "pregao", objeto: "Aquisição de veículos para frota municipal", valor: 220000.00, regiao: "sudeste", estado: "RJ", cidade: "Rio de Janeiro", dataAbertura: "10/02/2026 às 09:30", orgao: "Prefeitura do Rio de Janeiro" },

  // Região Sul
  { id: 8, numero: "50023/2025", tipo: "dispensa", objeto: "Contratação de serviço de consultoria em gestão empresarial", valor: 45000.00, regiao: "sul", estado: "RS", cidade: "Porto Alegre", dataAbertura: "15/02/2026 às 14:00", orgao: "Secretaria de Desenvolvimento Econômico do Rio Grande do Sul" },
  { id: 9, numero: "60041/2025", tipo: "licitacao", objeto: "Aquisição de equipamentos agrícolas para assentamentos", valor: 180000.00, regiao: "sul", estado: "PR", cidade: "Curitiba", dataAbertura: "20/02/2026 às 08:30", orgao: "Secretaria de Agricultura do Paraná" },

  // Região Centro-Oeste
  { id: 10, numero: "90012/2025", tipo: "pregao", objeto: "Aquisição de material de escritório para órgãos federais", valor: 60000.00, regiao: "centroOeste", estado: "DF", cidade: "Brasília", dataAbertura: "25/02/2026 às 10:00", orgao: "Ministério da Gestão e da Inovação em Serviços Públicos" },
  { id: 11, numero: "80034/2025", tipo: "dispensa", objeto: "Contratação de serviço de manutenção de equipamentos de informática", valor: 28000.00, regiao: "centroOeste", estado: "GO", cidade: "Goiânia", dataAbertura: "01/03/2026 às 11:00", orgao: "Secretaria de Administração de Goiás" }
];

type Tarefa = { descricao: string; concluida: boolean };
type Processo = {
    numero: string;
    tipo: string;
    objeto: string;
    empresa: string;
    status: string;
    dataAbertura: string;
    tarefas: Tarefa[];
};

const processosExemplo: Processo[] = [
    {
        numero: "90021/2025",
        tipo: "Pregão Eletrônico",
        objeto: "Aquisição de equipamentos de informática",
        empresa: "Empresa A Ltda",
        status: "participando",
        dataAbertura: "19/01/2026",
        tarefas: [
            { descricao: "Analisar edital", concluida: true },
            { descricao: "Preparar proposta", concluida: true },
            { descricao: "Enviar documentos", concluida: false },
            { descricao: "Participar da disputa", concluida: false }
        ]
    },
    {
        numero: "30078/2025",
        tipo: "Licitação",
        objeto: "Reforma de praça pública",
        empresa: "Empresa B Ltda",
        status: "analise",
        dataAbertura: "05/02/2026",
        tarefas: [
            { descricao: "Analisar edital", concluida: false },
            { descricao: "Verificar requisitos", concluida: false },
            { descricao: "Preparar documentação", concluida: false }
        ]
    },
    {
        numero: "50023/2025",
        tipo: "Dispensa Eletrônica",
        objeto: "Consultoria em gestão",
        empresa: "Empresa C Ltda",
        status: "ganhou",
        dataAbertura: "15/02/2026",
        tarefas: [
            { descricao: "Analisar edital", concluida: true },
            { descricao: "Enviar proposta", concluida: true },
            { descricao: "Assinar contrato", concluida: true }
        ]
    },
    {
        numero: "20032/2025",
        tipo: "Dispensa Eletrônica",
        objeto: "Transporte de passageiros",
        empresa: "Empresa A Ltda",
        status: "perdeu",
        dataAbertura: "28/01/2026",
        tarefas: [
            { descricao: "Analisar edital", concluida: true },
            { descricao: "Enviar proposta", concluida: true }
        ]
    }
];

function gerarConteudoPDF(empresa: Company, tipo: string, dados: any) {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    let conteudo: any[] = [];

    switch(tipo) {
        case 'Declaração de Cumprimento de Requisitos de Habilitação':
            conteudo = [
                { text: 'DECLARAÇÃO DE CUMPRIMENTO DE REQUISITOS DE HABILITAÇÃO', style: 'titulo' },
                { text: '\n' },
                { text: `A empresa ${empresa.razaoSocial}, inscrita no CNPJ sob o nº ${empresa.cnpj}, com endereço à ${empresa.endereco}, por intermédio de seu representante legal, o(a) Sr.(a) ${empresa.representante}, inscrito(a) no CPF sob o nº ${empresa.cpfRepresentante}, DECLARA, sob as penas da lei, que cumpre plenamente os requisitos de habilitação exigidos no edital da licitação nº ${dados.numeroEdital || 'N/A'}, referente à ${dados.objetoEdital || 'N/A'}.` },
                { text: '\n' },
                { text: 'Por ser verdade, firmo a presente declaração.' },
                { text: '\n\n\n' },
                { text: `${empresa.cidade || 'Cidade'}/${empresa.estado || 'UF'}, ${dataAtual}.` },
                { text: '\n\n\n' },
                { text: '_____________________________________________________', alignment: 'center' },
                { text: `${empresa.representante}`, alignment: 'center' },
                { text: `CPF: ${empresa.cpfRepresentante}`, alignment: 'center' }
            ];
            break;

        case 'Declaração de Menor Aprendiz':
            conteudo = [
                { text: 'DECLARAÇÃO DE MENOR APRENDIZ', style: 'titulo' },
                { text: '\n' },
                { text: `A empresa ${empresa.razaoSocial}, inscrita no CNPJ sob o nº ${empresa.cnpj}, por intermédio de seu representante legal, o(a) Sr.(a) ${empresa.representante}, inscrito(a) no CPF sob o nº ${empresa.cpfRepresentante}, DECLARA, para fins do disposto no inciso XXXIII do art. 7º da Constituição Federal, que não emprega menor de dezoito anos em trabalho noturno, perigoso ou insalubre e não emprega menor de dezesseis anos.` },
                { text: '\n' },
                { text: 'Ressalva: emprega menor, a partir de quatorze anos, na condição de aprendiz ( ).' },
                { text: '\n' },
                { text: 'Por ser verdade, firmo a presente declaração.' },
                { text: '\n\n\n' },
                { text: `${empresa.cidade || 'Cidade'}/${empresa.estado || 'UF'}, ${dataAtual}.` },
                { text: '\n\n\n' },
                { text: '_____________________________________________________', alignment: 'center' },
                { text: `${empresa.representante}`, alignment: 'center' },
                { text: `CPF: ${empresa.cpfRepresentante}`, alignment: 'center' }
            ];
            break;

        case 'Proposta Comercial':
            conteudo = [
                { text: 'PROPOSTA COMERCIAL', style: 'titulo' },
                { text: '\n' },
                { text: `À Comissão de Licitação do órgão responsável pelo edital nº ${dados.numeroEdital || 'N/A'}` },
                { text: '\n' },
                { text: `A empresa ${empresa.razaoSocial}, inscrita no CNPJ sob o nº ${empresa.cnpj}, com endereço à ${empresa.endereco}, por intermédio de seu representante legal, o(a) Sr.(a) ${empresa.representante}, inscrito(a) no CPF sob o nº ${empresa.cpfRepresentante}, apresenta proposta comercial para a ${dados.objetoEdital || 'N/A'}, conforme especificações e condições abaixo:` },
                { text: '\n' },
                { text: `Valor total da proposta: R$ ${dados.valorProposta || '0,00'}`, style: 'destaque' },
                { text: `Validade da proposta: ${dados.dataValidade || '60'} dias` },
                { text: '\n' },
                { text: 'Declaramos que nos preços propostos estão incluídos todos os custos e despesas, tais como: impostos, taxas, fretes, seguros e outros encargos que incidam sobre o fornecimento/serviço objeto desta licitação.' },
                { text: '\n\n\n' },
                { text: 'Por ser verdade, firmamos a presente proposta.' },
                { text: '\n\n\n' },
                { text: `${empresa.cidade || 'Cidade'}/${empresa.estado || 'UF'}, ${dataAtual}.` },
                { text: '\n\n\n' },
                { text: '_____________________________________________________', alignment: 'center' },
                { text: `${empresa.representante}`, alignment: 'center' },
                { text: `CPF: ${empresa.cpfRepresentante}`, alignment: 'center' }
            ];
            break;

        case 'Declaração de Idoneidade':
            conteudo = [
                { text: 'DECLARAÇÃO DE IDONEIDADE', style: 'titulo' },
                { text: '\n' },
                { text: `A empresa ${empresa.razaoSocial}, inscrita no CNPJ sob o nº ${empresa.cnpj}, por intermédio de seu representante legal, o(a) Sr.(a) ${empresa.representante}, inscrito(a) no CPF sob o nº ${empresa.cpfRepresentante}, DECLARA, sob as penas da lei, que não foi declarada inidônea para licitar ou contratar com a Administração Pública, em qualquer de suas esferas, e que não está impedida de participar de licitações e de contratar com o Poder Público, em virtude de dispositivo legal.` },
                { text: '\n' },
                { text: 'Por ser verdade, firmo a presente declaração.' },
                { text: '\n\n\n' },
                { text: `${empresa.cidade || 'Cidade'}/${empresa.estado || 'UF'}, ${dataAtual}.` },
                { text: '\n\n\n' },
                { text: '_____________________________________________________', alignment: 'center' },
                { text: `${empresa.representante}`, alignment: 'center' },
                { text: `CPF: ${empresa.cpfRepresentante}`, alignment: 'center' }
            ];
            break;

        case 'Cópia de Contrato Social (modelo)':
            conteudo = [
                { text: 'MODELO DE CONTRATO SOCIAL', style: 'titulo' },
                { text: '\n' },
                { text: 'Este modelo serve como referência. O contrato social original da empresa deve ser utilizado nos processos de licitação.' },
                { text: '\n' },
                { text: 'DADOS DA EMPRESA:', bold: true },
                { text: `Razão Social: ${empresa.razaoSocial}` },
                { text: `Nome Fantasia: ${empresa.nomeFantasia || 'N/A'}` },
                { text: `CNPJ: ${empresa.cnpj}` },
                { text: `Endereço: ${empresa.endereco}` },
                { text: `CNAE: ${empresa.cnae || 'N/A'}` },
                { text: '\n' },
                { text: 'REPRESENTANTE LEGAL:', bold: true },
                { text: `Nome: ${empresa.representante}` },
                { text: `CPF: ${empresa.cpfRepresentante}` },
                { text: '\n' },
                { text: 'Este modelo é apenas para fins de referência. O contrato social oficial, registrado na Junta Comercial ou Cartório, é o documento válido para apresentação em processos de licitação.' },
                { text: '\n\n\n' },
                { text: `${empresa.cidade || 'Cidade'}/${empresa.estado || 'UF'}, ${dataAtual}.` }
            ];
            break;

        case 'Modelo de Impugnação de Edital':
            conteudo = [
                { text: 'MODELO DE IMPUGNAÇÃO DE EDITAL', style: 'titulo' },
                { text: '\n' },
                { text: `À Comissão de Licitação do órgão responsável pelo edital nº ${dados.numeroEdital || 'N/A'}` },
                { text: '\n' },
                { text: `A empresa ${empresa.razaoSocial}, inscrita no CNPJ sob o nº ${empresa.cnpj}, com endereço à ${empresa.endereco}, por intermédio de seu representante legal, o(a) Sr.(a) ${empresa.representante}, inscrito(a) no CPF sob o nº ${empresa.cpfRepresentante}, vem, respeitosamente, apresentar IMPUGNAÇÃO ao edital em referência, com base nos fatos e fundamentos abaixo:` },
                { text: '\n' },
                { text: '[INSIRA AQUI OS MOTIVOS DA IMPUGNAÇÃO, COMO CLÁUSULAS ILEGAIS, RESTRITIVAS OU AMBÍGUAS]' },
                { text: '\n' },
                { text: 'Diante do exposto, solicitamos que a presente impugnação seja acolhida, para que sejam realizadas as alterações necessárias no edital, ou que o mesmo seja anulado, conforme o caso.' },
                { text: '\n\n\n' },
                { text: `${empresa.cidade || 'Cidade'}/${empresa.estado || 'UF'}, ${dataAtual}.` },
                { text: '\n\n\n' },
                { text: '_____________________________________________________', alignment: 'center' },
                { text: `${empresa.representante}`, alignment: 'center' },
                { text: `CPF: ${empresa.cpfRepresentante}`, alignment: 'center' }
            ];
            break;

        case 'Modelo de Recurso Administrativo':
            conteudo = [
                { text: 'MODELO DE RECURSO ADMINISTRATIVO', style: 'titulo' },
                { text: '\n' },
                { text: `À Autoridade Superior do órgão responsável pelo edital nº ${dados.numeroEdital || 'N/A'}` },
                { text: '\n' },
                { text: `A empresa ${empresa.razaoSocial}, inscrita no CNPJ sob o nº ${empresa.cnpj}, com endereço à ${empresa.endereco}, por intermédio de seu representante legal, o(a) Sr.(a) ${empresa.representante}, inscrito(a) no CPF sob o nº ${empresa.cpfRepresentante}, vem, respeitosamente, interpor RECURSO ADMINISTRATIVO contra a decisão que [INSIRA AQUI A DECISÃO QUE ESTÁ SENDO RECORRIDA], com base nos fatos e fundamentos abaixo:` },
                { text: '\n' },
                { text: '[INSIRA AQUI OS MOTIVOS DO RECURSO, COMO ERRO NA ANÁLISE DE DOCUMENTOS, DESCLASSIFICAÇÃO INDEVIDA, ETC.]' },
                { text: '\n' },
                { text: 'Diante do exposto, solicitamos que a presente recurso seja provido, para que a decisão recorrida seja reformada, ou que sejam adotadas as medidas cabíveis.' },
                { text: '\n\n\n' },
                { text: `${empresa.cidade || 'Cidade'}/${empresa.estado || 'UF'}, ${dataAtual}.` },
                { text: '\n\n\n' },
                { text: '_____________________________________________________', alignment: 'center' },
                { text: `${empresa.representante}`, alignment: 'center' },
                { text: `CPF: ${empresa.cpfRepresentante}`, alignment: 'center' }
            ];
            break;

        default:
            conteudo = [
                { text: 'DOCUMENTO DE LICITAÇÃO', style: 'titulo' },
                { text: '\n' },
                { text: `Empresa: ${empresa.razaoSocial}` },
                { text: `CNPJ: ${empresa.cnpj}` },
                { text: `Data de geração: ${dataAtual}` },
                { text: '\n' },
                { text: 'Este é um documento gerado automaticamente pela plataforma de licitações.' }
            ];
    }

    const docDefinition = {
        content: conteudo,
        styles: {
            titulo: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                color: '#0056b3'
            },
            destaque: {
                fontSize: 14,
                bold: true,
                color: '#28a745'
            }
        },
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        defaultStyle: {
            font: 'Roboto'
        }
    };

    return docDefinition;
}

function gerarEDownloadPDF(empresa: Company, tipo: string, dados: any, nomeDocumento: string) {
    const docDefinition = gerarConteudoPDF(empresa, tipo, dados);
    pdfMake.createPdf(docDefinition).download(`${nomeDocumento.replace(/\s+/g, '_')}.pdf`);
}

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Oportunidades State
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [opportunityFilters, setOpportunityFilters] = useState({
    tipoProcesso: '',
    regiao: '',
    valorMin: '',
    valorMax: ''
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [mockOpportunities, setMockOpportunities] = useState<Opportunity[]>([]);

  const [formData, setFormData] = useState<Omit<Company, 'id'>>({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    cnae: '',
    endereco: '',
    representante: '',
    cpfRepresentante: '',
    documentos: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const resultadoAnaliseRef = useRef<HTMLDivElement>(null);

  // Geração de Documentos State
  const [docEmpresaId, setDocEmpresaId] = useState('');
  const [docTipo, setDocTipo] = useState('');
  const [docNumeroEdital, setDocNumeroEdital] = useState('');
  const [docObjetoEdital, setDocObjetoEdital] = useState('');
  const [docValorProposta, setDocValorProposta] = useState('');
  const [docDataValidade, setDocDataValidade] = useState('60');
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<{tipo: string, empresa: string, data: string, empresaObj: Company, dadosAdicionais: any, nomeDocumento: string} | null>(null);
  const [recentDocs, setRecentDocs] = useState<{tipo: string, empresa: string, data: string, empresaObj: Company, dadosAdicionais: any, nomeDocumento: string}[]>([]);

  // Robô de Lance State
  const [roboEmpresaId, setRoboEmpresaId] = useState('');
  const [roboLicitacaoId, setRoboLicitacaoId] = useState('');
  const [roboValorMaximo, setRoboValorMaximo] = useState('');
  const [roboIncrementoMinimo, setRoboIncrementoMinimo] = useState('');
  const [roboTempoResposta, setRoboTempoResposta] = useState('5');
  const [roboPararUltimoLance, setRoboPararUltimoLance] = useState('sim');
  const [roboObservacoes, setRoboObservacoes] = useState('');
  const [isRoboRunning, setIsRoboRunning] = useState(false);
  const [roboStatusText, setRoboStatusText] = useState('Nenhum robô em execução no momento.');
  const [roboHistorico, setRoboHistorico] = useState<{id: number, licitacao: string, empresa: string, valor: number, data: string, tipo: string, status: string}[]>([]);
  const [roboProgress, setRoboProgress] = useState(0);
  
  const roboIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const roboValorAtualRef = useRef<number>(0);
  const roboProgressoRef = useRef<number>(0);

  // Gestão de Processos State
  const [processoEmpresaId, setProcessoEmpresaId] = useState('');
  const [processoStatus, setProcessoStatus] = useState('');
  const [processosFiltrados, setProcessosFiltrados] = useState<Processo[]>(processosExemplo);

  const handleFiltrarProcessos = () => {
    const selectedCompany = companies.find(c => c.id === processoEmpresaId);
    const companyName = selectedCompany ? (selectedCompany.razaoSocial || selectedCompany.nomeFantasia) : '';

    const filtered = processosExemplo.filter(processo => {
      const matchEmpresa = processoEmpresaId ? processo.empresa === companyName : true;
      const matchStatus = processoStatus ? processo.status === processoStatus : true;
      return matchEmpresa && matchStatus;
    });

    setProcessosFiltrados(filtered);
  };

  const contagemProcessos = {
      analise: processosFiltrados.filter(p => p.status === 'analise').length,
      participando: processosFiltrados.filter(p => p.status === 'participando').length,
      ganhou: processosFiltrados.filter(p => p.status === 'ganhou').length,
      perdeu: processosFiltrados.filter(p => p.status === 'perdeu').length,
      cancelado: processosFiltrados.filter(p => p.status === 'cancelado').length
  };

  const statusTraduzido: Record<string, string> = {
      analise: 'Em Análise',
      participando: 'Participando',
      ganhou: 'Ganhou',
      perdeu: 'Perdeu',
      cancelado: 'Cancelado'
  };

  const statusColor: Record<string, string> = {
      analise: 'bg-[#ffc107] text-[#333]',
      participando: 'bg-[#17a2b8] text-white',
      ganhou: 'bg-[#28a745] text-white',
      perdeu: 'bg-[#dc3545] text-white',
      cancelado: 'bg-[#6c757d] text-white'
  };

  useEffect(() => {
    return () => {
      if (roboIntervalRef.current) clearInterval(roboIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCompany: Company = {
      ...formData,
      id: crypto.randomUUID()
    };
    setCompanies([...companies, newCompany]);
    setIsFormOpen(false);
    setFormData({
      cnpj: '',
      razaoSocial: '',
      nomeFantasia: '',
      cnae: '',
      endereco: '',
      representante: '',
      cpfRepresentante: '',
      documentos: ''
    });
    setSuccessMessage('Empresa cadastrada com sucesso!');
  };

  const handleSearchOpportunities = () => {
    if (!selectedCompanyId) {
      setSuccessMessage('Por favor, selecione uma empresa primeiro.');
      return;
    }
    setHasSearched(true);
    
    const filtroTipo = opportunityFilters.tipoProcesso;
    const filtroRegiao = opportunityFilters.regiao;
    const filtroValorMin = parseFloat(opportunityFilters.valorMin) || 0;
    const filtroValorMax = parseFloat(opportunityFilters.valorMax) || Infinity;

    const filtradas = oportunidadesExemplo.filter(opp => {
      const correspondeTipo = filtroTipo ? opp.tipo === filtroTipo : true;
      const correspondeRegiao = filtroRegiao ? opp.regiao === filtroRegiao : true;
      const correspondeValor = opp.valor >= filtroValorMin && opp.valor <= filtroValorMax;

      return correspondeTipo && correspondeRegiao && correspondeValor;
    });

    setMockOpportunities(filtradas);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const translateType = (tipo: string) => {
    switch(tipo) {
      case 'licitacao': return 'Licitação';
      case 'pregao': return 'Pregão Eletrônico';
      case 'dispensa': return 'Dispensa Eletrônica';
      default: return tipo;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#333] relative">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-20 right-5 bg-[#28a745] text-white px-6 py-3 rounded shadow-lg flex items-center z-50 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}

      {/* Header */}
      <header className="bg-[#0056b3] text-white py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center flex-col md:flex-row gap-4 md:gap-0">
          <div className="flex-shrink-0">
            <h1 className="text-[1.8rem] font-bold">
              Licita<span className="text-[#ffc107]">Plus</span>
            </h1>
          </div>
          <nav>
            <ul className="flex flex-col md:flex-row gap-2 md:gap-6 text-center">
              <li><a href="#inicio" className="text-white hover:text-[#ffc107] font-medium transition-colors">Início</a></li>
              <li><a href="#empresas" className="text-white hover:text-[#ffc107] font-medium transition-colors">Minhas Empresas</a></li>
              <li><a href="#oportunidades" className="text-white hover:text-[#ffc107] font-medium transition-colors">Oportunidades</a></li>
              <li><a href="#robo" className="text-white hover:text-[#ffc107] font-medium transition-colors">Robô de Lance</a></li>
              <li><a href="#configuracoes" className="text-white hover:text-[#ffc107] font-medium transition-colors">Configurações</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="bg-[#f8f9fa] py-16">
        <div className="max-w-[1200px] mx-auto px-5 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-[2.5rem] font-bold text-[#0056b3] mb-4 leading-tight">
              Encontre, dispute e vença licitações com inteligência e praticidade
            </h2>
            <p className="text-[1.1rem] text-[#666] mb-8">
              Plataforma completa para gerenciar várias empresas, buscar oportunidades automaticamente, analisar editais com IA e automatizar seus lances.
            </p>
            <a href="#empresas" className="inline-block bg-[#0056b3] text-white px-8 py-3 rounded text-base font-medium hover:bg-[#004494] transition-colors">
              Começar Agora
            </a>
          </div>
          <div className="flex-1 flex justify-center text-[#0056b3]">
            <Handshake className="w-48 h-48" />
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="empresas" className="py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-[2rem] font-bold text-center text-[#0056b3] mb-2">Minhas Empresas</h2>
          <p className="text-center text-[#666] mb-8">
            Cadastre quantas empresas quiser, de diferentes segmentos, e gerencie tudo em um só lugar.
          </p>

          {!isFormOpen && (
            <div className="text-center mb-8">
              <button 
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center bg-[#28a745] text-white px-8 py-3 rounded font-medium hover:bg-[#218838] transition-colors border-none cursor-pointer"
              >
                Cadastrar Nova Empresa
              </button>
            </div>
          )}

          {isFormOpen && (
            <div className="bg-[#f8f9fa] p-8 rounded-lg shadow-sm mb-8 border border-gray-100">
              <h3 className="text-xl font-bold text-[#0056b3] mb-6">Cadastrar Nova Empresa</h3>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="cnpj" className="block font-medium mb-2">CNPJ</label>
                    <input type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleInputChange} placeholder="00.000.000/0000-00" required className="w-full p-3 border border-[#ddd] rounded text-base" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="razaoSocial" className="block font-medium mb-2">Razão Social</label>
                    <input type="text" id="razaoSocial" name="razaoSocial" value={formData.razaoSocial} onChange={handleInputChange} placeholder="Nome da Empresa Ltda" required className="w-full p-3 border border-[#ddd] rounded text-base" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="nomeFantasia" className="block font-medium mb-2">Nome Fantasia</label>
                    <input type="text" id="nomeFantasia" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleInputChange} placeholder="Nome Fantasia" className="w-full p-3 border border-[#ddd] rounded text-base" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="cnae" className="block font-medium mb-2">CNAE</label>
                    <input type="text" id="cnae" name="cnae" value={formData.cnae} onChange={handleInputChange} placeholder="00.00-0-00" required className="w-full p-3 border border-[#ddd] rounded text-base" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="endereco" className="block font-medium mb-2">Endereço Completo</label>
                    <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleInputChange} placeholder="Rua, Número, Bairro, Cidade/UF" required className="w-full p-3 border border-[#ddd] rounded text-base" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="representante" className="block font-medium mb-2">Representante Legal</label>
                    <input type="text" id="representante" name="representante" value={formData.representante} onChange={handleInputChange} placeholder="Nome Completo" required className="w-full p-3 border border-[#ddd] rounded text-base" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="cpfRepresentante" className="block font-medium mb-2">CPF do Representante</label>
                    <input type="text" id="cpfRepresentante" name="cpfRepresentante" value={formData.cpfRepresentante} onChange={handleInputChange} placeholder="000.000.000-00" required className="w-full p-3 border border-[#ddd] rounded text-base" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="documentos" className="block font-medium mb-2">Documentos Necessários (separados por vírgula)</label>
                    <textarea id="documentos" name="documentos" value={formData.documentos} onChange={handleInputChange} placeholder="Certidão Negativa de Débitos, Capacidade Técnica, Declaração de Cumprimento de Requisitos..." className="w-full p-3 border border-[#ddd] rounded text-base min-h-[100px] resize-y"></textarea>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-[#0056b3] text-white px-8 py-3 rounded font-medium hover:bg-[#004494] transition-colors border-none cursor-pointer">
                    Salvar Empresa
                  </button>
                  <button type="button" onClick={() => setIsFormOpen(false)} className="bg-[#dc3545] text-white px-8 py-3 rounded font-medium hover:bg-[#c82333] transition-colors border-none cursor-pointer">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-[#f8f9fa] p-8 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#0056b3] mb-4">Empresas Cadastradas</h3>
            
            {companies.length === 0 ? (
              <p className="text-[#666]">Nenhuma empresa cadastrada ainda. Clique em "Cadastrar Nova Empresa" para começar.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {companies.map((company) => (
                  <div key={company.id} className="bg-white rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] border border-[#ddd] overflow-hidden p-6">
                    <h4 className="text-lg font-bold text-[#0056b3] mb-4 border-b border-[#eee] pb-2">
                      {company.nomeFantasia || company.razaoSocial}
                    </h4>
                    <div className="text-[#333] space-y-2 text-[0.95rem]">
                      <p><strong>CNPJ:</strong> {company.cnpj}</p>
                      <p><strong>CNAE:</strong> {company.cnae}</p>
                      <p><strong>Endereço:</strong> {company.endereco}</p>
                      <p><strong>Representante:</strong> {company.representante} <span className="whitespace-nowrap">(CPF: {company.cpfRepresentante})</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Oportunidades Section */}
      <section id="oportunidades" className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-[2rem] font-bold text-center text-[#0056b3] mb-2">Oportunidades de Licitação</h2>
          <p className="text-center text-[#666] mb-8">
            Veja as licitações, pregões e dispensas eletrônicas que combinam com o perfil da empresa selecionada.
          </p>

          {/* Seleção de Empresa e Filtros */}
          <div className="bg-[#f8f9fa] p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
            <div className="mb-6">
              <label htmlFor="empresaSelecionada" className="block font-medium mb-2">Empresa:</label>
              <select 
                id="empresaSelecionada" 
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                required 
                className="w-full p-3 border border-[#ddd] rounded text-base bg-white"
              >
                <option value="">Selecione uma empresa</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.nomeFantasia || c.razaoSocial} (CNPJ: {c.cnpj})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="tipoProcesso" className="block font-medium mb-2">Tipo de Processo:</label>
                <select 
                  id="tipoProcesso" 
                  value={opportunityFilters.tipoProcesso}
                  onChange={(e) => setOpportunityFilters({...opportunityFilters, tipoProcesso: e.target.value})}
                  className="w-full p-3 border border-[#ddd] rounded text-base bg-white"
                >
                  <option value="">Todos</option>
                  <option value="licitacao">Licitação</option>
                  <option value="pregao">Pregão Eletrônico</option>
                  <option value="dispensa">Dispensa Eletrônica</option>
                </select>
              </div>

              <div>
                <label htmlFor="regiao" className="block font-medium mb-2">Região:</label>
                <select 
                  id="regiao" 
                  value={opportunityFilters.regiao}
                  onChange={(e) => setOpportunityFilters({...opportunityFilters, regiao: e.target.value})}
                  className="w-full p-3 border border-[#ddd] rounded text-base bg-white"
                >
                  <option value="">Todas</option>
                  <option value="norte">Norte</option>
                  <option value="nordeste">Nordeste</option>
                  <option value="sudeste">Sudeste</option>
                  <option value="sul">Sul</option>
                  <option value="centroOeste">Centro-Oeste</option>
                </select>
              </div>

              <div>
                <label htmlFor="valorMin" className="block font-medium mb-2">Valor Mínimo (R$):</label>
                <input 
                  type="number" 
                  id="valorMin" 
                  value={opportunityFilters.valorMin}
                  onChange={(e) => setOpportunityFilters({...opportunityFilters, valorMin: e.target.value})}
                  placeholder="0,00" 
                  className="w-full p-3 border border-[#ddd] rounded text-base"
                />
              </div>

              <div>
                <label htmlFor="valorMax" className="block font-medium mb-2">Valor Máximo (R$):</label>
                <input 
                  type="number" 
                  id="valorMax" 
                  value={opportunityFilters.valorMax}
                  onChange={(e) => setOpportunityFilters({...opportunityFilters, valorMax: e.target.value})}
                  placeholder="0,00" 
                  className="w-full p-3 border border-[#ddd] rounded text-base"
                />
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={handleSearchOpportunities}
                className="bg-[#0056b3] text-white px-8 py-3 rounded font-medium hover:bg-[#004494] transition-colors border-none cursor-pointer w-full md:w-auto"
              >
                Buscar Oportunidades
              </button>
            </div>
          </div>

          {/* Lista de Oportunidades */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            {!hasSearched ? (
              <p className="text-[#666] text-center">Selecione uma empresa e clique em "Buscar Oportunidades" para ver os resultados.</p>
            ) : mockOpportunities.length > 0 ? (
              <div>
                {mockOpportunities.map((opp) => (
                  <div key={opp.id} className="border border-[#ddd] rounded-lg p-6 mb-6 hover:shadow-md transition-shadow bg-white">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 border-b border-[#eee] pb-4 gap-4 md:gap-0">
                      <span className="bg-[#0056b3] text-white px-3 py-1 rounded-full text-[0.9rem] font-medium self-start md:self-auto">
                        {translateType(opp.tipo)} nº {opp.numero}
                      </span>
                      <span className="text-[1.2rem] font-bold text-[#28a745]">
                        {formatCurrency(opp.valor)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-[1.3rem] font-bold text-[#333] mb-2">{opp.objeto}</h4>
                      <p className="text-[#666] mb-1"><strong className="text-[#333]">Órgão:</strong> {opp.orgao}</p>
                      <p className="text-[#666] mb-1"><strong className="text-[#333]">Local:</strong> {opp.cidade}/{opp.estado} ({opp.regiao.toUpperCase()})</p>
                      <p className="text-[#666] mb-1"><strong className="text-[#333]">Data de Abertura:</strong> {opp.dataAbertura}</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                      <button className="bg-[#17a2b8] text-white px-6 py-2.5 rounded font-medium hover:bg-[#138496] transition-colors border-none cursor-pointer text-[0.9rem] w-full md:w-auto text-center">
                        Ver Detalhes
                      </button>
                      <button className="bg-[#ffc107] text-[#333] px-6 py-2.5 rounded font-medium hover:bg-[#e0a800] transition-colors border-none cursor-pointer text-[0.9rem] w-full md:w-auto text-center">
                        Gerar Documentos
                      </button>
                      <button className="bg-[#28a745] text-white px-6 py-2.5 rounded font-medium hover:bg-[#218838] transition-colors border-none cursor-pointer text-[0.9rem] w-full md:w-auto text-center">
                        Configurar Robô de Lance
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#666] text-center">Nenhuma oportunidade encontrada para os filtros selecionados.</p>
            )}
          </div>
        </div>
      </section>
      {/* Seção Análise de Editais */}
      <section id="analise-editais" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#333] mb-4">Análise de Editais com IA</h2>
          <p className="text-center text-[#666] mb-12 max-w-2xl mx-auto">
            Envie o edital e a IA vai analisar tudo para você: resumo, requisitos, pontos positivos e negativos.
          </p>

          {/* Área de Upload de Edital */}
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <div 
              className="border-2 border-dashed border-[#0056b3] rounded-lg py-12 px-8 bg-[#f8f9fa] mb-4 transition-all duration-300 hover:border-[#004494] hover:bg-[#e9f0f8] cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                  if (validTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx)$/i)) {
                    setSelectedFile(file);
                  } else {
                    alert('Por favor, selecione um arquivo válido (PDF, DOC ou DOCX).');
                  }
                }
              }}
            >
              <UploadCloud className="w-16 h-16 text-[#0056b3] mx-auto mb-4" />
              <p className="text-[#333] mb-2">Arraste e solte o arquivo do edital aqui</p>
              <p className="text-[#666] mb-4">ou</p>
              <label htmlFor="arquivoEdital" className="bg-[#0056b3] text-white px-8 py-3 rounded font-medium cursor-pointer transition-colors inline-block mt-4 hover:bg-[#004494]">
                Selecionar Arquivo
              </label>
              <input 
                type="file" 
                id="arquivoEdital" 
                accept=".pdf,.doc,.docx" 
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    if (validTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx)$/i)) {
                      setSelectedFile(file);
                    } else {
                      alert('Por favor, selecione um arquivo válido (PDF, DOC ou DOCX).');
                    }
                  }
                }}
              />
            </div>
            
            <p className="text-[#666] mb-4 italic">
              {selectedFile ? `Arquivo selecionado: ${selectedFile.name}` : ''}
            </p>

            <button 
              className={`px-8 py-3 border-none rounded font-medium text-base transition-colors ${
                selectedFile && !isAnalyzing 
                  ? 'bg-[#0056b3] text-white cursor-pointer hover:bg-[#004494]' 
                  : 'bg-[#6c757d] text-white cursor-not-allowed'
              }`}
              disabled={!selectedFile || isAnalyzing}
              onClick={() => {
                alert('Analisando o edital com IA... Aguarde alguns segundos.');
                setIsAnalyzing(true);
                // Simula o tempo de análise da IA
                setTimeout(() => {
                  setIsAnalyzing(false);
                  setAnalysisResult({
                    resumo: "Este edital refere-se a um pregão eletrônico para aquisição de equipamentos de informática para a Secretaria de Educação de Porto Velho. O valor estimado é de R$ 150.000,00, com data de abertura marcada para 19/01/2026 às 08:00. O objeto inclui computadores, notebooks, impressoras e acessórios, com prazo de entrega de até 30 dias após a homologação.",
                    requisitos: [
                      "Possuir CNPJ ativo e regular perante a Receita Federal",
                      "Capacidade técnica para fornecimento dos equipamentos, comprovada por meio de atestados de desempenho anterior",
                      "Regularidade fiscal e trabalhista (certidões negativas de débitos)",
                      "Declaração de cumprimento do disposto no inciso XXXIII do art. 7º da Constituição Federal",
                      "Garantia mínima de 12 meses para os equipamentos"
                    ],
                    pontosPositivos: [
                      "Valor estimado compatível com o mercado",
                      "Prazo de entrega amplo (30 dias)",
                      "Requisitos de habilitação claros e objetivos",
                      "Possibilidade de participação de microempresas e empresas de pequeno porte",
                      "Edital disponível gratuitamente no portal oficial"
                    ],
                    pontosNegativos: [
                      "Exigência de atestado de capacidade técnica com quantidade mínima, o que pode limitar a participação de novas empresas",
                      "Prazo para envio de propostas curto (apenas 10 dias após publicação)",
                      "Local de entrega é na zona rural, o que pode aumentar os custos de transporte",
                      "Cláusula de reajuste de preço não prevista, o que pode gerar prejuízo em caso de aumento de custos"
                    ],
                    documentos: [
                      "Contrato Social e alterações",
                      "CNPJ",
                      "Certidão Negativa de Débitos Federais",
                      "Certidão Negativa de Débitos Estaduais",
                      "Certidão Negativa de Débitos Municipais",
                      "Certidão Negativa de Débitos Trabalhistas",
                      "Certificado de Regularidade do FGTS",
                      "Atestado de Capacidade Técnica",
                      "Declaração de Cumprimento de Requisitos de Habilitação",
                      "Declaração de Menor Aprendiz"
                    ]
                  });
                  setTimeout(() => {
                    resultadoAnaliseRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }, 2000);
              }}
            >
              {isAnalyzing ? 'Analisando...' : 'Analisar Edital com IA'}
            </button>
          </div>

          {/* Resultado da Análise */}
          {analysisResult && (
            <div ref={resultadoAnaliseRef} className="bg-[#f8f9fa] p-8 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] max-w-4xl mx-auto">
              <h3 className="text-[#0056b3] mb-8 text-center text-2xl font-bold">Resultado da Análise</h3>

              {/* Resumo do Edital */}
              <div className="bg-white p-6 rounded-lg mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <h4 className="text-[#0056b3] mb-4 flex items-center gap-2 text-xl font-bold">
                  <FileText className="w-5 h-5" /> Resumo do Edital
                </h4>
                <div className="text-[#333] leading-[1.6] whitespace-pre-line">
                  {analysisResult.resumo}
                </div>
              </div>

              {/* Requisitos Principais */}
              <div className="bg-white p-6 rounded-lg mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <h4 className="text-[#0056b3] mb-4 flex items-center gap-2 text-xl font-bold">
                  <CheckSquare className="w-5 h-5" /> Requisitos Principais
                </h4>
                <div className="text-[#333] leading-[1.6]">
                  <ul className="list-disc pl-5">
                    {analysisResult.requisitos.map((req: string, i: number) => (
                      <li key={i} className="mb-2">{req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pontos Positivos e Negativos */}
              <div className="bg-white p-6 rounded-lg mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <h4 className="text-[#0056b3] mb-4 flex items-center gap-2 text-xl font-bold">
                  <Scale className="w-5 h-5" /> Pontos Positivos e Negativos
                </h4>
                <div className="flex gap-6 flex-wrap flex-col md:flex-row">
                  <div className="flex-1 min-w-[300px]">
                    <h5 className="text-[#28a745] mb-3 flex items-center gap-2 text-lg font-bold">
                      <ThumbsUp className="w-5 h-5" /> Pontos Positivos
                    </h5>
                    <ul className="list-none pl-0">
                      {analysisResult.pontosPositivos.map((ponto: string, i: number) => (
                        <li key={i} className="p-2 mb-2 rounded bg-[#f0fff4] border-l-4 border-[#28a745] text-[#333]">
                          {ponto}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 min-w-[300px]">
                    <h5 className="text-[#dc3545] mb-3 flex items-center gap-2 text-lg font-bold">
                      <ThumbsDown className="w-5 h-5" /> Pontos Negativos / Riscos
                    </h5>
                    <ul className="list-none pl-0">
                      {analysisResult.pontosNegativos.map((ponto: string, i: number) => (
                        <li key={i} className="p-2 mb-2 rounded bg-[#fff5f5] border-l-4 border-[#dc3545] text-[#333]">
                          {ponto}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Documentos Necessários */}
              <div className="bg-white p-6 rounded-lg mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                <h4 className="text-[#0056b3] mb-4 flex items-center gap-2 text-xl font-bold">
                  <FileSignature className="w-5 h-5" /> Documentos Necessários
                </h4>
                <div className="text-[#333] leading-[1.6]">
                  <ul className="list-disc pl-5">
                    {analysisResult.documentos.map((doc: string, i: number) => (
                      <li key={i} className="mb-2">{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Botão para Gerar Documentos */}
              <button 
                className="bg-[#ffc107] text-[#333] px-8 py-3 border-none rounded font-medium text-base cursor-pointer transition-colors w-full mt-4 hover:bg-[#e0a800]"
                onClick={() => {
                  if (!selectedCompanyId) {
                    alert('Por favor, selecione uma empresa antes de gerar os documentos!');
                    return;
                  }
                  alert('Gerando documentos com base nos dados da empresa e no edital... Em breve estarão prontos!');
                }}
              >
                Gerar Documentos para Esta Licitação
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Seção Geração de Documentos */}
      <section id="gerar-documentos" className="py-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#333] mb-4">Geração Automática de Documentos</h2>
          <p className="text-center text-[#666] mb-12 max-w-2xl mx-auto">
            Crie documentos de licitação já preenchidos com os dados da empresa selecionada, de forma rápida e segura.
          </p>

          {/* Seleção de Empresa e Tipo de Documento */}
          <div className="bg-white p-8 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label htmlFor="empresaDocumento" className="font-medium text-[#333] mb-2">Empresa:</label>
                <select 
                  id="empresaDocumento" 
                  required
                  className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                  value={docEmpresaId}
                  onChange={(e) => setDocEmpresaId(e.target.value)}
                >
                  <option value="">Selecione uma empresa</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.razaoSocial}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="tipoDocumento" className="font-medium text-[#333] mb-2">Tipo de Documento:</label>
                <select 
                  id="tipoDocumento" 
                  required
                  className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                  value={docTipo}
                  onChange={(e) => setDocTipo(e.target.value)}
                >
                  <option value="">Selecione o tipo de documento</option>
                  <option value="Declaração de Cumprimento de Requisitos de Habilitação">Declaração de Cumprimento de Requisitos de Habilitação</option>
                  <option value="Declaração de Menor Aprendiz">Declaração de Menor Aprendiz</option>
                  <option value="Declaração de Idoneidade">Declaração de Idoneidade</option>
                  <option value="Proposta Comercial">Proposta Comercial</option>
                  <option value="Cópia de Contrato Social (modelo)">Cópia de Contrato Social (modelo)</option>
                  <option value="Modelo de Impugnação de Edital">Modelo de Impugnação de Edital</option>
                  <option value="Modelo de Recurso Administrativo">Modelo de Recurso Administrativo</option>
                </select>
              </div>
            </div>

            {/* Campos Adicionais (dependendo do tipo de documento) */}
            {docTipo && (
              <div className="mt-6 pt-6 border-t border-[#eee]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col">
                    <label htmlFor="numeroEdital" className="font-medium text-[#333] mb-2">Número do Edital/Licitação:</label>
                    <input 
                      type="text" 
                      id="numeroEdital" 
                      placeholder="Ex: 90021/2025"
                      className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                      value={docNumeroEdital}
                      onChange={(e) => setDocNumeroEdital(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="objetoEdital" className="font-medium text-[#333] mb-2">Objeto da Licitação:</label>
                    <input 
                      type="text" 
                      id="objetoEdital" 
                      placeholder="Ex: Aquisição de equipamentos de informática"
                      className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                      value={docObjetoEdital}
                      onChange={(e) => setDocObjetoEdital(e.target.value)}
                    />
                  </div>
                </div>
                
                {docTipo === 'Proposta Comercial' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col">
                      <label htmlFor="valorProposta" className="font-medium text-[#333] mb-2">Valor da Proposta (R$):</label>
                      <input 
                        type="number" 
                        id="valorProposta" 
                        placeholder="0,00" 
                        step="0.01"
                        className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                        value={docValorProposta}
                        onChange={(e) => setDocValorProposta(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="dataValidade" className="font-medium text-[#333] mb-2">Validade da Proposta (dias):</label>
                      <input 
                        type="number" 
                        id="dataValidade" 
                        placeholder="60"
                        className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                        value={docDataValidade}
                        onChange={(e) => setDocDataValidade(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <button 
              className="bg-[#28a745] text-white px-8 py-3 border-none rounded font-medium text-base cursor-pointer transition-colors mt-6 hover:bg-[#218838] disabled:bg-[#6c757d] disabled:cursor-not-allowed"
              disabled={!docEmpresaId || !docTipo || isGeneratingDoc}
              onClick={() => {
                setIsGeneratingDoc(true);
                setTimeout(() => {
                  setIsGeneratingDoc(false);
                  const selectedCompany = companies.find(c => c.id === docEmpresaId);
                  
                  if (!selectedCompany) return;

                  const dataAtual = new Date().toLocaleDateString('pt-BR');
                  const dadosAdicionais = {
                    numeroEdital: docNumeroEdital,
                    objetoEdital: docObjetoEdital,
                    valorProposta: docValorProposta,
                    dataValidade: docDataValidade
                  };
                  const nomeDocumento = docTipo;

                  gerarEDownloadPDF(selectedCompany, docTipo, dadosAdicionais, nomeDocumento);

                  const newDoc = {
                    tipo: docTipo,
                    empresa: selectedCompany.razaoSocial,
                    data: dataAtual,
                    empresaObj: selectedCompany,
                    dadosAdicionais: dadosAdicionais,
                    nomeDocumento: nomeDocumento
                  };
                  setGeneratedDoc(newDoc);
                  setRecentDocs(prev => [newDoc, ...prev].slice(0, 5));
                }, 1500);
              }}
            >
              {isGeneratingDoc ? 'Gerando Documento...' : 'Gerar Documento'}
            </button>
          </div>

          {/* Área de Download do Documento Gerado */}
          {generatedDoc && (
            <div className="bg-[#f0fff4] border border-[#28a745] rounded-lg p-8 text-center max-w-4xl mx-auto mb-8">
              <h3 className="text-[#28a745] text-2xl font-bold mb-4">Documento Gerado com Sucesso!</h3>
              <p className="text-[#333] mb-4">Seu documento está pronto para ser baixado e usado.</p>
              <button 
                onClick={() => gerarEDownloadPDF(generatedDoc.empresaObj, generatedDoc.tipo, generatedDoc.dadosAdicionais, generatedDoc.nomeDocumento)}
                className="inline-block bg-[#28a745] text-white px-8 py-3 rounded font-medium mt-4 transition-colors hover:bg-[#218838] border-none cursor-pointer no-underline"
              >
                Baixar Documento (PDF)
              </button>
            </div>
          )}

          {/* Lista de Documentos Gerados */}
          <div className="bg-white p-8 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-[#0056b3] mb-4">Documentos Gerados Recentemente</h3>
            {recentDocs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {recentDocs.map((doc, index) => (
                  <div key={index} className="border border-[#ddd] rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h4 className="text-[#333] font-bold mb-2">{doc.tipo}</h4>
                      <p className="text-[#666] mb-1">{doc.empresa}</p>
                      <p className="text-sm text-[#999]">Gerado em: {doc.data}</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto justify-start">
                      <button 
                        onClick={() => gerarEDownloadPDF(doc.empresaObj, doc.tipo, doc.dadosAdicionais, doc.nomeDocumento)}
                        className="bg-[#17a2b8] text-white px-6 py-2.5 border-none rounded font-medium text-sm cursor-pointer transition-colors hover:bg-[#138496] no-underline inline-block"
                      >
                        Baixar Novamente
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#666] italic">Nenhum documento gerado ainda.</p>
            )}
          </div>
        </div>
      </section>

      {/* Seção Robô de Lance */}
      <section id="robo-lance" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#333] mb-4">Robô de Lance</h2>
          <p className="text-center text-[#666] mb-12 max-w-2xl mx-auto">
            Configure o robô para participar das disputas eletrônicas automaticamente, seguindo as regras que você definir.
          </p>

          {/* Seleção de Empresa e Licitação */}
          <div className="bg-white p-8 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col">
                <label htmlFor="empresaRobo" className="font-medium text-[#333] mb-2">Empresa:</label>
                <select 
                  id="empresaRobo" 
                  required
                  className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                  value={roboEmpresaId}
                  onChange={(e) => setRoboEmpresaId(e.target.value)}
                  disabled={isRoboRunning}
                >
                  <option value="">Selecione uma empresa</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.nomeFantasia || company.razaoSocial} - {company.cnpj}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="licitacaoRobo" className="font-medium text-[#333] mb-2">Licitação/Processo:</label>
                <select 
                  id="licitacaoRobo" 
                  required
                  className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                  value={roboLicitacaoId}
                  onChange={(e) => setRoboLicitacaoId(e.target.value)}
                  disabled={isRoboRunning}
                >
                  <option value="">Selecione uma licitação</option>
                  {oportunidadesExemplo.map(oportunidade => (
                    <option key={oportunidade.id} value={oportunidade.id}>
                      {oportunidade.tipo.toUpperCase()} nº {oportunidade.numero} - {oportunidade.objeto}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Configurações do Robô */}
            <div className="border-t border-[#eee] pt-6 mt-6">
              <h3 className="text-xl font-bold text-[#0056b3] mb-6">Configurações do Lance</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col">
                  <label htmlFor="valorMaximo" className="font-medium text-[#333] mb-2">Valor Mínimo que deseja chegar (R$):</label>
                  <input 
                    type="number" 
                    id="valorMaximo" 
                    placeholder="0,00" 
                    step="0.01" 
                    required
                    className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                    value={roboValorMaximo}
                    onChange={(e) => setRoboValorMaximo(e.target.value)}
                    disabled={isRoboRunning}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="incrementoMinimo" className="font-medium text-[#333] mb-2">Incremento Mínimo entre lances (R$):</label>
                  <input 
                    type="number" 
                    id="incrementoMinimo" 
                    placeholder="0,00" 
                    step="0.01" 
                    required
                    className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                    value={roboIncrementoMinimo}
                    onChange={(e) => setRoboIncrementoMinimo(e.target.value)}
                    disabled={isRoboRunning}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col">
                  <label htmlFor="tempoResposta" className="font-medium text-[#333] mb-2">Tempo de resposta após lance (segundos):</label>
                  <input 
                    type="number" 
                    id="tempoResposta" 
                    placeholder="5" 
                    min="1" 
                    required
                    className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                    value={roboTempoResposta}
                    onChange={(e) => setRoboTempoResposta(e.target.value)}
                    disabled={isRoboRunning}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="pararUltimoLance" className="font-medium text-[#333] mb-2">Parar se for o último lance?</label>
                  <select 
                    id="pararUltimoLance" 
                    required
                    className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                    value={roboPararUltimoLance}
                    onChange={(e) => setRoboPararUltimoLance(e.target.value)}
                    disabled={isRoboRunning}
                  >
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col mb-6">
                <label htmlFor="observacoesRobo" className="font-medium text-[#333] mb-2">Observações adicionais (opcional):</label>
                <textarea 
                  id="observacoesRobo" 
                  placeholder="Ex: Não ultrapassar o valor de mercado, priorizar lances em horários específicos..."
                  className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] min-h-[100px] resize-y"
                  value={roboObservacoes}
                  onChange={(e) => setRoboObservacoes(e.target.value)}
                  disabled={isRoboRunning}
                ></textarea>
              </div>
            </div>

            {!isRoboRunning ? (
              <button 
                className="w-full bg-[#28a745] text-white py-3 px-8 rounded font-medium text-base cursor-pointer transition-colors mt-6 hover:bg-[#218838] disabled:bg-[#6c757d] disabled:cursor-not-allowed"
                disabled={!roboEmpresaId || !roboLicitacaoId || !roboValorMaximo || !roboIncrementoMinimo}
                onClick={() => {
                  const empresa = companies.find(c => c.id === roboEmpresaId);
                  const licitacao = oportunidadesExemplo.find(o => o.id.toString() === roboLicitacaoId);
                  
                  if (!empresa || !licitacao) return;

                  const valorMaximoNum = parseFloat(roboValorMaximo);
                  const incrementoMinimoNum = parseFloat(roboIncrementoMinimo);
                  const tempoRespostaNum = parseInt(roboTempoResposta) || 5;
                  const pararUltimo = roboPararUltimoLance === 'sim';

                  setIsRoboRunning(true);
                  setRoboStatusText(`Robô em execução para a licitação nº ${licitacao.numero}...`);
                  setRoboHistorico([]);
                  setRoboProgress(0);
                  
                  roboProgressoRef.current = 0;
                  roboValorAtualRef.current = licitacao.valor;

                  roboIntervalRef.current = setInterval(() => {
                    const lanceConcorrente = roboValorAtualRef.current - (Math.random() * 1000);
                    
                    if (lanceConcorrente > valorMaximoNum) {
                      roboValorAtualRef.current = lanceConcorrente - incrementoMinimoNum;

                      const novoLance = {
                        id: Date.now(),
                        licitacao: licitacao.numero,
                        empresa: empresa.razaoSocial,
                        valor: roboValorAtualRef.current,
                        data: new Date().toLocaleString('pt-BR'),
                        tipo: 'Robô',
                        status: 'Lance enviado com sucesso'
                      };

                      setRoboHistorico(prev => [novoLance, ...prev]);

                      roboProgressoRef.current += 10;
                      if (roboProgressoRef.current > 100) roboProgressoRef.current = 100;
                      setRoboProgress(roboProgressoRef.current);

                      if (pararUltimo || roboValorAtualRef.current <= valorMaximoNum) {
                        if (roboIntervalRef.current) clearInterval(roboIntervalRef.current);
                        setIsRoboRunning(false);
                        setRoboStatusText(`Robô finalizado! Último lance: ${roboValorAtualRef.current.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
                      }
                    } else {
                      if (roboIntervalRef.current) clearInterval(roboIntervalRef.current);
                      setIsRoboRunning(false);
                      setRoboStatusText('Robô parou: valor do concorrente atingiu o limite mínimo definido.');
                    }
                  }, tempoRespostaNum * 1000);
                }}
              >
                Iniciar Robô de Lance
              </button>
            ) : (
              <button 
                className="w-full bg-[#dc3545] text-white py-3 px-8 rounded font-medium text-base cursor-pointer transition-colors mt-6 hover:bg-[#c82333]"
                onClick={() => {
                  if (roboIntervalRef.current) clearInterval(roboIntervalRef.current);
                  setIsRoboRunning(false);
                  setRoboStatusText('Robô parado manualmente.');
                }}
              >
                Parar Robô
              </button>
            )}
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            {/* Status do Robô */}
            <div className="bg-[#f8f9fa] p-8 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] text-center mb-8">
              <h3 className="text-xl font-bold text-[#0056b3] mb-4">Status do Robô</h3>
              <p className="text-[1.1rem] text-[#666] mb-4">{roboStatusText}</p>
              
              {isRoboRunning && (
                <div className="w-full h-5 bg-[#eee] rounded-full mb-4 overflow-hidden relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#28a745] transition-all duration-500 ease-out"
                    style={{ width: `${roboProgress}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Histórico de Lances */}
            <div className="bg-white p-8 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
              <h3 className="text-xl font-bold text-[#0056b3] mb-4">Histórico de Lances</h3>
              {roboHistorico.length > 0 ? (
                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2">
                  {roboHistorico.map(lance => (
                    <div key={lance.id} className="border border-[#ddd] rounded-lg p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center flex-wrap gap-4">
                      <div className="flex-1">
                        <h4 className="text-[#333] mb-2 font-bold">Lance para licitação nº {lance.licitacao}</h4>
                        <p className="text-[#666] mb-1"><strong>Empresa:</strong> {lance.empresa}</p>
                        <p className="text-[#666] mb-1"><strong>Data/Hora:</strong> {lance.data}</p>
                        <p className="text-[#666] mb-1"><strong>Tipo:</strong> {lance.tipo}</p>
                      </div>
                      <div className="text-[1.2rem] font-bold text-[#28a745]">
                        {lance.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#666] italic">Nenhum lance registrado ainda.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Seção Gestão de Processos */}
      <section id="gestao-processos" className="py-16 bg-[#f8f9fa]">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-3xl font-bold text-[#0056b3] text-center mb-4">Gestão de Processos</h2>
          <p className="text-center text-[#666] mb-8 max-w-2xl mx-auto">Acompanhe todos os processos de licitação em que suas empresas estão participando, com etapas e tarefas.</p>

          {/* Filtros */}
          <div className="bg-white p-8 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] mb-8 flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-end">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="empresaProcesso" className="block font-medium text-[#333] mb-2">Empresa:</label>
              <select 
                id="empresaProcesso"
                className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                value={processoEmpresaId}
                onChange={(e) => setProcessoEmpresaId(e.target.value)}
              >
                <option value="">Todas as empresas</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.nomeFantasia || company.razaoSocial} - {company.cnpj}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="statusProcesso" className="block font-medium text-[#333] mb-2">Status:</label>
              <select 
                id="statusProcesso"
                className="w-full p-3 border border-[#ccc] rounded focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
                value={processoStatus}
                onChange={(e) => setProcessoStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="analise">Em análise</option>
                <option value="participando">Participando</option>
                <option value="ganhou">Ganhou</option>
                <option value="perdeu">Perdeu</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <button 
              className="bg-[#0056b3] text-white py-[0.8rem] px-8 rounded-[5px] text-base font-medium cursor-pointer transition-colors hover:bg-[#004494] w-full md:w-auto"
              onClick={handleFiltrarProcessos}
            >
              Filtrar
            </button>
          </div>

          {/* Funil de Processos */}
          <div className="bg-white p-8 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)] mb-8">
            <h3 className="text-xl font-bold text-[#0056b3] mb-6">Funil de Processos</h3>
            <div className="flex flex-col md:flex-row gap-4 flex-wrap justify-between">
              <div className="flex-1 min-w-[150px] text-center p-6 rounded-lg bg-[#e9f0f8]">
                <h4 className="text-[#0056b3] mb-4 font-bold">Em Análise</h4>
                <div className="text-3xl font-bold text-[#333]">{contagemProcessos.analise}</div>
              </div>
              <div className="flex-1 min-w-[150px] text-center p-6 rounded-lg bg-[#e9f0f8]">
                <h4 className="text-[#0056b3] mb-4 font-bold">Participando</h4>
                <div className="text-3xl font-bold text-[#333]">{contagemProcessos.participando}</div>
              </div>
              <div className="flex-1 min-w-[150px] text-center p-6 rounded-lg bg-[#e9f0f8]">
                <h4 className="text-[#0056b3] mb-4 font-bold">Ganhou</h4>
                <div className="text-3xl font-bold text-[#333]">{contagemProcessos.ganhou}</div>
              </div>
              <div className="flex-1 min-w-[150px] text-center p-6 rounded-lg bg-[#e9f0f8]">
                <h4 className="text-[#0056b3] mb-4 font-bold">Perdeu</h4>
                <div className="text-3xl font-bold text-[#333]">{contagemProcessos.perdeu}</div>
              </div>
              <div className="flex-1 min-w-[150px] text-center p-6 rounded-lg bg-[#e9f0f8]">
                <h4 className="text-[#0056b3] mb-4 font-bold">Cancelado</h4>
                <div className="text-3xl font-bold text-[#333]">{contagemProcessos.cancelado}</div>
              </div>
            </div>
          </div>

          {/* Lista de Processos */}
          <div className="bg-white p-8 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
            <h3 className="text-xl font-bold text-[#0056b3] mb-6">Lista de Processos</h3>
            
            {processosFiltrados.length === 0 ? (
              <p className="text-[#666] italic mt-4">Nenhum processo encontrado com os filtros selecionados.</p>
            ) : (
              processosFiltrados.map((processo, index) => (
                <div key={index} className="border border-[#ddd] rounded-lg p-6 mb-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-[#eee] pb-4 gap-4">
                    <div className="font-bold text-[#0056b3] text-lg">{processo.tipo} nº {processo.numero}</div>
                    <div className={`py-1 px-3 rounded-full text-[0.9rem] font-medium ${statusColor[processo.status]}`}>
                      {statusTraduzido[processo.status]}
                    </div>
                  </div>
                  <div className="mb-4 text-[#333]">
                    <p><strong>Objeto:</strong> {processo.objeto}</p>
                    <p><strong>Empresa:</strong> {processo.empresa}</p>
                    <p><strong>Data de Abertura:</strong> {processo.dataAbertura}</p>
                  </div>
                  <div className="mt-4">
                    <h5 className="mb-3 text-[#333] font-bold">Tarefas:</h5>
                    {processo.tarefas.map((tarefa, tIndex) => (
                      <div key={tIndex} className="flex items-center gap-2 mb-2">
                        <input 
                          type="checkbox" 
                          id={`tarefa-${index}-${tIndex}`} 
                          className="w-[18px] h-[18px]" 
                          defaultChecked={tarefa.concluida} 
                        />
                        <label htmlFor={`tarefa-${index}-${tIndex}`} className="text-[#333]">{tarefa.descricao}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
            
            <p className="text-[#666] italic mt-4">Selecione os filtros acima para ver mais processos.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0056b3] text-white text-center py-4 mt-8">
        <div className="max-w-[1200px] mx-auto px-5">
          <p>&copy; {new Date().getFullYear()} Plataforma LicitaPlus - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}
