import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <h2 className="text-xl font-semibold text-slate-700">Atualizando dados da planilha...</h2>
      <div className="w-full max-w-md space-y-2">
        <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  );
}