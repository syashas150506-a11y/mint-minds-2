import React, { useState } from 'react';
import { GOVT_SCHEMES } from '../../constants';
import { 
  ArrowRight, ExternalLink, FileText, CheckCircle2, 
  HelpCircle, ChevronRight, Landmark, GraduationCap, 
  Briefcase, Shield, Coins, ArrowLeft 
} from 'lucide-react';

export const InfoSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedScheme = GOVT_SCHEMES.find(s => s.id === selectedId);

  const getIcon = (id: string) => {
      switch(id) {
          case 'nps': return <Landmark size={32} />;
          case 'scholarship': return <GraduationCap size={32} />;
          case 'epf': return <Briefcase size={32} />;
          case 'apy': return <Shield size={32} />;
          case 'ssy': return <Coins size={32} />;
          default: return <FileText size={32} />;
      }
  };

  if (selectedScheme) {
      return (
          <div className="max-w-5xl mx-auto animate-fade-in-up">
              <button 
                  onClick={() => setSelectedId(null)}
                  className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors"
              >
                  <ArrowLeft size={20} /> Back to Schemes
              </button>

              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                  {/* Header */}
                  <div className="p-8 bg-slate-50 border-b border-slate-200">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                          <div className="flex gap-4">
                              <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-600 border border-slate-100 h-fit">
                                  {getIcon(selectedScheme.id)}
                              </div>
                              <div>
                                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-2 border border-indigo-200">
                                      {selectedScheme.category}
                                  </span>
                                  <h2 className="text-3xl font-bold text-slate-800 mb-2">{selectedScheme.title}</h2>
                                  <p className="text-slate-500 text-lg leading-relaxed">{selectedScheme.description}</p>
                              </div>
                          </div>
                          <a 
                              href={selectedScheme.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                          >
                              Apply Now <ExternalLink size={18} />
                          </a>
                      </div>
                  </div>

                  <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left Content */}
                      <div className="lg:col-span-2 space-y-8">
                          <section>
                              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <HelpCircle className="text-indigo-500" /> Overview
                              </h3>
                              <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                  {selectedScheme.details.overview}
                              </p>
                          </section>

                          <section>
                              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <CheckCircle2 className="text-emerald-500" /> Eligibility Criteria
                              </h3>
                              <ul className="space-y-3">
                                  {selectedScheme.details.eligibility.map((item, i) => (
                                      <li key={i} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors">
                                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                          </div>
                                          <span className="text-slate-700 font-medium">{item}</span>
                                      </li>
                                  ))}
                              </ul>
                          </section>

                          <section>
                              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <FileText className="text-amber-500" /> Required Documents
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {selectedScheme.details.documents.map((doc, i) => (
                                      <div key={i} className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 font-medium">
                                          <FileText size={18} className="text-amber-600 shrink-0" />
                                          {doc}
                                      </div>
                                  ))}
                              </div>
                          </section>
                      </div>

                      {/* Right Sidebar - Process */}
                      <div className="space-y-6">
                          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden sticky top-8">
                              <div className="absolute top-0 right-0 p-12 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                                  Application Process
                              </h3>
                              <div className="space-y-6 relative z-10">
                                  {selectedScheme.details.process.map((step, i) => (
                                      <div key={i} className="flex gap-4">
                                          <div className="flex flex-col items-center">
                                              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/50 shrink-0">
                                                  {i + 1}
                                              </div>
                                              {i !== selectedScheme.details.process.length - 1 && (
                                                  <div className="w-0.5 h-full bg-slate-700 my-2" />
                                              )}
                                          </div>
                                          <p className="text-slate-300 text-sm pt-1.5 pb-4">
                                              {step}
                                          </p>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
      <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-800 mb-4 flex items-center justify-center gap-3">
                  <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm">
                      <FileText size={32} />
                  </div>
                  Info Center & Schemes
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                  Access comprehensive details about government schemes, scholarships, and financial instruments to secure your future.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GOVT_SCHEMES.map((scheme) => (
                  <button
                      key={scheme.id}
                      onClick={() => setSelectedId(scheme.id)}
                      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left group flex flex-col h-full relative overflow-hidden"
                  >
                      {/* Decorative gradient */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-bl-full opacity-50 transition-opacity group-hover:opacity-100" />

                      <div className="flex justify-between items-start mb-6 relative z-10">
                          <div className="p-4 bg-slate-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                              {getIcon(scheme.id)}
                          </div>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
                              {scheme.category}
                          </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors relative z-10">
                          {scheme.title}
                      </h3>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-2 relative z-10">
                          {scheme.description}
                      </p>
                      
                      <div className="mt-auto flex items-center text-indigo-600 font-bold text-sm gap-2 relative z-10">
                          View Details <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                  </button>
              ))}
          </div>
      </div>
  );
};