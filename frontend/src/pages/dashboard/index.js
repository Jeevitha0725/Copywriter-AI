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
      link: "/landing-page-ai",
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
          <h1 className="text-3xl font-bold gradient-text mb-8">
            AI Tools Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool) => (
              <Link key={tool.id} href={tool.link}>
                <div className="card-modern hover-scale">
                  <div className="text-4xl mb-4 animate-float">{tool.icon}</div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {tool.title}
                  </h2>
                  <p className="text-foreground-light">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
