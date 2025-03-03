import React, { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Layout from "@/components/Layout";
import HeaderSection from "@/components/HeaderSection";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutUsSection from "@/components/AboutUsSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const DraggableSection = ({ section, index, moveSection, removeSection }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "section",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "section",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveSection(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center p-3 bg-gray-50 rounded-md ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{ cursor: "grab" }}
    >
      <span className="mr-2 text-gray-500 cursor-move">≡</span>
      <span className="text-black">{section.label}</span>
      <button
        onClick={() => removeSection(section.id)}
        className="ml-auto text-gray-500 hover:text-gray-700"
      >
        −
      </button>
    </div>
  );
};

const Index = () => {
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    toneOfVoice: "Professional",
    companyName: "",
    companyType: "",
    audience: "",
    companyDescription: "",
  });

  const [selectedSections, setSelectedSections] = useState([]);

  const [characterCount, setCharacterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    setData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        ...updatedData,
      },
    }));
  };

  // Ensure data is loaded before rendering
  if (!data) {
    return <div>Loading...</div>;
  }

  const availableSections = [
    { id: "navigation", label: "Navigation/Menu" },
    { id: "hero", label: "Hero Section/Header" },
    { id: "howitworks", label: "How it works" },
    { id: "features", label: "Features" },
    { id: "testimonials", label: "Testimonials" },
    { id: "about_us", label: "About us" },
    { id: "footer", label: "Footer" },
  ];

  const sectionComponents = [
    {
      key: "navigation",
      component: data.navigation && (
        <HeaderSection
          logo={formData.companyName}
          links={data.navigation.navigation}
        />
      ),
    },
    {
      key: "hero",
      component: data.hero && (
        <HeroSection
          title={data.hero.hero_section.title}
          description={data.hero.hero_section.description}
          onUpdate={(updates) => handleSectionUpdate("hero", updates)}
        />
      ),
    },
    {
      key: "howitworks",
      component: data.howitworks && (
        <HowItWorksSection
          title={data.howitworks.howItWorksSection.title}
          description={data.howitworks.howItWorksSection.description}
          services={data.howitworks.howItWorksSection.services}
        />
      ),
    },
    {
      key: "features",
      component: data.features && (
        <FeaturesSection features={data.features.features} />
      ),
    },
    {
      key: "testimonials",
      component: data.testimonials && (
        <TestimonialsSection
          title={data.testimonials.title}
          description={data.testimonials.description}
          testimonialLists={data.testimonials.testimonialLists}
        />
      ),
    },
    {
      key: "about_us",
      component: data.about_us && (
        <AboutUsSection
          title={data.about_us.aboutUsSection.title}
          description={data.about_us.aboutUsSection.description}
        />
      ),
    },
    {
      key: "footer",
      component: data.footer && (
        <Footer
          companyName={data.footer.footer["Company name"]}
          links={data.footer.footer.Links}
        />
      ),
    },
  ];

  const availableSectionsRes = sectionComponents.filter(
    (section) => data[section.key] && section.component
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "companyDescription") {
      setCharacterCount(value.length);
    }
  };

  const handleSectionSelect = (e) => {
    const sectionId = e.target.value;
    if (!sectionId) return;

    const section = availableSections.find((s) => s.id === sectionId);
    if (section && !selectedSections.some((s) => s.id === sectionId)) {
      if (selectedSections.length < 8) {
        setSelectedSections((prev) => [
          ...prev,
          { id: sectionId, label: section.label },
        ]);
      }
    }
    e.target.value = ""; // Reset dropdown after selection
  };

  const removeSection = (sectionId) => {
    setSelectedSections((prev) =>
      prev.filter((section) => section.id !== sectionId)
    );
  };

  const moveSection = (fromIndex, toIndex) => {
    setSelectedSections((prevSections) => {
      const sections = [...prevSections];
      const [movedSection] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, movedSection);
      return sections;
    });
  };

  const handleCreatePage = async () => {
    setIsLoading(true);
    try {
      const requestBody = {
        company_name: formData.companyName,
        company_type: formData.companyType,
        company_description: formData.companyDescription,
        target_audience: formData.audience,
        tone_of_voice: formData.toneOfVoice,
        selected_sections: selectedSections.map(section => section.id)
      };

      // const response = await axios.post('http://127.0.0.1:5000/landing_page', requestBody);

      let d = {
        "data": {
          "about_us": {
            "aboutUsSection": {
              "description": "Wisework was founded on the principle of empowering businesses to reach their full potential. Our team of experts, with years of experience in the industry, understands the challenges of driving growth and success in a rapidly evolving market. We're dedicated to providing tailored solutions that streamline operations, amplify productivity, and unlock long-term success for our clients.",
              "title": "Empowering Businesses to Thrive with Wisework's Innovative Solutions"
            }
          },
          "features": {
            "features": [
              "Centralized Dashboard for Efficient Workflow Management",
              "Customized Solutions Tailored to Your Business Needs",
              "Seamless Integrations with Existing Systems and Processes",
              "Comprehensive Consultation and Implementation Support",
              "Dedicated Ongoing Support for Continuous Improvement",
              "Streamlined Processes for Enhanced Productivity and Efficiency",
              "Scalable Solutions to Drive Business Growth and Success",
              "Access to Expert Resources and Knowledge Base",
              "Flexible Pricing Plans to Fit Your Business Needs"
            ]
          },
          "footer": {
            "footer": {
              "Company name": "Wisework",
              "Links": [
                {
                  "label": "Home"
                },
                {
                  "dropdown": [
                    "Electronics",
                    "Clothing",
                    "Books",
                    "Home & Garden"
                  ],
                  "label": "Products"
                },
                {
                  "dropdown": [
                    "Web Development",
                    "Marketing",
                    "Consulting"
                  ],
                  "label": "Services"
                },
                {
                  "label": "About Us"
                }
              ]
            }
          },
          "hero": {
            "hero_section": {
              "description": "Streamline your operations and unlock growth with Wisework's cutting-edge solutions, tailored to drive efficiency and productivity.",
              "title": "Transform Your Workflow, Amplify Your Success"
            }
          },
          "howitworks": {
            "howItWorksSection": {
              "description": "Take your business to new heights with Wisework. Our customized solutions and streamlined processes will help drive your success in a constantly evolving industry.",
              "services": [
                {
                  "description": "Our team of experts will meet with you to understand your business needs and goals. We will discuss your design requirements, budget, and timeline.",
                  "title": "Consultation"
                },
                {
                  "description": "Based on our consultation, we will design a tailored solution for your business that aligns with your specific needs. This may include creating a new brand identity, developing marketing materials, or revamping your website.",
                  "title": "Customized Solution"
                },
                {
                  "description": "We will implement your customized solution, ensuring a seamless integration with your existing systems and processes.",
                  "title": "Implementation"
                },
                {
                  "description": "Our dedicated support team will provide ongoing assistance and maintenance to ensure your solution continues to meet your evolving business needs.",
                  "title": "Ongoing Support"
                }
              ],
              "title": "Elevate Your Business with Customized Solutions from Wisework"
            }
          },
          "navigation": {
            "navigation": [
              {
                "label": "Dashboard"
              },
              {
                "dropdown": [
                  "Solutions",
                  "Integrations",
                  "Pricing"
                ],
                "label": "Products"
              },
              {
                "dropdown": [
                  "Blog",
                  "Webinars",
                  "Help Center"
                ],
                "label": "Resources"
              },
              {
                "label": "About Us"
              },
              {
                "label": "Contact Us"
              }
            ]
          },
          "testimonials": {
            "title": "Students Speak: The Power of Syncner",
            "description": "Don't just take our word for it. Hear from students who have experienced the transformative power of working together with syncner.",
            "testimonialLists": [
              {
                "comment": "Syncner has completely changed the way I approach group projects. It's amazing to see how it fosters collaboration and accountability among team members!",
                "user": "Emily W.",
                "company": "Harvard University"
              },
              {
                "comment": "I was blown away by how syncner streamlined our workflow. It's the perfect tool for students looking to get more done in less time.",
                "user": "Ryan T.",
                "company": "Stanford University"
              },
              {
                "comment": "Syncner is more than just a tool - it's a game-changer. It's helped me build stronger relationships with my classmates and improved our overall performance.",
                "user": "Sophia L.",
                "company": "University of California, Berkeley"
              }
            ]
          },
          "message": "Landing page details updated"
        }
      }
      
      // if (response.data && response.data.data) {
        // console.log("response.data.data", response.data.data)
        setData(d.data);
        setShowForm(false);
      // }
    } catch (error) {
      console.error("Error creating page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="mx-auto px-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Generated Landing Page
                  </h2>
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Back to Editor
                  </button>
                </div>
              </div>
              <div className="p-6">
                {/* Preview sections */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Website Design
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Edit and preview your website design
                    </p>
                  </div>
                  <div className="bg-white border rounded-lg m-6">
                    {availableSectionsRes.map(({ key, component }) => (
                      <React.Fragment key={key}>{component}</React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            AI Landing Page
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Our AI-powered landing page builder helps you create unique landing
            pages for your business in seconds — no writing, designing or coding
            required.
          </p>
          <p className="text-center text-gray-500 mb-8">
            This tool will deduct 1 credit per section.
          </p>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-2 gap-6">
              

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Tone of voice
                </label>
                <select
                  name="toneOfVoice"
                  value={formData.toneOfVoice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                >
                  <option value="Professional">Professional</option>
                  <option value="Childish">Childish</option>
                  <option value="Luxurious">Luxurious</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Formal">Formal</option>
                  <option value="Humorous">Humorous</option>
                  <option value="Confident">Confident</option>
                  <option value="Exciting">Exciting</option>
                  <option value="Surprised">Surprised</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Company Name*
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Netflix, Spotify, Uber..."
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Company Type*
                </label>
                <select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                >
                  <option value="">-- Select --</option>
                  <option value="startup">Startup</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Audience*
                </label>
                <input
                  type="text"
                  name="audience"
                  placeholder="Designers, Fitness, Restaurant owners..."
                  value={formData.audience}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                />
              </div>


              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company Description*
                </label>
                <textarea
                  name="companyDescription"
                  placeholder="Explain here to the AI what your product (or service) is about. Rewrite to get different results."
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                />
                <div className="mt-1 text-sm text-gray-500 flex justify-between">
                  <span>{characterCount}/200</span>
                  {characterCount < 40 && (
                    <span className="text-orange-500">
                      40 more characters needed in your description.
                    </span>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Page Structure* (min 3 / max 8)
                </label>
                <DndProvider backend={HTML5Backend}>
                  <div className="mt-2 space-y-2">
                    {selectedSections.map((section, index) => (
                      <DraggableSection
                        key={section.id}
                        section={section}
                        index={index}
                        moveSection={moveSection}
                        removeSection={removeSection}
                      />
                    ))}
                  </div>
                </DndProvider>

                {/* Section Selector */}
                <div className="relative mt-2">
                  <select
                    onChange={handleSectionSelect}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none text-black"
                    value=""
                  >
                    <option value="">-- Select section --</option>
                    {availableSections.map((section) => {
                      const isSelected = selectedSections.some(
                        (s) => s.id === section.id
                      );
                      return (
                        <option
                          key={section.id}
                          value={section.id}
                          disabled={isSelected}
                        >
                          {section.label} {isSelected ? "(Selected)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Validation Messages */}
                {selectedSections.length < 3 && (
                  <p className="mt-2 text-sm text-orange-500">
                    Please select at least {3 - selectedSections.length} more
                    section{selectedSections.length < 2 ? "s" : ""}.
                  </p>
                )}
                {selectedSections.length > 8 && (
                  <p className="mt-2 text-sm text-red-500">
                    Maximum 8 sections allowed. Please remove{" "}
                    {selectedSections.length - 8} section
                    {selectedSections.length - 8 > 1 ? "s" : ""}.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleCreatePage}
              disabled={selectedSections.length < 3 || isLoading}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isLoading ? "Creating..." : "Create new page"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
