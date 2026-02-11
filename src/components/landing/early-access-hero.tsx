
"use client";

import React, { useState } from 'react';
import { Lock, Send, ShieldAlert, Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function EarlyAccessHero() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firestore) return;
    
    setIsLoading(true);
    
    const waitlistData = { 
      email: email.toLowerCase(), 
      timestamp: Date.now() 
    };

    const waitlistRef = collection(firestore, 'waitlist');
    
    addDoc(waitlistRef, waitlistData)
      .then(() => {
        setSubmitted(true);
      })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: waitlistRef.path,
          operation: 'create',
          requestResourceData: waitlistData
        }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section className="bg-black text-white min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 border-y border-zinc-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* Badge Status */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/50 bg-primary/10 rounded-full mb-8">
          <Lock size={12} className="text-primary animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
            Sistem Dalam Sinkronisasi Akhir
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-tight">
          Pintu Audit <span className="text-zinc-600 italic underline decoration-primary">Tertutup</span> Untuk Sementara.
        </h2>

        {!submitted ? (
          <>
            <p className="text-zinc-500 text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
              Kami membatasi akses hanya untuk mereka yang berani menghadapi angka kerugian riil. 
              Daftarkan email Anda untuk mendapatkan prioritas saat slot **"The Executioner"** dibuka kembali.
            </p>

            <form onSubmit={handleApply} className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                required
                disabled={isLoading}
                placeholder="EMAIL_ANDA@DOMAIN.COM" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-zinc-900 border border-zinc-800 p-4 text-xs font-mono focus:outline-none focus:border-primary transition-all uppercase tracking-widest disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-white text-black font-black px-8 py-4 text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={14} /> : <>REQUEST ACCESS <Send size={14} /></>}
              </button>
            </form>
            <p className="mt-4 text-[9px] text-zinc-700 uppercase tracking-widest">
              Limited to 50 slots per batch. No exceptions.
            </p>
          </>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-lg animate-in fade-in zoom-in duration-500">
            <ShieldAlert size={40} className="mx-auto text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2 uppercase">Email Terarsip.</h3>
            <p className="text-zinc-500 text-xs leading-relaxed italic">
              "Kami akan mengirimkan sinyal segera setelah slot eksekusi tersedia. 
              Siapkan mental Anda. Waktu penundaan Anda terus dihitung."
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
