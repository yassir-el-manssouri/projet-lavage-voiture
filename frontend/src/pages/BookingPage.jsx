import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailability, createReservation, getVehicles } from '../services/api';
import { useToast } from '../context/ToastContext';

const PRESTATIONS = [
  { id: 'express', name: 'Lavage Express', price: 60, duration: '15 min', description: 'Lavage extérieur rapide et efficace' },
  { id: 'standard', name: 'Lavage Standard', price: 120, duration: '30 min', description: 'Lavage intérieur/extérieur complet pour une propreté optimale' },
  { id: 'premium', name: 'Detailing Premium', price: 250, duration: '60 min', description: 'Soin minutieux incluant le traitement des plastiques et cuirs' },
  { id: 'complet', name: 'Complet / Showroom', price: 800, duration: 'Sur devis', description: 'Polissage et detailing intérieur approfondi. État showroom garanti' }
];

const VEHICLE_TYPES = ['Citadine', 'Berline', 'SUV', 'Utilitaire'];

const ALL_TIMESLOTS = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
];

const BookingPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [usePoints, setUsePoints] = useState(false);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const canUsePoints = user && user.points >= 500;
  
  const [formData, setFormData] = useState({
    prestation: null,
    vehicleType: '',
    brand: '',
    model: '',
    plate: '',
    date: '',
    time: ''
  });

  // Fetch saved vehicles if user is logged in
  useEffect(() => {
    // 1. Zéro Bug Logique (UX) : Restauration d'une réservation non finalisée
    const pending = sessionStorage.getItem('pendingBooking');
    if (pending) {
      try {
        setFormData(JSON.parse(pending));
        setCurrentStep(4);
      } catch (e) {
        console.error("Erreur parsing pendingBooking", e);
      }
      sessionStorage.removeItem('pendingBooking');
    }

    const token = localStorage.getItem('token');
    if (token) {
      getVehicles()
        .then(data => setSavedVehicles(data))
        .catch(err => console.error("Erreur lors de la récupération des véhicules sauvegardés", err));
    }
  }, []);

  // Charger les disponibilités quand la date change
  useEffect(() => {
    if (formData.date) {
      const fetchAvailability = async () => {
        try {
          const unavailable = await getAvailability(formData.date);
          setUnavailableSlots(unavailable);
          // Si l'heure précédemment choisie est devenue indisponible, on la reset
          if (formData.time && unavailable.includes(formData.time)) {
            setFormData(prev => ({ ...prev, time: '' }));
          }
        } catch (err) {
          // 4. Gestion des erreurs : Ne pas échouer silencieusement
          console.error("Erreur availability:", err);
          showToast("Impossible de charger les disponibilités.", "error");
        }
      };
      fetchAvailability();
    }
  }, [formData.date]);

  const resetWizard = () => {
    setCurrentStep(1);
    setErrors({});
    setFormData({
      prestation: null,
      vehicleType: '',
      brand: '',
      model: '',
      plate: '',
      date: '',
      time: ''
    });
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1 && !formData.prestation) {
      newErrors.prestation = "Veuillez sélectionner une prestation.";
    }
    if (currentStep === 2) {
      if (!formData.vehicleType) newErrors.vehicleType = "Type de véhicule requis.";
      if (!formData.brand) newErrors.brand = "Marque requise.";
      if (!formData.model) newErrors.model = "Modèle requis.";
      if (!formData.plate) {
        newErrors.plate = "Plaque d'immatriculation requise.";
      } else if (!/^\d{1,5}-([A-Z]|[\u0600-\u06FF])-\d{1,2}$/i.test(formData.plate)) {
        newErrors.plate = "Format invalide (Ex: 12345-A-26 ou 1234-أ-1)";
      }
    }
    if (currentStep === 3) {
      if (!formData.date) newErrors.date = "Date requise.";
      else {
        // 2. Blindage des Entrées : Vérifier que la date n'est pas dans le passé
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(formData.date);
        if (selectedDate < today) {
          newErrors.date = "La date ne peut pas être dans le passé.";
        }
      }
      if (!formData.time) {
        newErrors.time = "Heure requise.";
      } else if (formData.date) {
        const selectedDateTime = new Date(`${formData.date}T${formData.time}:00`);
        if (selectedDateTime < new Date()) {
          newErrors.time = "L\'heure sélectionnée est déjà passée pour aujourd\'hui.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < 4) setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setErrors({});
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleFinalConfirm = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // 1. Zéro Bug Logique (UX) : Sauvegarde avant redirection
      sessionStorage.setItem('pendingBooking', JSON.stringify(formData));
      showToast("Veuillez vous connecter pour finaliser votre réservation.", 'info');
      navigate('/connexion');
      return;
    }

    setLoading(true);
    try {
      // 2. Blindage des Entrées : Nettoyage des espaces (trim)
      const reservationData = {
        vehicle: `${formData.brand.trim()} ${formData.model.trim()} · ${formData.plate}`,
        service: formData.prestation.name,
        date: formData.date,
        time: formData.time,
        price: usePoints ? 0 : formData.prestation.price,
        usePoints: usePoints
      };

      await createReservation(reservationData);
      showToast("Réservation confirmée avec succès !", 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || "Erreur lors de la réservation", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSavedVehicle = (vehicle) => {
    // Attempt to extract type if it was saved in the model like "Model (Type)"
    let type = '';
    let extractedModel = vehicle.model;
    
    const typeMatch = vehicle.model.match(/\((.*?)\)/);
    if (typeMatch) {
      type = typeMatch[1];
      extractedModel = vehicle.model.replace(/\(.*?\)/, '').trim();
    }

    setFormData({
      ...formData,
      brand: vehicle.brand,
      model: extractedModel,
      plate: vehicle.plate,
      vehicleType: type || 'Citadine' // Default if not found
    });
    setErrors({});
  };

  const steps = [
    { number: 1, title: 'Prestation' },
    { number: 2, title: 'Véhicule' },
    { number: 3, title: 'Créneau' },
    { number: 4, title: 'Confirmation' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#2E4057]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-[#2E4057] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-heading font-black text-2xl tracking-tighter">
              Auto<span className="text-[#1A6FC4]">Brillance</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => navigate('/')} className="hover:text-[#2E4057] transition-colors">Services</button>
            <button onClick={() => navigate('/')} className="hover:text-[#2E4057] transition-colors">Avantages</button>
            <button onClick={() => navigate('/')} className="hover:text-[#2E4057] transition-colors">Témoignages</button>
            <button onClick={() => navigate('/')} className="hover:text-[#2E4057] transition-colors">Contact</button>
          </nav>

          <div className="flex items-center gap-4">
            {localStorage.getItem('token') ? (
              <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold text-slate-600 hover:text-[#2E4057]">Mon Espace</button>
            ) : (
              <button onClick={() => navigate('/connexion')} className="text-sm font-semibold text-slate-600 hover:text-[#2E4057]">Connexion</button>
            )}
            <button 
              onClick={resetWizard}
              className="bg-[#2E4057] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
            >
              Réserver vite
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Title Section */}
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-4 rounded-full bg-blue-100 text-[#1A6FC4] text-xs font-bold uppercase tracking-wider mb-4">
            Réservation en ligne
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-[#2E4057] tracking-tight">
            Réservez votre lavage
          </h1>
        </div>

        {/* Stepper */}
        <div className="mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0 hidden md:block"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-4 
                    ${currentStep >= step.number 
                      ? 'bg-[#2E4057] text-white border-[#2E4057] scale-110 shadow-xl' 
                      : 'bg-white text-slate-400 border-slate-100 shadow-sm'
                    }`}
                >
                  {step.number}
                </div>
                <span className={`mt-3 text-sm font-bold uppercase tracking-widest ${currentStep === step.number ? 'text-[#2E4057]' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
          <div className="p-8 md:p-12 flex-grow">
            
            {/* Step 1: Prestation */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-2">Choisissez votre prestation</h2>
                <p className="text-slate-500 mb-8 font-medium">Sélectionnez la formule adaptée à votre véhicule</p>
                
                <div className="grid gap-4">
                  {PRESTATIONS.map((service) => (
                    <div 
                      key={service.id}
                      onClick={() => {
                        setFormData({ ...formData, prestation: service });
                        setErrors({ ...errors, prestation: null });
                      }}
                      className={`group p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between
                        ${formData.prestation?.id === service.id 
                          ? 'border-[#1A6FC4] bg-blue-50/50 ring-2 ring-blue-100' 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                          ${formData.prestation?.id === service.id ? 'bg-[#1A6FC4] text-white' : 'bg-slate-100 text-slate-500'}
                        `}>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{service.name}</h3>
                          <p className="text-sm text-slate-500">{service.description}</p>
                        </div>
                      </div>
                      <div className="text-xl font-black text-[#2E4057]">{service.price} MAD</div>
                    </div>
                  ))}
                </div>
                {errors.prestation && <p className="text-red-500 text-sm mt-4 font-bold ml-1">{errors.prestation}</p>}
              </div>
            )}

            {/* Step 2: Véhicule */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-2">Détails du véhicule</h2>
                <p className="text-slate-500 mb-6 font-medium">Informations sur votre voiture</p>

                {savedVehicles.length > 0 && (
                  <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                    <label className="text-sm font-bold text-slate-700 block mb-3">Sélectionner un de vos véhicules</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {savedVehicles.map(v => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => handleSelectSavedVehicle(v)}
                          className="p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-[#1A6FC4] hover:shadow-md transition-all group"
                        >
                          <p className="font-bold text-[#2E4057] group-hover:text-[#1A6FC4]">{v.brand} {v.model}</p>
                          <p className="text-sm text-slate-500 font-mono mt-1">{v.plate}</p>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-6 mb-2">
                      <div className="h-px bg-slate-200 flex-1"></div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">OU SAISIR MANUELLEMENT</span>
                      <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                  </div>
                )}
                
                <div className="mb-8">
                  <label className="text-sm font-bold text-slate-700 ml-1 block mb-3">Type de véhicule</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {VEHICLE_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, vehicleType: type });
                          setErrors({ ...errors, vehicleType: null });
                        }}
                        className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-2
                          ${formData.vehicleType === type 
                            ? 'border-[#1A6FC4] bg-blue-50 text-[#1A6FC4] shadow-sm' 
                            : 'border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.vehicleType && <p className="text-red-500 text-sm mt-2 font-bold ml-1">{errors.vehicleType}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Marque</label>
                    <input 
                      type="text" 
                      placeholder="ex: Peugeot"
                      value={formData.brand}
                      onChange={(e) => {
                        setFormData({ ...formData, brand: e.target.value });
                        setErrors({ ...errors, brand: null });
                      }}
                      className={`w-full p-4 rounded-2xl border-2 transition-all focus:outline-none font-bold
                        ${errors.brand ? 'border-red-200 bg-red-50' : 'border-slate-100 focus:border-[#1A6FC4]'}`}
                    />
                    {errors.brand && <p className="text-red-500 text-xs font-bold ml-1">{errors.brand}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Modèle</label>
                    <input 
                      type="text" 
                      placeholder="ex: 208"
                      value={formData.model}
                      onChange={(e) => {
                        setFormData({ ...formData, model: e.target.value });
                        setErrors({ ...errors, model: null });
                      }}
                      className={`w-full p-4 rounded-2xl border-2 transition-all focus:outline-none font-bold
                        ${errors.model ? 'border-red-200 bg-red-50' : 'border-slate-100 focus:border-[#1A6FC4]'}`}
                    />
                    {errors.model && <p className="text-red-500 text-xs font-bold ml-1">{errors.model}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Plaque d'immatriculation</label>
                  <input 
                    type="text" 
                    placeholder="12345-A-26"
                    value={formData.plate}
                    onChange={(e) => {
                      setFormData({ ...formData, plate: e.target.value.toUpperCase() });
                      setErrors({ ...errors, plate: null });
                    }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all focus:outline-none font-mono tracking-widest text-lg
                      ${errors.plate ? 'border-red-200 bg-red-50' : 'border-slate-100 focus:border-[#1A6FC4]'}`}
                  />
                  {errors.plate && <p className="text-red-500 text-sm font-bold ml-1">{errors.plate}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Créneau */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-2">Choisir un créneau</h2>
                <p className="text-slate-500 mb-8 font-medium">Sélectionnez la date et l'heure de votre passage</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 block ml-1">Date</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value });
                        setErrors({ ...errors, date: null });
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full p-4 rounded-2xl border-2 transition-all focus:outline-none font-bold
                        ${errors.date ? 'border-red-200 bg-red-50' : 'border-slate-100 focus:border-[#1A6FC4]'}`}
                    />
                    {errors.date && <p className="text-red-500 text-sm font-bold ml-1">{errors.date}</p>}
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 block ml-1">Horaires disponibles</label>
                    <div className="grid grid-cols-3 gap-2">
                      {ALL_TIMESLOTS.map((t) => {
                        const isUnavailable = unavailableSlots.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={isUnavailable}
                            onClick={() => {
                              setFormData({ ...formData, time: t });
                              setErrors({ ...errors, time: null });
                            }}
                            className={`p-3 rounded-xl border-2 font-bold text-sm transition-all
                              ${formData.time === t 
                                ? 'border-[#1A6FC4] bg-blue-50 text-[#1A6FC4]' 
                                : isUnavailable 
                                  ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed opacity-50'
                                  : 'border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                    {errors.time && <p className="text-red-500 text-sm font-bold ml-1">{errors.time}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-2">Récapitulatif</h2>
                <p className="text-slate-500 mb-8 font-medium">Vérifiez les détails avant de confirmer</p>
                
                <div className="space-y-4 bg-slate-50 p-8 rounded-3xl border border-slate-200 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-500 font-medium text-lg">Prestation</span>
                    <span className="font-bold text-[#2E4057] text-lg">{formData.prestation?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-500 font-medium text-lg">Véhicule</span>
                    <div className="text-right">
                      <p className="font-bold text-[#2E4057]">{formData.brand} {formData.model}</p>
                      <p className="text-sm text-slate-400 font-mono">{formData.plate}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-500 font-medium text-lg">Date & Heure</span>
                    <span className="font-bold text-[#2E4057] text-lg">{formData.date && new Date(formData.date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {formData.time}</span>
                  </div>
                  
                  {canUsePoints && (
                    <div className="flex justify-between items-center py-4 border-b border-slate-200">
                      <div>
                        <span className="text-[#1A6FC4] font-bold text-lg flex items-center gap-2">⭐ Récompense Fidélité</span>
                        <p className="text-xs text-slate-500 mt-1">Vous avez {user.points} points. Utilisez 500 pts pour un lavage gratuit.</p>
                      </div>
                      <button
                        onClick={() => setUsePoints(!usePoints)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${usePoints ? 'bg-[#1A6FC4]' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${usePoints ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-6">
                    <span className="text-xl font-black text-[#2E4057]">Prix total</span>
                    <div className="text-right">
                       {usePoints ? (
                         <>
                           <span className="text-lg text-slate-400 line-through mr-2">{formData.prestation?.price} MAD</span>
                           <span className="text-4xl font-black text-green-500">GRATUIT</span>
                         </>
                       ) : (
                         <span className="text-4xl font-black text-[#1A6FC4]">{formData.prestation?.price} MAD</span>
                       )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-2xl text-[#1A6FC4] text-sm font-medium border border-blue-100">
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-bold mb-1">Confirmation immédiate</p>
                    <p className="text-blue-600/80">En cliquant sur confirmer, votre créneau sera réservé. Vous recevrez une notification de rappel 1h avant.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="p-8 md:p-12 pt-0 border-t border-slate-100 flex justify-between items-center bg-white rounded-b-3xl">
            <div>
              {currentStep > 1 && (
                <button 
                  disabled={loading}
                  onClick={prevStep}
                  className="flex items-center gap-2 px-8 py-3 rounded-full font-bold text-slate-500 hover:text-[#2E4057] hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  ← Retour
                </button>
              )}
            </div>
            
            <button 
              disabled={loading}
              onClick={currentStep === 4 ? handleFinalConfirm : nextStep}
              className={`flex items-center gap-2 px-10 py-4 rounded-full font-black text-lg transition-all duration-300 shadow-xl
                bg-[#2E4057] text-white hover:bg-slate-800 hover:-translate-y-1 active:translate-y-0 shadow-slate-200 disabled:opacity-70 disabled:cursor-wait`}
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : currentStep === 4 ? 'Confirmer la réservation' : 'Suivant →'}
            </button>
          </div>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-400 text-sm">
        <p>Auto Brillance - Le spécialiste du nettoyage automobile premium</p>
      </footer>
    </div>
  );
};

export default BookingPage;
