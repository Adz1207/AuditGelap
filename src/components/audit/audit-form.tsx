
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Play, Languages, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AuditFormProps {
  onSubmit: (formData: { 
    projectName: string, 
    estimatedValue: number, 
    sabotageType: string, 
    details: string, 
    lang: 'Indonesian' | 'English' 
  }) => void;
  isLoading: boolean;
}

const ONBOARDING_STEPS = [
  {
    id: 'project',
    title: 'Analisis Proyek',
    q: "Apa proyek yang sedang membusuk di folder draft-mu?",
    type: "text",
    placeholder: "Misal: SaaS Auditgelap, Kursus Online, Script Automasi..."
  },
  {
    id: 'value',
    title: 'Estimasi Kerugian',
    q: "Berapa harga yang pantas untuk waktu yang hilang tersebut?",
    type: "number",
    placeholder: "0"
  },
  {
    id: 'sabotage',
    title: 'Deteksi Sabotase',
    q: "Pilih jenis sabotase dirimu:",
    type: "choice",
    options: ["Perfeksionisme Lumpuh", "Kecanduan Rencana", "Ketakutan Dasar", "Kemalasan Sistemik"]
  },
  {
    id: 'details',
    title: 'Konteks Akhir',
    q: "Berikan detail situasi atau alasan penundaan Anda:",
    type: "textarea",
    placeholder: "Jelaskan mengapa Anda masih diam di tempat..."
  }
];

export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    projectName: '',
    estimatedValue: 0,
    sabotageType: 'Perfeksionisme Lumpuh',
    details: '',
    lang: 'Indonesian' as 'Indonesian' | 'English'
  });

  const progress = ((step + 1) / ONBOARDING_STEPS.length) * 100;
  const currentStep = ONBOARDING_STEPS[step];

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const isNextDisabled = () => {
    if (currentStep.id === 'project') return formData.projectName.trim().length < 3;
    if (currentStep.id === 'value') return formData.estimatedValue <= 0;
    if (currentStep.id === 'details') return formData.details.trim().length < 15;
    return false;
  };

  return (
    <Card className="border-white/5 bg-white/[0.02] overflow-hidden max-w-xl mx-auto">
      <CardContent className="p-0">
        <div className="p-6 space-y-8 min-h-[400px] flex flex-col justify-between">
          
          {/* Progress & Header */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-primary animate-pulse" />
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-[0.2em]">
                  {currentStep.title} // Step {step + 1} of {ONBOARDING_STEPS.length}
                </span>
              </div>
              <Select 
                value={formData.lang} 
                onValueChange={(v) => setFormData({ ...formData, lang: v as any })}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[120px] h-6 bg-black/50 border-white/5 text-[9px] font-mono uppercase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10">
                  <SelectItem value="Indonesian">Indonesia</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Progress value={progress} className="h-1 bg-white/5" />
          </div>

          {/* Question Area */}
          <div className="flex-grow flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
                  {currentStep.q}
                </h3>

                {currentStep.type === 'text' && (
                  <Input 
                    autoFocus
                    placeholder={currentStep.placeholder}
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="bg-black border-zinc-800 focus:border-primary h-12 text-sm font-mono"
                  />
                )}

                {currentStep.type === 'number' && (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">Rp</span>
                    <Input 
                      type="number"
                      autoFocus
                      placeholder={currentStep.placeholder}
                      value={formData.estimatedValue || ''}
                      onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                      className="bg-black border-zinc-800 focus:border-primary h-12 pl-12 text-sm font-mono"
                    />
                  </div>
                )}

                {currentStep.type === 'choice' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentStep.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setFormData({ ...formData, sabotageType: opt })}
                        className={`p-4 border text-[10px] uppercase tracking-widest font-bold transition-all text-left rounded ${
                          formData.sabotageType === opt 
                            ? 'bg-primary/20 border-primary text-primary' 
                            : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-600'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {currentStep.type === 'textarea' && (
                  <Textarea 
                    autoFocus
                    placeholder={currentStep.placeholder}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="bg-black border-zinc-800 focus:border-primary min-h-[150px] text-sm font-mono resize-none"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-white/5">
            <button 
              onClick={handleBack}
              disabled={step === 0 || isLoading}
              className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-600 hover:text-white disabled:opacity-0 transition-all"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <Button 
              onClick={handleNext}
              disabled={isLoading || isNextDisabled()}
              className="bg-white text-black hover:bg-primary hover:text-white font-bold px-8 group uppercase text-[10px] tracking-widest h-12"
            >
              {step === ONBOARDING_STEPS.length - 1 ? 'EXECUTE_AUDIT' : 'Next Protocol'}
              {step === ONBOARDING_STEPS.length - 1 ? <Play className="ml-2 w-3 h-3 fill-current" /> : <ArrowRight className="ml-2 w-3 h-3" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
