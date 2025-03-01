import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import HeaderSection from "../../components/HeaderSection";
import HeroSection from "../../components/HeroSection";
import HowItWorksSection from "../../components/HowItWorksSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import AboutUsSection from "../../components/AboutUsSection";

const Design = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Replace with your API call
    const fetchData = async () => {
      const response = {
        headerSection: {
          logo: "Syncner",
          links: ["Home", "AboutUs"],
        },
        heroSection: {
          title: "Elevate Your Business with Syncner's Innovative Solutions",
          description:
            "Take your business to the next level with Syncner. Our customized solutions and streamlined processes will help you reach new heights of success in your industry.",
        },
        howItWorksSection: {
          title: "Elevate Your Business with Customized Solutions from Syncner",
          description:
            "Take your business to new heights with Syncner. Our customized solutions and streamlined processes will help drive your success in a constantly evolving industry.",
          services: [
            {
              title: "Consultation",
              description:
                "Our team of experts will meet with you to understand your business needs and goals. We will discuss your design requirements, budget, and timeline.",
            },
            {
              title: "Customized Solution",
              description:
                "Based on our consultation, we will design a tailored solution for your business that aligns with your specific needs. This may include creating a new brand identity, developing marketing materials, or revamping your website.",
            },
          ],
        },
        testimonials: {
          title: "Testimonials",
          description:
            "Don't just take our word for it, read from our extensive list of case studies and customer testimonials.",
          testimonialLists: [
            {
              comment:
                "I have been using Syncner for my business needs and I am blown away by the efficiency and innovation they bring to the table. Their tailored solutions have truly helped streamline our processes and improve our overall operations. The team at Syncner is dedicated, knowledgeable, and always goes above and beyond to ensure their clients' success. Thank you Syncner for taking our business to the next level!",
              user: "Jane Cooper",
              company: "CEO SomeCompany",
            },
            {
              comment:
                "I have been using Syncner for my business needs and I am blown away by the efficiency and innovation they bring to the table. Their tailored solutions have truly helped streamline our processes and improve our overall operations. The team at Syncner is dedicated, knowledgeable, and always goes above and beyond to ensure their clients' success. Thank you Syncner for taking our business to the next level!",
              user: "Jane Cooper",
              company: "CEO SomeCompany",
            },
          ],
        },
        aboutUsSection: {
          title:
            "Unlock Your Business's Full Potential with Syncner: Tailored Solutions for Maximum Success",
          description:
            "Syncner was founded by a team of designers with a passion for helping businesses reach their full potential. With years of experience in the design industry, we understand the challenges and complexities that come with running a successful business.",
        },
      };
      setData(response);
    };
    fetchData();
  }, []);

  const handleSectionUpdate = (sectionKey, updatedData) => {
    setData(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        ...updatedData
      }
    }));
  };

  // Ensure data is loaded before rendering
  if (!data) {
    return <div>Loading...</div>;
  }

  // Define section components mapping
  const sectionComponents = [
    { key: 'headerSection', component: data.headerSection && (
      <HeaderSection
        logo={data.headerSection.logo}
        links={data.headerSection.links}
      />
    )},
    { key: 'heroSection', component: data.heroSection && (
      <HeroSection
        title={data.heroSection.title}
        description={data.heroSection.description}
        onUpdate={(updates) => handleSectionUpdate('heroSection', updates)}
      />
    )},
    { key: 'howItWorksSection', component: data.howItWorksSection && (
      <HowItWorksSection
        title={data.howItWorksSection.title}
        description={data.howItWorksSection.description}
        services={data.howItWorksSection.services}
      />
    )},
    { key: 'testimonials', component: data.testimonials && (
      <TestimonialsSection
        title={data.testimonials.title}
        description={data.testimonials.description}
        testimonialLists={data.testimonials.testimonialLists}
      />
    )},
    { key: 'aboutUsSection', component: data.aboutUsSection && (
      <AboutUsSection
        title={data.aboutUsSection.title}
        description={data.aboutUsSection.description}
      />
    )}
  ];

  // Filter out sections that don't exist in the data
  const availableSections = sectionComponents.filter(section => 
    data[section.key] && section.component
  );

  return (
    <Layout>
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Website Design</h2>
            <p className="mt-1 text-sm text-gray-500">
              Edit and preview your website design
            </p>
          </div>
          <div className="bg-white border rounded-lg m-6">
            {availableSections.map(({ key, component }) => (
              <React.Fragment key={key}>
                {component}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Design;
