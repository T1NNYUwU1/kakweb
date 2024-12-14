import React, { useEffect, useState } from 'react';
import { ImageCarousel } from '../components/ImageCarousel';
import { DonationPanel } from '../components/DonationPanel';

export const ProjectPage = () => {
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    try {
      const response = await fetch('/api/projects/50556');
      const data = await response.json();
      setProjectData(data);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  const handleDonate = async (amount, isMonthly = false) => {
    try {
      const response = await fetch('/api/projects/50556/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, isMonthly }),
      });
      const data = await response.json();
      // Handle successful donation
      fetchProjectData(); // Refresh project data
    } catch (error) {
      console.error('Error making donation:', error);
    }
  };

  if (!projectData) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-sm mb-2">
        {projectData.category} | {projectData.country} | Project #{projectData.projectId}
      </div>
      <h1 className="text-3xl font-bold mb-4">{projectData.title}</h1>
      <ImageCarousel images={projectData.images} />
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-orange-500 text-white p-4 rounded-lg mb-8">
            <h2 className="text-xl mb-2">STORY</h2>
            <p>{projectData.summary}</p>
          </div>
        </div>
        <div className="col-span-1">
          <DonationPanel 
            projectData={projectData} 
            onDonate={handleDonate}
          />
        </div>
      </div>
    </div>
  );
};