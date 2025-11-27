import React from 'react';
import { BookRecommendation } from '../types';

interface BookNodeProps {
  book: BookRecommendation;
}

export const BookNode: React.FC<BookNodeProps> = ({ book }) => {
  return (
    <div className={`group relative flex flex-col p-4 rounded-xl border transition-all duration-300 ${
      book.isCurrent 
        ? 'bg-blue-50 border-blue-200 shadow-md ring-1 ring-blue-300' 
        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
    }`}>
      {book.isCurrent && (
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
          当前正在阅读
        </span>
      )}
      
      <div className="flex items-start space-x-3">
        {/* Decorative generic book cover placeholder since we don't have real covers */}
        <div className={`w-12 h-16 flex-shrink-0 rounded shadow-sm flex items-center justify-center text-xl font-serif ${
             book.isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
        }`}>
            {book.title.charAt(0)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-bold leading-tight mb-1 ${book.isCurrent ? 'text-blue-900' : 'text-slate-900'}`}>
            {book.title}
          </h4>
          <p className="text-xs text-slate-500 mb-2 font-medium">{book.author} 著</p>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 group-hover:line-clamp-none">
            {book.reason}
          </p>
        </div>
      </div>
    </div>
  );
};