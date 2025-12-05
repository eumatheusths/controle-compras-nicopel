import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

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

// FUNÇÃO DE CONEXÃO SEGURA (BLINDADA CONTRA ERROS DE BUILD)
const getDoc = async () => {
  // O "|| ''" evita que o código quebre se a variável não existir no build
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
  const key = rawKey.replace(/\\n/g, '\n');
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
  const sheetId = process.env.GOOGLE_SHEET_ID || '';

  if (!key || !email || !sheetId) {
    throw new Error("Credenciais do Google ausentes. Verifique o .env.local ou Vercel Envs.");
  }

  const serviceAccountAuth = new JWT({
    email: email,
    key: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
};

export async function getCompras(): Promise<Compra[]> {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
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
  } catch (error) {
    console.error("Build safe mode: Erro ao ler compras", error);
    return []; // Retorna vazio para não travar o build
  }
}

export async function updateCompra(rowIndex: number, data: Partial<Compra>) {
  try {
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
  } catch (error) {
    return false;
  }
}

export async function getUsuarios(): Promise<Usuario[]> {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle['Usuarios'] || doc.sheetsByIndex[1];
    if (!sheet) return [];
    const rows = await sheet.getRows();
    return rows.map((row) => ({
      nome: row.get('Nome') || '',
      email: row.get('Email') || '',
      senha: row.get('Senha') || '',
      funcao: row.get('Funcao') || 'User',
    }));
  } catch (error) {
    return [];
  }
}