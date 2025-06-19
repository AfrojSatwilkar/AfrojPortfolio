'use client';
import React from 'react';
import { profileData } from '@/data/portfolioData';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section id="about" className="relative text-white py-20 md:py-28 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {/* Left Column: Image */}
          <motion.div 
            className="lg:col-span-2 flex justify-center items-center"
            variants={fadeIn}
          >
            <div className="relative">
              {/* Background geometric shapes */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl rotate-12 blur-sm"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-cyan-400/20 rounded-full blur-md"></div>
              
              {/* Main image container */}
              <motion.div 
                className="relative w-[350px] h-[450px] lg:w-[350px] lg:h-[400px] overflow-hidden bg-gradient-to-br from-cyan-400/10 to-purple-500/10 backdrop-blur-sm"
                style={{
                  borderRadius: "2rem 0.5rem 2rem 0.5rem",
                  border: "2px solid transparent",
                  backgroundImage: "linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(147, 51, 234, 0.3))",
                  backgroundClip: "padding-box",
                }}
                animate={{
                  boxShadow: [
                    "0 8px 32px rgba(6, 182, 212, 0.3), 0 0 0 1px rgba(6, 182, 212, 0.2)",
                    "0 12px 40px rgba(147, 51, 234, 0.3), 0 0 0 1px rgba(147, 51, 234, 0.2)",
                    "0 8px 32px rgba(6, 182, 212, 0.3), 0 0 0 1px rgba(6, 182, 212, 0.2)",
                  ],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{
                  scale: 1.02,
                  rotate: 1,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Gradient border overlay */}
                <div 
                  className="absolute inset-0 rounded-[2rem_0.5rem_2rem_0.5rem] p-[2px]"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4, #9333ea, #06b6d4)",
                  }}
                >
                  <div 
                    className="w-full h-full rounded-[calc(2rem-2px)_calc(0.5rem-2px)_calc(2rem-2px)_calc(0.5rem-2px)] overflow-hidden"
                  >
                    <Image
                      src="/images/pImg.jpg" // Placeholder image
                      alt="Afroj Satwilkar"
                      layout="fill"
                      objectFit="cover"
                      className="scale-105 transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Text Content */}
          <motion.div 
            className="lg:col-span-3 flex flex-col space-y-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="p-8 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl"
              variants={fadeIn}
            >
              <h2 className="text-4xl lg:text-5xl font-extrabold text-cyan-400 mb-6">About Me</h2>
              <p className="text-lg text-neutral-300 leading-relaxed">
                {profileData.about}
              </p>
            </motion.div>
            
            {/* <motion.div 
              className="p-8 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl"
              variants={fadeIn}
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">My Skillset</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {profileData.skillSet?.map((skill, index) => (
                  <div 
                    key={index}
                    className="group flex flex-col items-center justify-center p-3 bg-neutral-800/70 border border-neutral-700 rounded-lg transition-all duration-300 hover:bg-cyan-400/10 hover:border-cyan-400/50"
                  >
                    <div className="mb-1.5">
                      {skillIconMap[skill.name.toLowerCase().replace(/\s/g, '')] || skillIconMap.default}
                    </div>
                    <p className="text-xs text-center font-semibold text-neutral-300 transition-colors duration-300">{skill.name}</p>
                  </div>
                ))}
              </div>
            </motion.div> */}

             <motion.div variants={fadeIn}>
                <a
                  href="/AFROJSATWILKAR_CV.pdf"
                  download="Afroj_Satwilkar_CV.pdf"
                  className="group mt-2 relative inline-flex items-center justify-center px-6 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-cyan-400 overflow-hidden transition-all duration-300 hover:text-black hover:shadow-cyan-400/50 hover:shadow-lg"
                >
                  <span className="absolute left-0 top-0 h-full w-0 bg-cyan-400 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                  <span className="relative z-10 flex items-center">
                    <Download size={20} className="mr-2" />
                    Download Resume
                  </span>
                </a>
             </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About; 