"use client";

import React from 'react';
import { Check, X, Shield, Zap, Target } from 'lucide-react';

export const PricingTable = () => {
  const plans = [
    {
      name: "Bystander",
      price: "0",
      costComparison: "Biaya: Kebocoran Waktu Anda",
      icon: <Target className="text-gray-500" size={20} />,
      features: [
        "3 Audit Logika per Bulan",
        "Kalkulator Kerugian Dasar",
        "Diagnosis Teks Sederhana",
      ],
      notIncluded: [
        "Shadow Tracking (History)",
        "Deep AI Analysis",
        "Social Stakes Integration",
      ],
      cta: "Mulai Audit Gratis",
      featured: false
    },
    {
      name: "The Executioner",
      price: "250.000",
      costComparison: "Setara 0.5% dari Potensi Kerugian Anda",
      icon: <Zap className="text-red-500" size={20} />,
      features: [
        "Unlimited Audit Logika",
        "Shadow Tracking (Arsip Dosa)",
        "Deep Audit (Gemini 1.5 Pro)",
        "Daily 'Scolding' Notifications",
        "Export Laporan PDF (Audit Report)",
      ],
      notIncluded: [
        "AI War Room (Personal Roadmap)",
      ],
      cta: "Hentikan Kebocoran Sekarang",
      featured: true
    },
    {
      name: "War Room",
      price: "1.500.000",
      costComparison: "Investasi Penyelamatan Aset",
      icon: <Shield className="text-white" size={20} />,
      features: [
        "Semua Fitur Executioner",
        "AI War Room (30-Day Roadmap)",
        "Competitor Reality Leak",
        "Social Stakes (Lapor ke Mentor)",
        "Priority Support (24/7 Analysis)",
      ],
      notIncluded: [],
      cta: "Ambil Kendali Penuh",
      featured: false
    }
  ];

  return (
    <section className="bg-black py-24 px-4 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Berapa Harga <span className="text-red-600">Disiplin Anda?</span>
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto italic">
            "Lebih baik membayar sistem untuk memaksa Anda maju, daripada membayar penyesalan saat kesempatan Anda diambil orang lain."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-800 rounded-lg overflow-hidden">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`flex flex-col p-8 border-b md:border-b-0 md:border-r border-zinc-800 last:border-0 transition-all duration-500 ${plan.featured ? 'bg-zinc-900/30' : 'bg-black'}`}
            >
              <div className="flex items-center gap-2 mb-4">
                {plan.icon}
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{plan.name}</span>
              </div>

              <div className="mb-2">
                <span className="text-4xl font-black text-white italic">Rp {plan.price}</span>
                <span className="text-zinc-600 text-[10px] ml-1 uppercase">/Bulan</span>
              </div>
              
              <div className="text-[10px] text-red-500 font-bold uppercase mb-8 tracking-tighter">
                {plan.costComparison}
              </div>

              <div className="flex-grow space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-zinc-300">
                    <Check size={14} className="text-green-600 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-zinc-700">
                    <X size={14} className="mt-0.5" />
                    <span className="line-through">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm border ${
                plan.featured 
                ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)]' 
                : 'bg-transparent text-white border-zinc-700 hover:border-white hover:bg-white hover:text-black'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-[9px] text-zinc-700 uppercase tracking-widest leading-relaxed">
            Keamanan Data Terjamin // Transaksi Terenkripsi // Tidak Ada Pengembalian Dana Bagi Mereka Yang Tidak Eksekusi
          </p>
        </div>
      </div>
    </section>
  );
};