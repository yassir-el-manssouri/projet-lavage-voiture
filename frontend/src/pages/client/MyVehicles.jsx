import React, { useState, useEffect } from 'react';
import { getVehicles, addVehicle, deleteVehicle } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const VEHICLE_TYPES = ['Citadine', 'Berline', 'SUV', 'Utilitaire'];

const MyVehicles = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ type: '', brand: '', model: '', plate: '' });
  const [errors, setErrors] = useState({});

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      showToast("Erreur lors de la récupération des véhicules", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!newVehicle.type) newErrors.type = "Type requis";
    if (!newVehicle.brand) newErrors.brand = "Marque requise";
    if (!newVehicle.model) newErrors.model = "Modèle requis";
    if (!newVehicle.plate) {
      newErrors.plate = "Plaque requise";
    } else if (!/^\d{1,5}-([A-Z]|[\u0600-\u06FF])-\d{1,2}$/i.test(newVehicle.plate)) {
      newErrors.plate = "Format invalide (Ex: 12345-A-26)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Pour l\'instant, le backend attend 'brand', 'model', 'plate', 'color'.
      // On va passer le type dans brand ou model temporairement, ou si on a un backend mis à jour,
      // on concatène :
      const vehicleToSave = {
        brand: newVehicle.brand.trim(),
        model: `${newVehicle.model.trim()} (${newVehicle.type})`, // Combine type into model
        plate: newVehicle.plate.trim(),
        color: '' // On n\'utilise plus la couleur dans le nouveau flow
      };
      
      await addVehicle(vehicleToSave);
      showToast("Véhicule ajouté !", "success");
      setShowModal(false);
      setNewVehicle({ type: '', brand: '', model: '', plate: '' });
      setErrors({});
      fetchVehicles();
    } catch (err) {
      showToast(err.message || "Erreur lors de l'ajout", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce véhicule ?")) {
      try {
        await deleteVehicle(id);
        showToast("Véhicule supprimé", "success");
        fetchVehicles();
      } catch (err) {
        showToast("Erreur lors de la suppression", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-[#2E4057]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-[#2E4057] text-sm font-semibold flex items-center gap-1 mb-2 hover:translate-x-[-4px] transition-transform"
            >
              ← Retour au Dashboard
            </button>
            <h1 className="text-3xl font-heading font-extrabold text-[#2E4057]">Mes Véhicules</h1>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#1A6FC4] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
          >
            + Ajouter
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium">Chargement...</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {vehicles.map((v) => (
                <motion.div 
                  key={v.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex items-center gap-4 relative group hover:shadow-lg transition-all"
                >
                  <div className="w-16 h-16 bg-blue-50 text-[#1A6FC4] rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg">{v.brand}</h3>
                    <p className="text-slate-500 font-medium">{v.model}</p>
                    <p className="text-sm font-mono mt-1 px-2 py-0.5 bg-slate-100 inline-block rounded border border-slate-200">{v.plate}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(v.id)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                    title="Supprimer ce véhicule"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {vehicles.length === 0 && (
              <div className="sm:col-span-2 py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">Aucun véhicule enregistré pour le moment.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Ajout */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#2E4057]/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-heading font-black text-[#2E4057] mb-6">Ajouter un véhicule</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                
                {/* Type de véhicule */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {VEHICLE_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setNewVehicle({ ...newVehicle, type });
                          setErrors({ ...errors, type: null });
                        }}
                        className={`p-3 rounded-xl border-2 font-bold text-sm transition-all
                          ${newVehicle.type === type 
                            ? 'border-[#1A6FC4] bg-blue-50 text-[#1A6FC4]' 
                            : 'border-slate-100 hover:border-slate-200 text-slate-600'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.type && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.type}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Marque</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Peugeot"
                      className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-3 focus:outline-none font-bold
                        ${errors.brand ? 'border-red-200 bg-red-50' : 'border-slate-100 focus:border-[#1A6FC4]'}`}
                      value={newVehicle.brand}
                      onChange={(e) => {
                        setNewVehicle({...newVehicle, brand: e.target.value});
                        setErrors({ ...errors, brand: null });
                      }}
                    />
                    {errors.brand && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.brand}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Modèle</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 208"
                      className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-3 focus:outline-none font-bold
                        ${errors.model ? 'border-red-200 bg-red-50' : 'border-slate-100 focus:border-[#1A6FC4]'}`}
                      value={newVehicle.model}
                      onChange={(e) => {
                        setNewVehicle({...newVehicle, model: e.target.value});
                        setErrors({ ...errors, model: null });
                      }}
                    />
                    {errors.model && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.model}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Plaque d'immatriculation</label>
                  <input 
                    type="text" 
                    placeholder="12345-A-26"
                    className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-3 focus:outline-none font-mono tracking-widest text-lg uppercase
                      ${errors.plate ? 'border-red-200 bg-red-50' : 'border-slate-100 focus:border-[#1A6FC4]'}`}
                    value={newVehicle.plate}
                    onChange={(e) => {
                      setNewVehicle({...newVehicle, plate: e.target.value.toUpperCase()});
                      setErrors({ ...errors, plate: null });
                    }}
                  />
                  {errors.plate && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.plate}</p>}
                </div>
                
                <div className="flex gap-3 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-[#2E4057] text-white shadow-lg hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyVehicles;
