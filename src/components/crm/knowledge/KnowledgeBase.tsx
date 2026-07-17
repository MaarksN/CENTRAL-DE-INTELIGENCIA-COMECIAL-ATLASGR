import React, { useState } from 'react';
import { Database, Search, UploadCloud, FileText } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export function KnowledgeBase() {
  const [query, setQuery] = useState('');

  const documents = [
    { id: '1', title: 'Playbook de Vendas 2026', type: 'PDF', status: 'Indexed', chunks: 42 },
    { id: '2', title: 'Planilha de Concorrentes', type: 'CSV', status: 'Indexed', chunks: 15 },
    { id: '3', title: 'Ata Reunião Executiva', type: 'DOCX', status: 'Processing', chunks: 0 }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="text-blue-600" /> Enterprise Knowledge Platform
          </h1>
          <p className="text-slate-500 text-sm mt-1">Biblioteca central vetorizada (RAG) para os agentes de IA.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <UploadCloud size={18} /> Ingestão de Documento
        </button>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Busca vetorial (Teste RAG)..."
          className="w-full bg-transparent border-none outline-none text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Documento</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Status RAG</th>
              <th className="px-4 py-3 text-right">Chunks (Vetores)</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer">
                <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2">
                  <FileText size={16} className="text-slate-400"/> {doc.title}
                </td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{doc.type}</td>
                <td className="px-4 py-3">
                  <Badge variant={doc.status === 'Indexed' ? 'success' : 'warning'}>
                    {doc.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right text-slate-500">{doc.chunks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
