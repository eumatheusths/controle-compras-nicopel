import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// --- INTERFACES ---
export interface Compra {
  id: string;
  rowIndex: number;
  empresa: string;
  data: string;
  fornecedor: string;
  nfe: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  status: string;
  almoxarifado: string;
}

export interface Usuario {
  nome: string;
  email: string;
  senha: string;
  funcao: string;
}

// --- CONFIGURAÇÃO E AUTENTICAÇÃO ---
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function getDoc() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

// --- FUNÇÕES DE COMPRAS (O que você já tinha) ---
export async function getCompras(): Promise<Compra[]> {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[0]; // Aba 1: Compras
  const rows = await sheet.getRows();

  return rows.map((row, index) => {
    const cleanMoney = (val: string) => parseFloat((val || '0').replace(/[R$\s.]/g, '').replace(',', '.'));
    
    return {
      id: index.toString(),
      rowIndex: index,
      empresa: row.get('Empresa') || 'Outros',
      data: row.get('Data Entrada') || '',
      fornecedor: row.get('Fornecedor') || 'Desconhecido',
      nfe: row.get('Número NFe') || '-',
      descricao: row.get('Descrição') || '',
      unidade: row.get('Un. Compra') || 'UN',
      quantidade: parseFloat((row.get('Qtd Compra') || '0').replace(',', '.')),
      valorUnitario: cleanMoney(row.get('R$ Unitário')),
      valorTotal: cleanMoney(row.get('R$ Total')),
      status: row.get('Situacão Item') || 'Ativo',
      almoxarifado: row.get('Almoxarifado') || ''
    };
  });
}

export async function updateCompra(rowIndex: number, data: Partial<Compra>) {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  
  if (rows[rowIndex]) {
    const row = rows[rowIndex];
    if (data.status) row.set('Situacão Item', data.status);
    if (data.descricao) row.set('Descrição', data.descricao);
    if (data.empresa) row.set('Empresa', data.empresa);
    
    await row.save();
    return true;
  }
  return false;
}

// --- NOVA FUNÇÃO: BUSCAR USUÁRIOS (Para o Login) ---
export async function getUsuarios(): Promise<Usuario[]> {
  const doc = await getDoc();
  
  // Tenta achar a aba pelo nome "Usuarios". 
  // Se não achar, tenta pegar a segunda aba (index 1) da planilha.
  const sheet = doc.sheetsByTitle['Usuarios'] || doc.sheetsByIndex[1];

  if (!sheet) {
    console.error("Aba 'Usuarios' não encontrada na planilha.");
    return [];
  }

  const rows = await sheet.getRows();

  return rows.map((row) => ({
    // Certifique-se que na planilha os cabeçalhos sejam: Nome, Email, Senha, Funcao
    nome: row.get('Nome') || '',
    email: row.get('Email') || '',
    senha: row.get('Senha') || '', // A senha vem como texto da planilha
    funcao: row.get('Funcao') || 'User',
  }));
}