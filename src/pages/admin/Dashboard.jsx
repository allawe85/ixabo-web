import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-32">Stats Card 1</div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-32">Stats Card 2</div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-32">Stats Card 3</div>
      </div>
    </div>
  );
};

export default Dashboard;