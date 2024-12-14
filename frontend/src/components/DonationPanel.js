import React, { useState } from 'react';

export const DonationPanel = ({ projectData, onDonate }) => {
  const [customAmount, setCustomAmount] = useState('');

  return (
    <div className="bg-orange-100 p-4 rounded-lg">
      <div className="mb-4">
        <div className="text-2xl font-bold">${projectData.currentAmount}</div>
        <div className="text-sm">raise of {projectData.goalAmount} goal</div>
        <div className="mt-2">{projectData.donationCount} Donations | ${projectData.goalAmount - projectData.currentAmount} to go</div>
      </div>
      
      <div className="space-y-2">
        {projectData.donationTiers.map((tier) => (
          <button
            key={tier.amount}
            onClick={() => onDonate(tier.amount)}
            className="w-full bg-white hover:bg-orange-50 p-4 rounded border text-left"
          >
            <div className="font-bold">${tier.amount}</div>
            <div className="text-sm">{tier.description}</div>
          </button>
        ))}
        
        <div className="mt-4">
          <input 
            type="number" 
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Other amount"
            className="w-full p-2 border rounded"
          />
          <button 
            onClick={() => onDonate(Number(customAmount), false)}
            className="w-full bg-orange-500 text-white py-2 rounded mt-2"
          >
            Donate Once
          </button>
          <button 
            onClick={() => onDonate(Number(customAmount), true)}
            className="w-full bg-white border py-2 rounded mt-2"
          >
            Donate Monthly
          </button>
        </div>
      </div>
    </div>
  );
};