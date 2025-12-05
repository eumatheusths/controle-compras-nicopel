'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload } from 'lucide-react';

export default function ImportadorPlanilha() {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      
      // Pega a primeira aba da planilha
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      
      // Converte para JSON
      const dados = XLSX.utils.sheet_to_json(ws);
      
      console.log("Dados importados:", dados);
      alert(`Lido com sucesso! ${dados.length} linhas encontradas. (Lógica de salvar pendente)`);
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="hidden"
        id="upload-sheet"
        disabled={loading}
      />
      <label
        htmlFor="upload-sheet"
        className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-green-700 cursor-pointer transition"
      >
        {loading ? 'Lendo...' : (
          <>
            <Upload size={18} /> Importar Excel
          </>
        )}
      </label>
    </div>
  );
}