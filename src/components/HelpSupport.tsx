import { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Terminal, FileCode2, ExternalLink, Settings, Check, HelpCircle, Code } from 'lucide-react';

export default function HelpSupport() {
  const [copiedQuery, setCopiedQuery] = useState(false);

  const sampleSqlQuery = `
-- Create table for Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    account_tier VARCHAR(20) DEFAULT 'personal',
    balance DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample BL offers matches the screenshot
INSERT INTO offers (operator, title, validity, price_personal, price_business, price_sub_admin, category) VALUES
('banglalink', '150 জিবি + ১৮০০ মি:', '৩০ দিন', 1035.00, 1020.00, 1003.00, 'combo'),
('banglalink', '৮০ জিবি + ১৬০০ মিনিট', '৩০ দিন', 945.00, 930.00, 913.00, 'combo');
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleSqlQuery.trim());
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-slate-700">
      
      {/* DB setup details card */}
      <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-md space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-purple-50">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Database size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Neon & Postgres Setup Guide</h3>
            <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">For Vercel & Next.js Production</p>
          </div>
        </div>

        <div className="space-y-4 text-xs leading-relaxed">
          <p>
            আপনাকে রিয়েল প্রোডাকশনে ডাটাবেজ সহ লাইভ করার জন্য প্রজেক্ট রুট ফোল্ডারে একটি <strong className="text-purple-700 font-black">neon-schema.sql</strong> ফাইল তৈরি করে দেওয়া হয়েছে। সেটি ওপেন করে কপি করে আপনার Neon ডাটাবেজ কনসোলে রান দিন।
          </p>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 font-semibold">
            <div className="flex items-center gap-2 text-slate-800">
              <Code size={16} className="text-pink-500" />
              <span>Vercel + Next.js ডিপ্লয়মেন্ট গাইড:</span>
            </div>
            
            <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1">
              <li>
                <strong className="text-slate-800">Neon একাউন্ট তৈরি:</strong> <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-pink-500 underline inline-flex items-center gap-0.5">Neon.tech <ExternalLink size={10} /></a> এ গিয়ে একটি ডাটাবেজ প্রজেক্ট ওপেন করুন।
              </li>
              <li>
                <strong className="text-slate-800">ডাটাবেজ কানেকশন লিংক:</strong> পেয়ে যাওয়া Postgres Connection URL-টি প্রজেক্টের <code className="bg-purple-50 text-purple-600 px-1 rounded">DATABASE_URL</code> হিসেবে Vercel এনভায়রনমেন্টে অ্যাড করবেন।
              </li>
              <li>
                <strong className="text-slate-800">স্কিমা রান দিন:</strong> পেয়ে যাওয়া <code className="bg-purple-50 text-purple-600 px-1 rounded">neon-schema.sql</code> ফাইলটির কোড কপি করে Neon SQl Editor-এ রান দিন।
              </li>
              <li>
                <strong className="text-slate-800">API কানেকশন:</strong> Next.js-এর <code className="bg-purple-50 text-purple-600 px-1 rounded">/app/api/...</code> রাউটে <code className="bg-amber-100 text-amber-800 px-1 rounded">@neondatabase/serverless</code> অথবা <code className="bg-pink-100 text-pink-800 px-1 rounded">pg</code> মডিউল ইন্সটল করে কুয়েরি করলেই সরাসরি ডাটা স্টোর হবে।
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Interactive SQL terminal code snippet card */}
      <div className="bg-[#1e1e24] text-slate-300 rounded-3xl p-5 shadow-xl space-y-4 font-mono text-xs relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleCopy}
            className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white flex items-center gap-1.5 transition-all active:scale-95 border border-white/10 font-sans font-bold"
          >
            {copiedQuery ? <Check size={12} className="text-emerald-400" /> : <FileCode2 size={12} />}
            {copiedQuery ? 'কপি হয়েছে!' : 'স্কিমা কপি করুন'}
          </button>
        </div>

        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-3 font-sans font-bold">
          <Terminal size={16} className="text-[#00ffd2]" />
          <span>neon-schema.sql Preview</span>
        </div>

        <pre className="overflow-x-auto max-h-56 select-all scrollbar-thin text-slate-300">
          {sampleSqlQuery}
        </pre>
      </div>

      {/* Developer FAQ list */}
      <div className="bg-white rounded-3xl p-6 border border-purple-50 shadow-md space-y-4">
        <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
          <HelpCircle size={16} className="text-pink-500" />
          ঘন ঘন জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
        </h4>

        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <div className="p-3 bg-purple-50/40 rounded-2xl space-y-1">
            <p className="font-bold text-purple-900">প্রশ্ন: পার্সোনাল, বিজনেস ও সাব এডমিন অ্যাকাউন্টের সুবিধা কীভাবে অ্যাড করা হয়েছে?</p>
            <p>উত্তর: প্রতিটি অফারের ক্ষেত্রে ক্যাশব্যাক বা পিন ডিসকাউন্ট সুবিধা রয়েছে। পার্সোনাল অ্যাকাউন্টের জন্য বেস প্রাইস প্রযোজ্য, যেখানে বিজনেস পেজে ১৫ টাকা ডিসকাউন্ট এবং সাব এডমিনের জন্য প্রতিটি প্যাক থেকে ৩২ টাকা পর্যন্ত কম নেওয়া হচ্ছে।</p>
          </div>

          <div className="p-3 bg-pink-50/40 rounded-2xl space-y-1">
            <p className="font-bold text-pink-900">প্রশ্ন: এটি কি রিয়েল অ্যান্ড্রয়েড বা আইওএস ডিভাইসে রান করবে?</p>
            <p>উত্তর: হ্যাঁ, এটি একটি প্রগ্রেসিভ ওয়েব অ্যাপ (PWA) এবং মেমোরি স্টেট আর্কিটেকচার সম্পন্ন লাইটওয়েট রিয়্যাক্ট অ্যাপ্লিকেশন। এটিকে অ্যান্ড্রয়েড বা আইওএসের WebView ব্যবহার করে সহজেই অ্যাপলেট হিসেবে প্যাকেজ করা যাবে।</p>
          </div>
        </div>
      </div>
    </div>
  );
}
