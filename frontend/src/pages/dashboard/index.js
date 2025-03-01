import { useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const aiTools = [
    {
      id: 1,
      title: "Landing Page AI",
      description: "Create unique landing pages with AI assistance",
      icon: "🎨",
      link: "/design",
    },
    {
      id: 2,
      title: "Content Writer",
      description: "Generate engaging content for your website",
      icon: "✍️",
      link: "/content",
    },
    // Add more tools as needed
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            AI Tools Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool) => (
              <Link key={tool.id} href={tool.link}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <div className="text-4xl mb-4">{tool.icon}</div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {tool.title}
                  </h2>
                  <p className="text-gray-600">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
