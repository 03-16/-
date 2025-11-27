import React, { useState } from 'react';
import { SearchIcon, BookOpenIcon, CompassIcon, ArrowRightIcon } from './components/Icons';
import { generateRoadmap } from './services/geminiService';
import { RoadmapData } from './types';
import { RoadmapDisplay } from './components/RoadmapDisplay';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'book' | 'topic'>('book');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoadmapData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateRoadmap({ query, mode });
      setData(result);
    } catch (err: any) {
      setError(err.message || "生成学习路线图时出现了问题，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Hero / Header */}
      <header className={`relative z-10 transition-all duration-500 ${data ? 'py-8 bg-white border-b border-slate-100' : 'py-24 md:py-32'}`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          {!data && (
            <>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-6">
                <CompassIcon className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight">
                这一本，通往何处？
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
                一键生成书籍层级定位，发现知识缺口，规划从入门到精通的进阶之路。
              </p>
            </>
          )}

          <div className={`mx-auto ${data ? 'w-full max-w-2xl' : 'w-full'}`}>
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={mode === 'book' ? "例如：思考，快与慢" : "例如：行为经济学"}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading || !query.trim()}
                className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-6 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>生成图谱</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="flex justify-center mt-4 space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="mode" 
                  checked={mode === 'book'} 
                  onChange={() => setMode('book')} 
                  className="hidden"
                />
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${mode === 'book' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white group-hover:border-slate-400'}`}>
                    {mode === 'book' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </span>
                <span className={`text-sm font-medium ${mode === 'book' ? 'text-blue-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    分析单本书籍
                </span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="mode" 
                  checked={mode === 'topic'} 
                  onChange={() => setMode('topic')} 
                  className="hidden"
                />
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${mode === 'topic' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white group-hover:border-slate-400'}`}>
                    {mode === 'topic' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </span>
                <span className={`text-sm font-medium ${mode === 'topic' ? 'text-blue-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    探索特定领域
                </span>
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow bg-slate-50/50 px-4 py-12 md:px-6">
        {error && (
           <div className="max-w-lg mx-auto p-6 bg-red-50 border border-red-100 rounded-xl text-center">
              <p className="text-red-600 font-medium mb-2">分析失败</p>
              <p className="text-sm text-red-500">{error}</p>
           </div>
        )}

        {!data && !loading && !error && (
            <div className="max-w-4xl mx-auto text-center py-12">
                <h3 className="text-slate-400 font-serif italic text-2xl mb-8 opacity-50">如何使用</h3>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                            <BookOpenIcon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">情境化分析</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">不仅仅是阅读。了解这本书在更广泛的学术或文学领域中所处的位置。</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                            <CompassIcon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">缺口识别</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">找出你遗漏了什么。我们会突出显示你当前书籍可能跳过的关键概念。</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
                            <ArrowRightIcon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">进阶指引</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">获得具体的阅读建议，帮助你从当前水平晋升到下一个阶段。</p>
                    </div>
                </div>
            </div>
        )}

        {loading && (
            <div className="max-w-lg mx-auto text-center pt-20">
                <div className="inline-block w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-medium text-slate-700 animate-pulse">正在查阅资料库...</h3>
                <p className="text-slate-500 mt-2">正在为您构建知识结构。</p>
            </div>
        )}

        {data && <RoadmapDisplay data={data} />}
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 text-center">
        <p className="text-slate-400 text-sm">
            Powered by Gemini 2.5 Flash • 为爱书人打造
        </p>
      </footer>
    </div>
  );
};

export default App;