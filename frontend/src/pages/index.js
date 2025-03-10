import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Home = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 border-b border-foreground/10">
            <h2 className="text-4xl font-semibold gradient-text">Welcome</h2>
            <p className="mt-2 text-foreground-light">
              Get started with Syncner
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="card-modern hover-scale">
                <h3 className="text-lg font-semibold text-foreground">
                  Quick Start
                </h3>
                <p className="mt-2 text-foreground-light">
                  Learn how to get started with Syncner and create your first
                  design.
                </p>
                <button className="btn-primary mt-4 w-full sm:w-auto">
                  View Guide
                </button>
              </div>
              <div className="card-modern hover-scale">
                <h3 className="text-lg font-semibold text-foreground">
                  Recent Designs
                </h3>
                <p className="mt-2 text-foreground-light">
                  Continue working on your recent designs.
                </p>
                <button className="btn-secondary mt-4 w-full sm:w-auto">
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
