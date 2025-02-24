import Layout from "@/components/Layout";
import React from "react";

const Profile = () => {
  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account settings
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <div className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center mb-8">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 sm:mb-0 sm:mr-6"></div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-semibold text-gray-900">John Doe</h3>
                  <p className="text-gray-500">john.doe@example.com</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    defaultValue="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                <button className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 