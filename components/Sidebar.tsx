
import React from 'react';
import { Section } from '../types';
import { 
  Lightbulb, 
  Map, 
  Palette, 
  Code, 
  PlusCircle 
} from 'lucide-react';

interface SidebarProps {
  currentSection: Section;
  setSection: (section: Section) => void;
  reset: () => void;
  hasIdea: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, setSection, reset, hasIdea }) => {
  const items: { id: Section; label: string; icon: any }[] = [
    { id: 'concept', label: 'Concept', icon: Lightbulb },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'design', label: 'Design Mockups', icon: Palette },
    { id: 'code', label: 'Starter Code', icon: Code },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Code className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">AppCreator AI</h1>
        </div>

        <nav className="space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => hasIdea && setSection(item.id)}
              disabled={!hasIdea && item.id !== 'concept'}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentSection === item.id
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : hasIdea 
                    ? 'text-slate-600 hover:bg-slate-50' 
                    : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New App Idea</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
