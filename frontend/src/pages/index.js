import Layout from "@/components/Layout";
import React from "react";

const Home = () => {
  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Welcome</h2>
            <p className="mt-1 text-sm text-gray-500">
              Get started with Syncner
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="border rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900">Quick Start</h3>
                <p className="mt-2 text-gray-600">
                  Learn how to get started with Syncner and create your first design.
                </p>
                <button className="mt-4 w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                  View Guide
                </button>
              </div>
              <div className="border rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Designs</h3>
                <p className="mt-2 text-gray-600">
                  Continue working on your recent designs.
                </p>
                <button className="mt-4 w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                  View Designs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
