import React from 'react';
import { RoadmapData, DifficultyLevel } from '../types';
import { BookNode } from './BookNode';
import { MapIcon, TargetIcon, AlertIcon } from './Icons';

interface RoadmapDisplayProps {
  data: RoadmapData;
}

const getLevelDisplay = (level: DifficultyLevel) => {
  switch (level) {
    case DifficultyLevel.Beginner: return "入门 / 新手";
    case DifficultyLevel.Intermediate: return "进阶 / 实践者";
    case DifficultyLevel.Advanced: return "高阶 / 专家";
    default: return level;
  }
};

export const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Analysis */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 mb-12">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-3">
              <MapIcon className="w-4 h-4" />
              <span>领域定位</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">{data.domain}</h2>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">{data.summary}</p>
            
            {/* Gap Analysis Block */}
             {data.userBookAnalysis.title !== "None" && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mt-4">
                 <div className="flex items-start gap-3">
                    <AlertIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-bold text-amber-900 mb-1">当前定位与缺口分析</h3>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            阅读 <strong>《{data.userBookAnalysis.title}》</strong> 将你定位在 <span className="font-semibold underline decoration-amber-400/50">{getLevelDisplay(data.userBookAnalysis.assignedLevel)}</span> 阶段。
                        </p>
                        <p className="text-sm text-amber-800 mt-2 leading-relaxed italic">
                            “{data.userBookAnalysis.gapAnalysis}”
                        </p>
                    </div>
                 </div>
              </div>
             )}
          </div>
          
          {/* Quick Action */}
          <div className="md:w-72 bg-slate-50 rounded-xl p-5 border border-slate-100 flex-shrink-0">
            <div className="flex items-center space-x-2 text-slate-800 mb-3">
                <TargetIcon className="w-5 h-5" />
                <h3 className="font-bold text-sm">下一步建议</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                {data.userBookAnalysis.nextSteps}
            </p>
          </div>
        </div>
      </div>

      {/* The Roadmap Timeline */}
      <div className="relative space-y-16 pl-4 md:pl-0">
        
        {/* Connecting Line (Vertical) */}
        <div className="absolute left-4 md:left-1/2 top-8 bottom-8 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block"></div>
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-slate-200 -translate-x-1/2 md:hidden"></div>

        {data.roadmap.map((level, index) => {
            const isEven = index % 2 === 0;
            // Determine styling based on difficulty
            let themeColor = "bg-emerald-500";
            let themeLight = "bg-emerald-50 text-emerald-800";
            if (level.levelName === DifficultyLevel.Intermediate) {
                themeColor = "bg-blue-500";
                themeLight = "bg-blue-50 text-blue-800";
            } else if (level.levelName === DifficultyLevel.Advanced) {
                themeColor = "bg-purple-500";
                themeLight = "bg-purple-50 text-purple-800";
            }

            return (
                <div key={index} className={`relative flex flex-col md:flex-row gap-8 items-start md:items-center ${isEven ? '' : 'md:flex-row-reverse'}`}>
                    
                    {/* Center Dot */}
                    <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 -translate-x-1/2 ${themeColor}`}></div>

                    {/* Content Side: Description */}
                    <div className="flex-1 pl-12 md:pl-0 md:w-1/2 text-left md:text-right md:pr-12">
                       <div className={`${isEven ? 'md:text-right' : 'md:text-left'}`}>
                           <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold tracking-wider mb-2 ${themeLight}`}>
                                {getLevelDisplay(level.levelName)}
                           </span>
                           <h3 className="text-xl font-bold text-slate-800 mb-2">核心概念与目标</h3>
                           <p className="text-sm text-slate-600 mb-3">{level.description}</p>
                           <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                                {level.keyConcepts.map((concept, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded text-slate-500">
                                        {concept}
                                    </span>
                                ))}
                           </div>
                       </div>
                    </div>

                    {/* Content Side: Books */}
                    <div className="flex-1 pl-12 md:pl-12 md:w-1/2">
                        <div className="grid gap-4">
                            {level.books.map((book, idx) => (
                                <BookNode key={idx} book={book} />
                            ))}
                        </div>
                    </div>
                </div>
            );
        })}

      </div>
    </div>
  );
};