import React from 'react';
import { Activity, ShieldCheck, Heart, Lock, AlertCircle, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      {/* Medical Disclaimer Banner */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-amber-400 font-semibold flex-shrink-0">
            <AlertCircle className="w-4 h-4" />
            <span>IMPORTANT MEDICAL DISCLAIMER:</span>
          </div>
          <p className="leading-relaxed">
            Universal Health Care AI is an intelligent healthcare provider directory and navigation platform. The AI assistant and platform content are designed for informational and administrative purposes only and <strong>do not substitute for professional medical advice, clinical diagnosis, or medical treatment</strong>. Always consult a qualified, registered healthcare practitioner with any questions regarding medical conditions. In case of emergency, immediately dial <strong>108 (Ambulance)</strong> or <strong>112</strong>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/40">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                UNIVERSAL HEALTH CARE AI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Healthcare for Everyone, Everywhere. Discover verified medical providers, reserve atomic appointment slots, and access multilingual voice AI guidance.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Council-Verified Healthcare Providers</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
              <Lock className="w-4 h-4" />
              <span>Digital Personal Data Protection (DPDP) Compliant</span>
            </div>
          </div>

          {/* Quick Directory Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Verified Providers
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Cardiologists in Vijayawada & Hyderabad</li>
              <li>Pediatricians & Child Care Specialists</li>
              <li>Neurologists & Spine Specialists</li>
              <li>Orthopedic Surgeons & Joint Replacement</li>
              <li>Multispecialty Hospitals with 24x7 Cath Lab</li>
              <li>Live Digital OPD Queue Management</li>
            </ul>
          </div>

          {/* Compliance & Global Expansion */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Trust, Safety & Global Readiness
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Launch Phase 1: India (AP, Telangana, Karnataka)</li>
              <li>Phase 2: Pan-India State Medical Council Audits</li>
              <li>Phase 3: International Telehealth & Regulatory Adapters</li>
              <li>Atomic Double-Booking Prevention Engine</li>
              <li>Doctor Consultation Fee Independence (0% Commission)</li>
              <li>End-to-End Encrypted Patient Health Records</li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              National Emergency Helplines
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                <span className="font-medium text-slate-300">Ambulance Emergency</span>
                <span className="font-bold text-rose-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> 108
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                <span className="font-medium text-slate-300">All Emergencies (Police/Fire/Med)</span>
                <span className="font-bold text-rose-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> 112
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                <span className="font-medium text-slate-300">National Health Portal</span>
                <span className="font-bold text-sky-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> 1800-180-1104
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Universal Health Care AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Doctor Credential Verification Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
