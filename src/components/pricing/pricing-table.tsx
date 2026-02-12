
"use client"

import React, { useState } from 'react';
import { Check, X, Shield, Zap, Target, Loader2, ShieldAlert } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { createPaymentTransaction } from '@/app/actions/payment';
import { doc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    snap: any;
  }
}

export const PricingTable = () => {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "bystander",
      name: "Bystander",
      price: 0,
      displayPrice: "0",
      costComparison: "Biaya: Kebocoran Waktu Anda",
      icon: <Target className="text-gray-500" size={20} />,
      features: [
        "3 Audit Logika per Bulan",
        "Kalkulator Kerugian Dasar",
        "Diagnosis Teks Sederhana",
      ],
      notIncluded: [
        "Shadow Tracking (Arsip Dosa)",
        "Deep AI Analysis",
        "Execution Verifier Protocol",
      ],
      cta: "Mulai Audit Gratis",
      featured: false
    },
    {
      id: "executioner",
      name: "The Executioner",
      price: 250000,
      displayPrice: "250.000",
      costComparison: "Setara 0.5% dari Potensi Kerugian Anda",
      icon: <Zap className="text-primary" size={20} />,
      features: [
        "Unlimited Audit Logika",
        "Shadow Tracking (Arsip Dosa)",
        "Deep Audit Analysis (Gemini Flash)",
        "Execution Verifier (Proof of Work)",
        "Daily 'Scolding' Alerts",
      ],
      notIncluded: [
        "AI War Room (30-Day Roadmap)",
      ],
      cta: "Tebus Dosa Sekarang",
      featured: true
    },
    {
      id: "war_room",
      name: "War Room",
      price: 1500000,
      displayPrice: "1.500.000",
      costComparison: "Investasi Penyelamatan Aset",
      icon: <Shield className="text-white" size={20} />,
      features: [
        "Semua Fitur Executioner",
        "AI War Room (Personal Roadmap)",
        "Weekly Roast Intelligence",
        "Social Stakes Integration",
        "Priority Support (24/7 Analysis)",
      ],
      notIncluded: [],
      cta: "Ambil Kendali Penuh",
      featured: false
    }
  ];

  const handlePaymentResult = async (result: any, status: 'success' | 'pending' | 'error', planId: string) => {
    if (!user || !firestore) return;

    if (status === 'success') {
      const userRef = doc(firestore, 'users', user.uid);
      const updateData = {
        role: planId,
        isPremium: true,
        'subscription.planId': planId,
        'subscription.status': 'active',
        'subscription.currentPeriodEnd': Date.now() + (30 * 24 * 60 * 60 * 1000),
        'subscription.midtransOrderId': result.order_id
      };

      try {
        await updateDoc(userRef, updateData);
        window.location.href = `/audit/success?order_id=${result.order_id}`;
      } catch (e) {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: updateData
        }));
      }
    } else if (status === 'pending') {
      toast({ 
        title: "MENUNGGU EKSEKUSI", 
        description: "Status pembayaran menunggu. Jangan tunda pengerjaan tugas hanya karena ini." 
      });
      setLoadingPlan(null);
    } else if (status === 'error') {
      window.location.href = '/audit/failure';
    }
  };

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.price === 0) {
      router.push('/audit');
      return;
    }

    if (!user || !firestore) {
      toast({
        title: "IDENTITAS DIPERLUKAN",
        description: "Anda tidak bisa menebus dosa secara anonim. Silakan login atau daftar.",
        variant: "destructive"
      });
      return;
    }

    setLoadingPlan(plan.id);

    try {
      const { token } = await createPaymentTransaction({
        user: {
          id: user.uid,
          name: user.displayName || 'User Auditgelap',
          email: user.email || ''
        },
        plan: {
          id: plan.id,
          name: plan.name,
          price: plan.price
        }
      });

      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: (result: any) => handlePaymentResult(result, 'success', plan.id),
          onPending: (result: any) => handlePaymentResult(result, 'pending', plan.id),
          onError: (result: any) => {
            console.error("Payment Failed", result);
            window.location.href = '/audit/failure';
          },
          onClose: () => {
            setLoadingPlan(null);
            alert("Anda menutup jendela pembayaran. Melarikan diri tidak akan menghentikan counter kerugian.");
          }
        });
      }
    } catch (error) {
      toast({
        title: "KESALAHAN SISTEM",
        description: "Gagal memproses inisialisasi pembayaran. Hubungi administrator protokol.",
        variant: "destructive"
      });
      setLoadingPlan(null);
    }
  };

  return (
    <section className="bg-black py-24 px-4 font-mono border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary mb-4 border border-primary/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold">
            <ShieldAlert size={14} />
            Protokol Penebusan Dosa
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Berapa Harga <span className="text-primary italic">Disiplin Anda?</span>
          </h2>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto italic leading-relaxed">
            "Lebih baik membayar sistem untuk memaksa Anda maju, daripada membayar penyesalan saat kesempatan Anda diambil orang lain."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`flex flex-col p-8 border-b md:border-b-0 md:border-r border-zinc-800 last:border-0 transition-all duration-500 ${plan.featured ? 'bg-zinc-900/30 ring-1 ring-primary/20 relative z-10' : 'bg-black'}`}
            >
              {plan.featured && (
                <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(139,0,0,0.5)]" />
              )}
              
              <div className="flex items-center gap-2 mb-4">
                {plan.icon}
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{plan.name}</span>
              </div>

              <div className="mb-2">
                <span className="text-4xl font-black text-white italic">Rp {plan.displayPrice}</span>
                <span className="text-zinc-600 text-[10px] ml-1 uppercase">/30 Hari</span>
              </div>
              
              <div className="text-[10px] text-primary font-bold uppercase mb-8 tracking-tighter">
                {plan.costComparison}
              </div>

              <div className="flex-grow space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-[11px] text-zinc-300">
                    <Check size={14} className="text-accent mt-0.5 shrink-0" />
                    <span className="leading-tight">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-[11px] text-zinc-700">
                    <X size={14} className="mt-0.5 shrink-0" />
                    <span className="line-through leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSubscribe(plan)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm border flex items-center justify-center gap-2 ${
                  plan.featured 
                  ? 'bg-primary text-white border-primary hover:bg-white hover:text-black hover:border-white shadow-[0_0_20px_-5px_rgba(139,0,0,0.5)]' 
                  : 'bg-transparent text-white border-zinc-700 hover:border-white hover:bg-white hover:text-black'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loadingPlan === plan.id ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-[9px] text-zinc-700 uppercase tracking-[0.3em] leading-relaxed">
            Keamanan Data Terjamin // Transaksi Terenkripsi // Tidak Ada Refund Bagi Mereka Yang Malas
          </p>
        </div>
      </div>
    </section>
  );
};
