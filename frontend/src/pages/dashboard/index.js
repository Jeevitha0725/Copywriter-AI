import React from "react";
import Layout from "../../components/Layout";

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            <p className="mt-1 text-sm text-gray-500">
              Overview of your website analytics
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900">Views</h3>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">1,234</p>
              </div>
              <div className="bg-green-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900">Conversions</h3>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">56</p>
              </div>
              <div className="bg-purple-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900">Engagement</h3>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2">85%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 