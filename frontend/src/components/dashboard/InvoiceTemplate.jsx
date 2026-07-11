import React from 'react';

const InvoiceTemplate = ({ reservation, user }) => {
  if (!reservation || !user) return null;

  const today = new Date().toLocaleDateString('fr-FR');
  const invoiceNumber = `FAC-${reservation.id}-${new Date().getFullYear()}`;
  
  const priceTTC = reservation.price || 0;
  const priceHTNum = priceTTC / 1.2;
  const priceHT = priceHTNum.toFixed(2);
  const tva = (priceTTC - priceHTNum).toFixed(2);

  return (
    <div className="invoice-print-only bg-white p-8 absolute top-0 left-0 w-full min-h-screen z-[9999] text-gray-800">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-[#0F172A] pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black font-heading text-[#0F172A]">
              Auto<span className="text-[#2563EB]">Brillance</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">123 Avenue Mohamed V</p>
            <p className="text-sm text-gray-500">20000 Casablanca, Maroc</p>
            <p className="text-sm text-gray-500">contact@autobrillance.ma</p>
            <p className="text-sm text-gray-500">ICE: 123456789012345</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-gray-200 uppercase tracking-wider mb-2">Facture</h2>
            <p className="font-bold text-[#0F172A]">{invoiceNumber}</p>
            <p className="text-sm text-gray-500">Date: {today}</p>
          </div>
        </div>

        {/* Client Info */}
        <div className="flex justify-between mb-12">
          <div className="w-1/2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Facturé à</h3>
            <p className="font-bold text-[#0F172A] text-lg">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="w-1/2 text-right">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Véhicule</h3>
            <p className="font-bold text-[#0F172A]">{reservation.vehicle}</p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 text-sm font-bold text-gray-400 uppercase tracking-wider">Description du Service</th>
              <th className="text-center py-3 text-sm font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-right py-3 text-sm font-bold text-gray-400 uppercase tracking-wider">Montant TTC</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-4">
                <p className="font-bold text-[#0F172A]">{reservation.service}</p>
                <p className="text-xs text-gray-500">Lavage professionnel et finition soignée</p>
              </td>
              <td className="text-center py-4 text-gray-600">{reservation.date}</td>
              <td className="text-right py-4 font-bold text-[#0F172A]">{priceTTC} MAD</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-1/3 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total HT</span>
              <span>{priceHT} MAD</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>TVA (20%)</span>
              <span>{tva} MAD</span>
            </div>
            <div className="flex justify-between text-lg font-black text-[#0F172A] border-t-2 border-gray-200 pt-3">
              <span>Total TTC</span>
              <span>{priceTTC} MAD</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-200 pt-8">
          <p className="font-bold text-[#0F172A] mb-2">Merci de votre confiance !</p>
          <p className="text-xs text-gray-400">Pour toute question concernant cette facture, veuillez nous contacter.</p>
          <p className="text-xs text-gray-400 mt-1">Les conditions générales de vente s'appliquent.</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
