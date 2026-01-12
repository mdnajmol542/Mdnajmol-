
import React, { useState } from 'react';
import { AppIdea } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';

interface ConceptFormProps {
  onSubmit: (idea: AppIdea) => void;
  isLoading: boolean;
}

// Form component for capturing initial app idea details
const ConceptForm: React.FC<ConceptFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<AppIdea>({
    title: '',
    description: '',
    targetAudience: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">What are we building today?</h2>
        <p className="text-slate-500">Describe your vision, and we'll help you bring it to life with AI-driven strategy, design, and code.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">App Title</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. FitTrack Pro"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="What does your app do? What problem does it solve?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Target Audience</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. Fitness enthusiasts, busy professionals"
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate App Concept</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ConceptForm;
