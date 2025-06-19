'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FileText, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

interface Publication {
  id: number;
  title: string;
  description: string;
  authors: string[];
  journal: string;
  year: number;
  link: string;
  type: 'journal' | 'conference' | 'preprint' | 'book';
}

const publications: Publication[] = [
  {
    id: 1,
    title: "Advanced Neural Network Architectures for Real-Time Processing",
    description: "This paper presents novel approaches to optimizing neural network architectures for real-time applications, focusing on edge computing scenarios and mobile deployment.",
    authors: ["Afroj Satwilkar", "Dr. Smith", "Dr. Johnson"],
    journal: "IEEE Transactions on Neural Networks",
    year: 2024,
    link: "https://example.com/paper1",
    type: "journal"
  },
  {
    id: 2,
    title: "Machine Learning Applications in Web Development",
    description: "A comprehensive study on integrating machine learning models into modern web applications, covering deployment strategies and performance optimization.",
    authors: ["Afroj Satwilkar", "Team Collaborators"],
    journal: "International Conference on Web Technologies",
    year: 2023,
    link: "https://example.com/paper2",
    type: "conference"
  },
  {
    id: 3,
    title: "Full-Stack Development with AI Integration",
    description: "A practical guide to building intelligent web applications that seamlessly integrate artificial intelligence capabilities across the entire technology stack.",
    authors: ["Afroj Satwilkar"],
    journal: "Tech Publishing House",
    year: 2023,
    link: "https://example.com/book",
    type: "book"
  }
];

const Publications = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'journal':
        return <FileText size={20} className="text-blue-400" />;
      case 'conference':
        return <Users size={20} className="text-green-400" />;
      case 'book':
        return <FileText size={20} className="text-purple-400" />;
      default:
        return <FileText size={20} className="text-cyan-400" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      journal: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      conference: 'bg-green-500/20 text-green-300 border-green-500/30',
      book: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      preprint: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[type as keyof typeof colors]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <section id="publications" className="relative text-white py-20 md:py-28 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              Research & <span className="text-cyan-400">Publications</span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              Explore my research contributions and published works in web development, 
              machine learning, and software engineering.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {publications.map((publication) => (
              <motion.div
                key={publication.id}
                variants={fadeIn}
                className="group relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden bg-neutral-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center">
                    {getTypeIcon(publication.type)}
                    <span className="ml-2 text-sm font-medium">Publication</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  {getTypeBadge(publication.type)}
                  <div className="flex items-center text-sm text-neutral-400">
                    <Calendar size={16} className="mr-1" />
                    {publication.year}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                  {publication.title}
                </h3>

                <p className="text-neutral-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {publication.description}
                </p>

                <div className="mb-4">
                  <p className="text-xs text-neutral-400 mb-1">Authors:</p>
                  <p className="text-sm text-neutral-300">
                    {publication.authors.join(', ')}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-neutral-400 mb-1">Published in:</p>
                  <p className="text-sm font-medium text-cyan-400">
                    {publication.journal}
                  </p>
                </div>

                <Link
                  href={publication.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:text-white transition-colors duration-300"
                >
                  <span>Read Publication</span>
                  <ExternalLink size={16} className="ml-2" />
                </Link>

                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeIn} className="text-center mt-12">
            <Link
              href="/publications"
              className="group relative inline-flex items-center justify-center px-8 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-cyan-400 overflow-hidden transition-all duration-300 hover:text-black hover:shadow-cyan-400/50 hover:shadow-lg"
            >
              <span className="absolute left-0 top-0 h-full w-0 bg-cyan-400 transition-all duration-300 ease-in-out group-hover:w-full"></span>
              <span className="relative z-10 flex items-center">
                <FileText size={20} className="mr-2" />
                View All Publications
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Publications; 