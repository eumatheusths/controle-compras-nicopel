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

// --- FUNÇÃO DE AUTENTICAÇÃO SEGURA (LAZY LOAD) ---
// O segredo está aqui: só criamos a autenticação quando a função é chamada, não no topo do arquivo.
const getAuth = () => {
  // Proteção contra falha no Build: Se não tiver chave, usa vazio para não travar
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
  const keyRaw = process.env.GOOGLE_PRIVATE_KEY || '';
  const key = keyRaw.replace(/\\n/g, '\n');

  if (!email || !keyRaw) {
    console.error("ERRO: Credenciais do Google não encontradas no .env");
  }

  return new JWT({
    email: email,
    key: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

async function getDoc() {
  const serviceAccountAuth = getAuth(); // Chama a autenticação aqui dentro
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

// --- FUNÇÕES DE DADOS ---

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
    console.error("Erro ao buscar compras:", error);
    return []; // Retorna lista vazia em vez de quebrar o site
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
    console.error("Erro ao atualizar:", error);
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
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}