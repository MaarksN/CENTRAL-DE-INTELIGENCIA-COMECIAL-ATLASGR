import React, { useState } from 'react';
import { MessageSquare, Target, AlertCircle, RefreshCw, Copy, CheckCircle2, Mail, UserCheck, ShieldAlert, Phone, MessageCircle } from 'lucide-react';

type ToolType = 'script_call' | 'script_whatsapp' | 'script_email' | 'prompt' | 'objections' | 'followup' | 'profile' | 'risk' | null;

const TOOLS = [
    { id: 'script_call', icon: Phone, title: 'Script de Ligação', desc: 'Crie abordagens de Cold Call diretas, focadas em agendar reuniões.' },
    { id: 'script_whatsapp', icon: MessageCircle, title: 'Mensagem (WhatsApp/LinkedIn)', desc: 'Mensagens curtas e informais focadas em Social Selling e WhatsApp.' },
    { id: 'script_email', icon: Mail, title: 'Template de E-mail', desc: 'Cold e-mails persuasivos baseados em dores de transporte.' },
    { id: 'prompt', icon: Target, title: 'Prompts de Qualificação', desc: 'Perguntas-chave baseadas na dor específica do lead.' },
    { id: 'objections', icon: AlertCircle, title: 'Matriz de Objeções', desc: 'Contorne objeções usando as técnicas homologadas da Atlas.' },
    { id: 'followup', icon: Mail, title: 'E-mail de Follow-up', desc: 'Rascunhe e-mails pós-reunião focados em conversão e próximos passos.' },
    { id: 'profile', icon: UserCheck, title: 'Análise de Perfil', desc: 'Dicas de abordagem via Social Selling e perfil comportamental.' },
    { id: 'risk', icon: ShieldAlert, title: 'Diagnóstico de Risco', desc: 'Avalie os riscos de fechamento e gaps na negociação.' }
] as const;

export function Intelligence() {
    const [activeTool, setActiveTool] = useState<ToolType>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async (tool: ToolType) => {
        setActiveTool(tool);
        setIsGenerating(true);
        setResult(null);
        setCopied(false);
        
        try {
            const response = await fetch('/api/intelligence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool })
            });
            
            if (response.ok) {
                const data = await response.json();
                setResult(data.result);
            } else {
                setResult("Erro ao gerar conteúdo. Tente novamente.");
            }
        } catch (error) {
            console.error("Error generating intelligence:", error);
            setResult("Erro ao conectar com a IA.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 flex flex-col h-full">
                <div>
                    <h2 className="font-black text-2xl text-atlas-dark mb-2">Atlas Intelligence</h2>
                    <p className="text-gray-500 text-sm mb-6">Ferramentas avançadas de IA para potencializar suas abordagens.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 overflow-y-auto pr-2 pb-4 max-h-[600px] scrollbar-thin scrollbar-thumb-gray-200">
                    {TOOLS.map(tool => (
                        <div 
                            key={tool.id}
                            onClick={() => handleGenerate(tool.id as ToolType)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all group flex items-start gap-4 ${activeTool === tool.id ? 'border-atlas-orange bg-orange-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-atlas-orange/30'}`}
                        >
                            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${activeTool === tool.id ? 'bg-atlas-orange text-white' : 'bg-gray-50 text-atlas-orange group-hover:bg-orange-50'}`}>
                                <tool.icon size={22} />
                            </div>
                            <div>
                                <h3 className="font-black text-base text-atlas-dark mb-1 leading-tight group-hover:text-atlas-orange transition-colors">{tool.title}</h3>
                                <p className="text-xs text-gray-500 mb-2 leading-relaxed">{tool.desc}</p>
                                <span className={`font-bold text-[10px] uppercase tracking-wider ${activeTool === tool.id ? 'text-atlas-orange' : 'text-gray-400 group-hover:text-atlas-orange'}`}>
                                    Usar ferramenta →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-8">
                <div className="bg-white border border-gray-200 rounded-2xl h-full min-h-[500px] flex flex-col overflow-hidden shadow-sm sticky top-24">
                    {/* Header bar */}
                    <div className="bg-atlas-dark p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                            <div className="w-2.5 h-2.5 rounded-full bg-atlas-orange animate-pulse"></div>
                            <span className="font-bold text-sm tracking-widest uppercase">Output de Inteligência</span>
                        </div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col bg-gray-50/30">
                        {!activeTool && !isGenerating && !result && (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <Target size={40} className="text-gray-300" />
                                </div>
                                <h3 className="font-black text-xl text-atlas-dark mb-2">Pronto para gerar</h3>
                                <p className="font-medium text-sm text-center max-w-xs">Selecione uma ferramenta ao lado para a IA analisar o contexto e gerar o conteúdo.</p>
                            </div>
                        )}

                        {isGenerating && (
                            <div className="flex-1 flex flex-col items-center justify-center text-atlas-orange">
                                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-6 relative">
                                    <div className="absolute inset-0 border-4 border-atlas-orange border-t-transparent rounded-full animate-spin"></div>
                                    <RefreshCw size={24} className="text-atlas-orange animate-pulse" />
                                </div>
                                <h3 className="font-black text-lg text-atlas-dark mb-1">Processando</h3>
                                <p className="font-bold animate-pulse text-sm uppercase tracking-wider text-gray-500">Atlas IA analisando dados...</p>
                            </div>
                        )}

                        {result && !isGenerating && (
                            <div className="flex-1 flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Resultado Gerado
                                    </div>
                                    <button 
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-atlas-dark transition-colors bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm"
                                    >
                                        {copied ? <CheckCircle2 size={16} className="text-green-500"/> : <Copy size={16}/>}
                                        {copied ? 'COPIADO' : 'COPIAR TEXTO'}
                                    </button>
                                </div>
                                <div className="flex-1 bg-white p-6 rounded-xl border border-gray-100 shadow-inner whitespace-pre-wrap font-medium text-gray-700 leading-relaxed overflow-y-auto">
                                    {result}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
