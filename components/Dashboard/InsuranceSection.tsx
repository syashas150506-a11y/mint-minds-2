import React, { useState } from 'react';
import { 
  Heart, 
  Shield, 
  Car, 
  Umbrella, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  ArrowLeftRight, 
  Info, 
  Star,
  Check
} from 'lucide-react';

type InsuranceType = 'health' | 'term' | 'vehicle' | 'life';

interface InsurancePlan {
  id: string;
  provider: string;
  planName: string;
  cover: string;
  premium: string;
  csr: string; // Claim Settlement Ratio
  features: string[];
  link: string;
  rating: number;
}

interface InsuranceCategory {
  id: InsuranceType;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  info: {
    what: string;
    benefits: string[];
  };
  plans: InsurancePlan[];
}

const INSURANCE_DATA: InsuranceCategory[] = [
  {
    id: 'health',
    title: 'Health Insurance',
    desc: 'Cover medical expenses, hospitalization, and critical illnesses.',
    icon: <Heart size={32} />,
    color: 'bg-rose-50 text-rose-600 border-rose-100',
    info: {
      what: "Health insurance is a type of insurance coverage that pays for medical, surgical, and sometimes dental expenses incurred by the insured. It protects you from unexpected, high medical costs.",
      benefits: [
        "Cashless Hospitalization in Network Hospitals",
        "Pre and Post Hospitalization Expenses",
        "Tax Benefits under Section 80D",
        "No Claim Bonus (NCB) for healthy years"
      ]
    },
    plans: [
      { id: 'h1', provider: 'HDFC ERGO', planName: 'Optima Restore', cover: '₹5 - 50 Lakhs', premium: '₹8,500/yr', csr: '98.5%', features: ['100% Restore Benefit', '2x Multiplier Benefit'], link: 'https://www.hdfcergo.com', rating: 4.8 },
      { id: 'h2', provider: 'Star Health', planName: 'Comprehensive Policy', cover: '₹5 Lakhs - 1 Cr', premium: '₹12,000/yr', csr: '99.1%', features: ['Maternity Cover', 'Free Health Checkup'], link: 'https://www.starhealth.in', rating: 4.7 },
      { id: 'h3', provider: 'Niva Bupa', planName: 'ReAssure 2.0', cover: '₹5 Lakhs - 1 Cr', premium: '₹9,200/yr', csr: '97.8%', features: ['Unlimited Reinstatement', 'Lock the Clock Age'], link: 'https://www.nivabupa.com', rating: 4.6 },
      { id: 'h4', provider: 'Care Health', planName: 'Care Supreme', cover: '₹7 Lakhs - 1 Cr', premium: '₹10,500/yr', csr: '95.2%', features: ['Unlimited Automatic Recharge', 'No Claim Bonus Super'], link: 'https://www.careinsurance.com', rating: 4.5 },
      { id: 'h5', provider: 'ICICI Lombard', planName: 'Health AdvantEdge', cover: '₹10 Lakhs', premium: '₹9,800/yr', csr: '97.9%', features: ['Global Cover', 'Air Ambulance'], link: 'https://www.icicilombard.com', rating: 4.7 },
      { id: 'h6', provider: 'Bajaj Allianz', planName: 'Health Guard', cover: '₹5 - 50 Lakhs', premium: '₹8,900/yr', csr: '98.0%', features: ['Convalescence Benefit', 'Daily Cash'], link: 'https://www.bajajallianz.com', rating: 4.6 },
      { id: 'h7', provider: 'Tata AIG', planName: 'Medicare', cover: '₹5 Lakhs', premium: '₹7,500/yr', csr: '96.8%', features: ['Consumables Cover', 'Restoration Benefit'], link: 'https://www.tataaig.com', rating: 4.5 },
      { id: 'h8', provider: 'SBI General', planName: 'Arogya Supreme', cover: '₹5 Lakhs', premium: '₹8,200/yr', csr: '95.5%', features: ['No Room Rent Limit', 'Recovery Benefit'], link: 'https://www.sbigeneral.in', rating: 4.4 },
      { id: 'h9', provider: 'Aditya Birla', planName: 'Activ Health Platinum', cover: '₹10 Lakhs', premium: '₹11,000/yr', csr: '96.2%', features: ['Chronic Management', 'Health Returns'], link: 'https://www.adityabirlacapital.com', rating: 4.5 },
      { id: 'h10', provider: 'ManipalCigna', planName: 'ProHealth', cover: '₹5 Lakhs', premium: '₹9,000/yr', csr: '94.8%', features: ['Worldwide Emergency', 'Health Rewards'], link: 'https://www.manipalcigna.com', rating: 4.3 },
      { id: 'h11', provider: 'Reliance General', planName: 'Health Infinity', cover: '₹5 Lakhs', premium: '₹7,800/yr', csr: '98.6%', features: ['More Global Cover', 'More Time'], link: 'https://www.reliancegeneral.co.in', rating: 4.4 },
      { id: 'h12', provider: 'United India', planName: 'Family Medicare', cover: '₹10 Lakhs', premium: '₹12,500/yr', csr: '92.1%', features: ['Govt Backed', 'Affordable'], link: 'https://uiic.co.in', rating: 4.0 },
      { id: 'h13', provider: 'New India', planName: 'Mediclaim Policy', cover: '₹5 Lakhs', premium: '₹6,500/yr', csr: '93.5%', features: ['Trusted Brand', 'Ayush Cover'], link: 'https://www.newindia.co.in', rating: 4.2 },
      { id: 'h14', provider: 'Oriental Insurance', planName: 'Happy Family Float', cover: '₹10 Lakhs', premium: '₹11,800/yr', csr: '91.8%', features: ['Family Floater', 'Discounts'], link: 'https://orientalinsurance.org.in', rating: 4.1 }
    ]
  },
  {
    id: 'term',
    title: 'Term Life Insurance',
    desc: 'Pure protection plans providing high cover at low premiums.',
    icon: <Shield size={32} />,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    info: {
      what: "Term insurance is a life insurance product which provides financial coverage to the policyholder for a specific time period. If the insured passes away during the policy tenure, the death benefit is paid to the nominee.",
      benefits: [
        "High Life Cover at affordable premiums",
        "Financial security for dependents",
        "Tax Benefits under Section 80C",
        "Optional riders like Accidental Death Benefit"
      ]
    },
    plans: [
      { id: 't1', provider: 'LIC', planName: 'Jeevan Amar', cover: '₹1 Crore', premium: '₹15,000/yr', csr: '98.6%', features: ['Govt Backed', 'Flexible Premium Payment'], link: 'https://licindia.in', rating: 4.9 },
      { id: 't2', provider: 'ICICI Pru', planName: 'iProtect Smart', cover: '₹1 Crore', premium: '₹11,500/yr', csr: '97.8%', features: ['Critical Illness Cover', 'Terminal Illness Benefit'], link: 'https://www.iciciprulife.com', rating: 4.7 },
      { id: 't3', provider: 'Max Life', planName: 'Smart Secure Plus', cover: '₹1 Crore', premium: '₹10,800/yr', csr: '99.3%', features: ['Return of Premium Option', 'Joint Life Cover'], link: 'https://www.maxlifeinsurance.com', rating: 4.8 },
      { id: 't4', provider: 'HDFC Life', planName: 'Click 2 Protect Super', cover: '₹1 Crore', premium: '₹12,000/yr', csr: '99.0%', features: ['Life Stage Option', 'Smart Exit Benefit'], link: 'https://www.hdfclife.com', rating: 4.8 },
      { id: 't5', provider: 'Tata AIA', planName: 'Sampoorna Raksha', cover: '₹1 Crore', premium: '₹11,200/yr', csr: '99.0%', features: ['Whole Life Cover', 'Return of Premium'], link: 'https://www.tataaia.com', rating: 4.7 },
      { id: 't6', provider: 'SBI Life', planName: 'eShield Next', cover: '₹1 Crore', premium: '₹13,500/yr', csr: '97.5%', features: ['Increasing Cover', 'Better Half Benefit'], link: 'https://www.sbilife.co.in', rating: 4.6 },
      { id: 't7', provider: 'Bajaj Allianz', planName: 'Smart Protect Goal', cover: '₹1 Crore', premium: '₹10,500/yr', csr: '98.0%', features: ['Child Education Benefit', 'Add-on Covers'], link: 'https://www.bajajallianzlife.com', rating: 4.5 },
      { id: 't8', provider: 'Kotak Life', planName: 'e-Term Plan', cover: '₹1 Crore', premium: '₹9,800/yr', csr: '98.2%', features: ['Low Cost', 'Step Up Option'], link: 'https://www.kotaklife.com', rating: 4.6 },
      { id: 't9', provider: 'Aditya Birla', planName: 'DigiShield Plan', cover: '₹1 Crore', premium: '₹11,800/yr', csr: '97.2%', features: ['Survival Benefit', 'Multiple Payout Options'], link: 'https://lifeinsurance.adityabirlacapital.com', rating: 4.5 },
      { id: 't10', provider: 'PNB MetLife', planName: 'Mera Term Plan', cover: '₹1 Crore', premium: '₹10,200/yr', csr: '97.3%', features: ['Cover till 99', 'Joint Life'], link: 'https://www.pnbmetlife.com', rating: 4.4 },
      { id: 't11', provider: 'Canara HSBC', planName: 'iSelect Smart360', cover: '₹1 Crore', premium: '₹10,000/yr', csr: '98.1%', features: ['Block your Premium', 'Terminal Illness'], link: 'https://www.canarahsbclife.com', rating: 4.3 }
    ]
  },
  {
    id: 'vehicle',
    title: 'Vehicle Insurance',
    desc: 'Mandatory protection for your Car or Bike against damages.',
    icon: <Car size={32} />,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    info: {
      what: "Vehicle insurance (also known as car insurance, motor insurance, or auto insurance) is insurance for cars, trucks, motorcycles, and other road vehicles. It provides financial protection against physical damage or bodily injury resulting from traffic collisions and against liability that could also arise from incidents in a vehicle.",
      benefits: [
        "Mandatory by Law (Third-Party)",
        "Own Damage Cover (Accidents, Theft, Fire)",
        "Personal Accident Cover",
        "Add-ons like Zero Depreciation, Roadside Assistance"
      ]
    },
    plans: [
      { id: 'v1', provider: 'Acko', planName: 'Comprehensive Car', cover: 'IDV Based', premium: '₹3,500/yr', csr: '96.5%', features: ['Zero Commission', 'Instant Claims'], link: 'https://www.acko.com', rating: 4.6 },
      { id: 'v2', provider: 'Digit', planName: 'Smart Drive', cover: 'IDV Based', premium: '₹3,800/yr', csr: '97.0%', features: ['Paperless Claims', 'Smartphone Enabled'], link: 'https://www.godigit.com', rating: 4.7 },
      { id: 'v3', provider: 'ICICI Lombard', planName: 'Motor Protect', cover: 'IDV Based', premium: '₹4,200/yr', csr: '98.2%', features: ['Garage Cash', '24x7 Assistance'], link: 'https://www.icicilombard.com', rating: 4.8 },
      { id: 'v4', provider: 'HDFC ERGO', planName: 'Motor Insurance', cover: 'IDV Based', premium: '₹4,000/yr', csr: '99.0%', features: ['Overnight Repairs', 'Doorstep Service'], link: 'https://www.hdfcergo.com', rating: 4.8 },
      { id: 'v5', provider: 'Bajaj Allianz', planName: 'Car Shield', cover: 'IDV Based', premium: '₹3,900/yr', csr: '98.5%', features: ['Drive Smart', 'Transfer NCB'], link: 'https://www.bajajallianz.com', rating: 4.6 },
      { id: 'v6', provider: 'Tata AIG', planName: 'Auto Secure', cover: 'IDV Based', premium: '₹4,100/yr', csr: '97.5%', features: ['12 Warranty', 'Engine Protect'], link: 'https://www.tataaig.com', rating: 4.7 },
      { id: 'v7', provider: 'Reliance General', planName: 'Car Insurance', cover: 'IDV Based', premium: '₹3,600/yr', csr: '98.0%', features: ['Video Claims', 'Instant Renewal'], link: 'https://www.reliancegeneral.co.in', rating: 4.5 },
      { id: 'v8', provider: 'SBI General', planName: 'Private Car', cover: 'IDV Based', premium: '₹4,300/yr', csr: '95.0%', features: ['Trust', 'Wide Network'], link: 'https://www.sbigeneral.in', rating: 4.4 },
      { id: 'v9', provider: 'New India', planName: 'Motor Policy', cover: 'IDV Based', premium: '₹4,500/yr', csr: '92.5%', features: ['Public Sector', 'Low Rates'], link: 'https://www.newindia.co.in', rating: 4.1 },
      { id: 'v10', provider: 'United India', planName: 'Motor Package', cover: 'IDV Based', premium: '₹4,400/yr', csr: '91.0%', features: ['Govt Backed', 'Simple Process'], link: 'https://uiic.co.in', rating: 4.0 },
      { id: 'v11', provider: 'Cholamandalam', planName: 'Car Protect', cover: 'IDV Based', premium: '₹3,750/yr', csr: '94.0%', features: ['QR Code Claims', 'Minimal Docs'], link: 'https://www.cholainsurance.com', rating: 4.3 },
      { id: 'v12', provider: 'Kotak General', planName: 'Car Secure', cover: 'IDV Based', premium: '₹3,850/yr', csr: '96.0%', features: ['Kotak Meter', 'Pay As You Drive'], link: 'https://www.kotakgeneral.com', rating: 4.5 },
      { id: 'v13', provider: 'Shriram General', planName: 'Car Insurance', cover: 'IDV Based', premium: '₹3,400/yr', csr: '93.0%', features: ['Value for Money', 'Easy Buy'], link: 'https://www.shriramgi.com', rating: 4.2 }
    ]
  },
  {
    id: 'life',
    title: 'Life/Endowment Plans',
    desc: 'Insurance cum Investment plans for long term goals.',
    icon: <Umbrella size={32} />,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    info: {
      what: "Life insurance or Endowment plans are policies that offer a combination of insurance coverage and savings. They pay out a lump sum amount after a specific term (on maturity) or on death.",
      benefits: [
        "Guaranteed Returns on Maturity",
        "Life Cover for the entire term",
        "Loan facility against policy",
        "Bonus additions (for participating plans)"
      ]
    },
    plans: [
      { id: 'l1', provider: 'HDFC Life', planName: 'Sanchay Plus', cover: 'Life Cover', premium: '₹1 Lakh/yr', csr: '99.0%', features: ['Guaranteed Income', 'Long Term Income Option'], link: 'https://www.hdfclife.com', rating: 4.8 },
      { id: 'l2', provider: 'Tata AIA', planName: 'Fortune Guarantee', cover: 'Life Cover', premium: '₹50,000/yr', csr: '98.5%', features: ['Higher Returns', 'Flexible Terms'], link: 'https://www.tataaia.com', rating: 4.7 },
      { id: 'l3', provider: 'LIC', planName: 'Jeevan Umang', cover: 'Life Cover + Pension', premium: '₹60,000/yr', csr: '98.6%', features: ['Whole Life', 'Yearly Survival Benefit'], link: 'https://licindia.in', rating: 4.9 },
      { id: 'l4', provider: 'LIC', planName: 'New Endowment', cover: 'Sum Assured', premium: '₹25,000/yr', csr: '98.6%', features: ['Participation in Profits', 'Liquidity'], link: 'https://licindia.in', rating: 4.8 },
      { id: 'l5', provider: 'ICICI Pru', planName: 'Gift Pro', cover: 'Life Cover', premium: '₹75,000/yr', csr: '97.8%', features: ['Level Income', 'Increasing Income'], link: 'https://www.iciciprulife.com', rating: 4.6 },
      { id: 'l6', provider: 'SBI Life', planName: 'Smart Platina', cover: 'Life Cover', premium: '₹1 Lakh/yr', csr: '97.5%', features: ['Guaranteed Additions', 'Tax Free Returns'], link: 'https://www.sbilife.co.in', rating: 4.7 },
      { id: 'l7', provider: 'Bajaj Allianz', planName: 'Guaranteed Income', cover: 'Life Cover', premium: '₹80,000/yr', csr: '98.0%', features: ['Regular Income', 'Lump Sum'], link: 'https://www.bajajallianzlife.com', rating: 4.5 },
      { id: 'l8', provider: 'Max Life', planName: 'Savings Advantage', cover: 'Life Cover', premium: '₹50,000/yr', csr: '99.3%', features: ['Flexibility', 'Bonus Payouts'], link: 'https://www.maxlifeinsurance.com', rating: 4.7 },
      { id: 'l9', provider: 'Kotak Life', planName: 'Guaranteed Fortune', cover: 'Life Cover', premium: '₹90,000/yr', csr: '98.2%', features: ['Short Pay', 'Long Returns'], link: 'https://www.kotaklife.com', rating: 4.5 },
      { id: 'l10', provider: 'PNB MetLife', planName: 'Guaranteed Income', cover: 'Life Cover', premium: '₹60,000/yr', csr: '97.3%', features: ['Family Protection', 'Wealth Creation'], link: 'https://www.pnbmetlife.com', rating: 4.4 },
      { id: 'l11', provider: 'IndiaFirst', planName: 'Guaranteed Benefit', cover: 'Life Cover', premium: '₹40,000/yr', csr: '96.0%', features: ['High IRR', 'Flexibility'], link: 'https://www.indiafirstlife.com', rating: 4.3 }
    ]
  }
];

export const InsuranceSection: React.FC = () => {
  const [selectedType, setSelectedType] = useState<InsuranceType | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(prev => prev.filter(item => item !== id));
    } else {
      if (compareList.length < 3) {
        setCompareList(prev => [...prev, id]);
      } else {
        alert("You can compare up to 3 plans at a time.");
      }
    }
  };

  const handleApply = (link: string) => {
    // In a real app, this might track the click analytics
    window.open(link, '_blank');
  };

  const currentCategory = INSURANCE_DATA.find(c => c.id === selectedType);

  // --- Render Views ---

  const renderGrid = () => (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-10 pb-10">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-4 flex items-center justify-center gap-3">
          <div className="p-3 bg-rose-100 rounded-2xl text-rose-600 shadow-sm"><Shield size={32} /></div>
          Insurance Hub
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Explore, compare, and secure your future with the best insurance plans tailored for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
        {INSURANCE_DATA.map((item) => (
          <button
            key={item.id}
            onClick={() => { setSelectedType(item.id); setCompareList([]); setShowComparison(false); }}
            className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-[100px] transition-transform group-hover:scale-110 ${item.color.split(' ')[0]}`} />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl transition-colors ${item.color} group-hover:bg-opacity-100 bg-opacity-50`}>
                {item.icon}
              </div>
              <div className="bg-slate-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={20} className="text-slate-400" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-rose-600 transition-colors">{item.title}</h3>
            <p className="text-slate-500 font-medium">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderComparison = () => {
    if (!currentCategory) return null;
    const plansToCompare = currentCategory.plans.filter(p => compareList.includes(p.id));

    return (
      <div className="max-w-6xl mx-auto animate-fade-in-up pb-10">
        <button onClick={() => setShowComparison(false)} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold">
            <ArrowRight className="rotate-180" size={20} /> Back to Plans
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                <ArrowLeftRight className="text-indigo-600" />
                <h3 className="font-bold text-xl text-slate-800">Plan Comparison</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-wider w-1/4 bg-white border-b border-r border-slate-100">Feature</th>
                            {plansToCompare.map(plan => (
                                <th key={plan.id} className="p-6 bg-white border-b border-slate-100 min-w-[200px]">
                                    <div className="font-bold text-xl text-slate-800 mb-1">{plan.provider}</div>
                                    <div className="text-sm text-slate-500 font-medium">{plan.planName}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="p-6 font-bold text-slate-600 border-r border-slate-100">Premium</td>
                            {plansToCompare.map(plan => (
                                <td key={plan.id} className="p-6 font-bold text-emerald-600 text-lg">{plan.premium}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 font-bold text-slate-600 border-r border-slate-100">Cover Amount</td>
                            {plansToCompare.map(plan => (
                                <td key={plan.id} className="p-6 text-slate-700 font-medium">{plan.cover}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 font-bold text-slate-600 border-r border-slate-100">CSR (Claim Ratio)</td>
                            {plansToCompare.map(plan => (
                                <td key={plan.id} className="p-6 text-slate-700">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-bold text-sm">{plan.csr}</span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 font-bold text-slate-600 border-r border-slate-100">Key Features</td>
                            {plansToCompare.map(plan => (
                                <td key={plan.id} className="p-6">
                                    <ul className="space-y-2">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 border-r border-slate-100"></td>
                            {plansToCompare.map(plan => (
                                <td key={plan.id} className="p-6">
                                    <button 
                                        onClick={() => handleApply(plan.link)}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        Apply Now <ExternalLink size={16} />
                                    </button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    if (!currentCategory) return null;

    return (
      <div className="max-w-6xl mx-auto animate-fade-in-up space-y-8 pb-10">
        <button onClick={() => setSelectedType(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors">
            <ArrowRight className="rotate-180" size={20} /> Back to Categories
        </button>

        {/* Info Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className={`p-8 ${currentCategory.color} bg-opacity-10 border-b`}>
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-4 rounded-2xl ${currentCategory.color} bg-opacity-20`}>
                        {currentCategory.icon}
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800">{currentCategory.title}</h2>
                        <p className="text-slate-600 font-medium">Everything you need to know</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                    <div className="md:col-span-2">
                        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Info size={20} /> What is it?</h3>
                        <p className="text-slate-600 leading-relaxed text-sm bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            {currentCategory.info.what}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><CheckCircle2 size={20} /> Key Benefits</h3>
                        <ul className="space-y-2">
                            {currentCategory.info.benefits.map((b, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* Comparison Floater */}
        {compareList.length > 0 && !showComparison && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white p-4 rounded-full shadow-2xl flex items-center gap-6 pr-2 animate-fade-in-up border border-slate-700">
                <div className="pl-2 font-bold text-sm">
                    {compareList.length} Plan{compareList.length > 1 ? 's' : ''} Selected
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCompareList([])}
                        className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                        Clear
                    </button>
                    <button 
                        onClick={() => setShowComparison(true)}
                        disabled={compareList.length < 2}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full font-bold text-sm transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        Compare Now <ArrowLeftRight size={16} />
                    </button>
                </div>
            </div>
        )}

        {/* Plans Listing */}
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 px-2">Top {currentCategory.title} Plans</h3>
            <div className="grid grid-cols-1 gap-4">
                {currentCategory.plans.map((plan) => {
                    const isSelected = compareList.includes(plan.id);
                    return (
                        <div key={plan.id} className={`bg-white rounded-2xl p-6 border transition-all hover:shadow-lg flex flex-col md:flex-row gap-6 items-center ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-indigo-100' : 'border-slate-200'}`}>
                            {/* Provider Info */}
                            <div className="flex-1 w-full">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xl font-bold text-slate-800">{plan.provider}</h4>
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-bold text-yellow-700">{plan.rating}</span>
                                    </div>
                                </div>
                                <p className="text-slate-500 font-medium mb-4">{plan.planName}</p>
                                
                                <div className="flex flex-wrap gap-3">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">
                                        CSR: {plan.csr}
                                    </span>
                                    {plan.features.slice(0, 2).map((f, i) => (
                                        <span key={i} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-xs font-medium border border-slate-100">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Divider for Mobile */}
                            <div className="w-full h-px bg-slate-100 md:w-px md:h-24 md:bg-slate-100" />

                            {/* Pricing & Cover */}
                            <div className="text-center w-full md:w-auto md:text-right min-w-[150px]">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Coverage</p>
                                <p className="text-lg font-bold text-slate-700 mb-3">{plan.cover}</p>
                                
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Premium</p>
                                <p className="text-2xl font-extrabold text-emerald-600">{plan.premium}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 w-full md:w-auto min-w-[160px]">
                                <button 
                                    onClick={() => handleApply(plan.link)}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    Apply Now <ExternalLink size={16} />
                                </button>
                                
                                <button 
                                    onClick={() => toggleCompare(plan.id)}
                                    className={`w-full py-2.5 rounded-xl font-bold text-sm border-2 flex items-center justify-center gap-2 transition-all ${isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}`}
                                >
                                    {isSelected ? <Check size={16} /> : <ArrowLeftRight size={16} />}
                                    {isSelected ? 'Selected' : 'Add to Compare'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
        {!selectedType && renderGrid()}
        {selectedType && !showComparison && renderDetails()}
        {selectedType && showComparison && renderComparison()}
    </div>
  );
};