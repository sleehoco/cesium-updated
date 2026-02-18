'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toolCategories, getToolsByCategory } from '@/config/tools-config';
import { ArrowRight } from 'lucide-react';

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    'sky-500': { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400' },
    'blue-500': { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500' },
    'red-500': { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-500' },
    'purple-500': { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-500' },
    'green-500': { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-500' },
    'yellow-500': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-500' },
    'teal-500': { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-500' },
    'indigo-500': { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-500' },
};

export default function ToolsPage() {
    // Get all categories except "All Tools"
    const categories = toolCategories.filter(cat => cat !== 'All Tools');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <main>
            {/* Header - Dark */}
            <section className="bg-gradient-to-br from-black via-[#0A0A0A] to-[#121212] py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl lg:text-6xl font-bold text-white font-display mb-6">
                            Free AI-Powered <span className="text-violet-400">Security Tools</span>
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Leverage cutting-edge artificial intelligence to enhance your cybersecurity posture. Our suite of AI-powered tools provides real-time threat intelligence, vulnerability assessment, and security analysis.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Tools Section - Dark */}
            <section className="bg-black py-24">
                <div className="container mx-auto px-4">
                    {categories.map((category, categoryIndex) => {
                        const categoryTools = getToolsByCategory(category);

                        return (
                            <motion.div
                                key={category}
                                className="mb-16 last:mb-0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + categoryIndex * 0.1 }}
                            >
                                {/* Category Header */}
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2 font-display">
                                        {category}
                                    </h2>
                                    <div className="h-1 w-20 bg-violet-600"></div>
                                </div>

                                {/* Tools Grid for this Category */}
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {categoryTools.map((tool) => {
                                        const Icon = tool.icon;
                                        const isComingSoon = tool.status === 'coming-soon';

                                        return (
                                            <motion.div key={tool.id} variants={itemVariants}>
                                                <Card
                                                    className={`bg-[#121212] border-white/10 h-full flex flex-col group ${isComingSoon ? 'opacity-75' : 'hover:border-violet-500/30 transition-all duration-300'
                                                        }`}
                                                >
                                                    <CardHeader>
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className={`p-3 rounded-lg ${colorClasses[tool.color]?.bg ?? ''} border ${colorClasses[tool.color]?.border ?? ''}`}>
                                                                <Icon className={`h-8 w-8 ${colorClasses[tool.color]?.text ?? ''}`} />
                                                            </div>
                                                            {tool.status && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`${tool.status === 'new'
                                                                        ? 'border-green-500/50 text-green-400'
                                                                        : tool.status === 'beta'
                                                                            ? 'border-yellow-500/50 text-yellow-400'
                                                                            : 'border-gray-500/50 text-gray-400'
                                                                        }`}
                                                                >
                                                                    {tool.status === 'new' && 'New'}
                                                                    {tool.status === 'beta' && 'Beta'}
                                                                    {tool.status === 'coming-soon' && 'Coming Soon'}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <CardTitle className="text-white text-2xl mb-2 group-hover:text-violet-400 transition-colors">
                                                            {tool.name}
                                                        </CardTitle>
                                                        <CardDescription className="text-violet-400 font-semibold text-sm mb-3">
                                                            {tool.tagline}
                                                        </CardDescription>
                                                        <p className="text-gray-300 text-sm leading-relaxed">
                                                            {tool.description}
                                                        </p>
                                                    </CardHeader>

                                                    <CardContent className="flex-1 flex flex-col justify-between">
                                                        {/* Features */}
                                                        <div className="mb-6">
                                                            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                                                <span className="w-1 h-4 bg-violet-600"></span>
                                                                Key Features
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {tool.features.map((feature, index) => (
                                                                    <li key={index} className="text-gray-400 text-sm flex items-start gap-2">
                                                                        <span className="text-violet-400 mt-1">&bull;</span>
                                                                        <span>{feature}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* Action Button */}
                                                        {isComingSoon ? (
                                                            <Button
                                                                disabled
                                                                className="w-full bg-gray-600 text-gray-300 cursor-not-allowed"
                                                            >
                                                                Coming Soon
                                                            </Button>
                                                        ) : (
                                                            <Link href={tool.path} className="w-full">
                                                                <Button
                                                                    variant="accent"
                                                                    className="w-full"
                                                                >
                                                                    Launch Tool
                                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Info Section - Light */}
            <section className="bg-[#0A0A0A] py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="max-w-4xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-8 text-center font-display">Why AI-Powered Security?</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <h3 className="text-violet-500 font-semibold mb-2">Real-Time Analysis</h3>
                                <p className="text-gray-400 text-sm">
                                    Get instant insights powered by advanced AI models that process threats faster than traditional methods.
                                </p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-violet-500 font-semibold mb-2">Intelligent Prioritization</h3>
                                <p className="text-gray-400 text-sm">
                                    AI algorithms automatically prioritize threats based on severity, context, and potential impact.
                                </p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-violet-500 font-semibold mb-2">Continuous Learning</h3>
                                <p className="text-gray-400 text-sm">
                                    Our AI models are continuously updated with the latest threat intelligence and security patterns.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
