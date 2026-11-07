import React, { useState, useMemo } from 'react';
import { SPECIALIZATIONS_DIRECTORY, SpecializationInfo } from '../data/specializationsData';
import { useTranslation } from '../i18n/LanguageContext';
import {
  Stethoscope,
  Search,
  Filter,
  Building2,
  Users,
  HeartPulse,
  Bone,
  Baby,
  Brain,
  Activity,
  Sparkles,
  Wind,
  ShieldAlert,
  Ear,
  Eye,
  Smile,
  Gauge,
  Shield,
  Zap,
  Flame,
  Scissors,
  Droplet,
  AlertCircle,
  HeartHandshake,
} from 'lucide-react';

interface SpecializationsPageProps {
  onSelectSpecialtyForHospitals: (departmentName: string) => void;
  onSelectSpecialtyForDoctors: (specializationName: string) => void;
}

const CATEGORIES = [
  'ALL',
  'General',
  'Internal Medicine',
  'Surgical',
  'Pediatrics',
  'Women',
  'Super Specialty',
];

export const SpecializationsPage: React.FC<SpecializationsPageProps> = ({
  onSelectSpecialtyForHospitals,
  onSelectSpecialtyForDoctors,
}) => {
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredSpecialties = useMemo(() => {
    return SPECIALIZATIONS_DIRECTORY.filter(spec => {
      if (selectedCategory !== 'ALL' && spec.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const blob = `${spec.name} ${spec.teluguName} ${spec.hindiName} ${spec.description} ${spec.symptoms.join(' ')} ${spec.commonConditions.join(' ')} ${spec.recommendedDepartment}`.toLowerCase();
        return blob.includes(q);
      }
      return true;
    });
  }, [searchTerm, selectedCategory]);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'Bone': return <Bone className="w-6 h-6 text-amber-600" />;
      case 'Baby': return <Baby className="w-6 h-6 text-sky-600" />;
      case 'Brain': return <Brain className="w-6 h-6 text-purple-600" />;
      case 'Wind': return <Wind className="w-6 h-6 text-teal-600" />;
      case 'Scissors': return <Scissors className="w-6 h-6 text-blue-600" />;
      case 'Ear': return <Ear className="w-6 h-6 text-indigo-600" />;
      case 'Eye': return <Eye className="w-6 h-6 text-emerald-600" />;
      case 'Smile': return <Smile className="w-6 h-6 text-pink-600" />;
      case 'Droplet': return <Droplet className="w-6 h-6 text-red-600" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Flame': return <Flame className="w-6 h-6 text-orange-600" />;
      case 'Shield': return <Shield className="w-6 h-6 text-cyan-600" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-emerald-700" />;
      default: return <Stethoscope className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-8 md:p-12 relative overflow-hidden shadow-xl border border-indigo-900/50">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
            <Stethoscope className="w-3.5 h-3.5 text-indigo-400" />
            Pan-India Medical Council Recognized Disciplines
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            {t('specialties.title')}
          </h1>
          <p className="text-base md:text-lg text-indigo-100/90 leading-relaxed">
            {t('specialties.subtitle')}
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t('specialties.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 border-0 focus:ring-2 focus:ring-indigo-400 shadow-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Count */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat === 'ALL' ? t('specialties.allCategories') : cat}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Showing {filteredSpecialties.length} Specialties
          </span>
        </div>

        {/* Directory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSpecialties.map(spec => (
            <div
              key={spec.id}
              className="rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    {renderIcon(spec.iconName)}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {spec.category}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg leading-snug">
                  {spec.name}
                </h3>
                {language === 'Telugu' && (
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">
                    {spec.teluguName}
                  </p>
                )}
                {language === 'Hindi' && (
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">
                    {spec.hindiName}
                  </p>
                )}

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {spec.description}
                </p>

                {/* Common Conditions */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Common Conditions:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {spec.commonConditions.slice(0, 3).map((cond, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-50 text-slate-700 border border-slate-200/60"
                      >
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Symptoms */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Associated Symptoms:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {spec.symptoms.slice(0, 3).map((sym, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-800"
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectSpecialtyForHospitals(spec.recommendedDepartment)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {t('specialties.findHospitals')}
                </button>
                <button
                  onClick={() => onSelectSpecialtyForDoctors(spec.name)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  {t('specialties.findDoctors')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
