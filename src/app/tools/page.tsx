'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toolCategories, getToolsByCategory } from '@/config/tools-config';
import { ArrowRight, Sparkles } from 'lucide-react';

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
        <main className="min-h-screen bg-gradient-to-b from-cyber-dark via-cyber to-cyber-light">
            <section className="container mx-auto px-4 py-20">
                {/* Header */}
                <motion.div
                    className="text-center max-w-4xl mx-auto mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-3 mb-6">
                        <Sparkles className="h-12 w-12 text-cesium" />
                        <h1 className="text-5xl lg:text-6xl font-bold text-white font-[var(--font-orbitron)] bg-gradient-to-r from-white via-cesium to-white bg-clip-text text-transparent">
                            AI-Powered Security Tools
                        </h1>
                    </div>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        Leverage cutting-edge artificial intelligence to enhance your cybersecurity posture. Our suite of AI-powered tools provides real-time threat intelligence, vulnerability assessment, and security analysis.
                    </p>
                </motion.div>

                {/* Categories with Tools */}
                {categories.map((category, categoryIndex) => {
                    const categoryTools = getToolsByCategory(category);

                    return (
                        <motion.div
                            key={category}
                            className="mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + categoryIndex * 0.1 }}
                        >
                            {/* Category Header */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2 font-[var(--font-orbitron)]">
                                    <span className="text-cesium">{'// '}</span>{category}
                                </h2>
                                <div className="h-1 w-20 bg-cesium"></div>
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
                                    className={`bg-cyber-light/50 border-cesium/20 backdrop-blur-xl shadow-2xl hover:shadow-cesium/20 transition-all duration-300 h-full flex flex-col group ${isComingSoon ? 'opacity-75' : 'hover:scale-[1.02]'
                                        }`}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-lg bg-${tool.color}/10 border border-${tool.color}/30 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className={`h-8 w-8 text-${tool.color}`} />
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
                                                    {tool.status === 'new' && '🆕 New'}
                                                    {tool.status === 'beta' && '🧪 Beta'}
                                                    {tool.status === 'coming-soon' && '🚧 Coming Soon'}
                                                </Badge>
                                            )}
                                        </div>

                                        <CardTitle className="text-white text-2xl mb-2 group-hover:text-cesium transition-colors">
                                            {tool.name}
                                        </CardTitle>
                                        <CardDescription className="text-cesium font-semibold text-sm mb-3">
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
                                                <span className="w-1 h-4 bg-cesium"></span>
                                                Key Features
                                            </h4>
                                            <ul className="space-y-2">
                                                {tool.features.map((feature, index) => (
                                                    <li key={index} className="text-gray-400 text-sm flex items-start gap-2">
                                                        <span className="text-cesium mt-1">•</span>
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
                                                    variant="gold"
                                                    className="w-full group-hover:scale-105 transition-transform duration-300"
                                                >
                                                    Launch Tool
                                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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

                {/* Info Section */}
                <motion.div
                    className="mt-20 max-w-4xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="bg-gradient-to-br from-cesium/10 to-cesium/5 border-cesium/30 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white text-2xl">Why AI-Powered Security?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6 text-gray-300">
                                <div>
                                    <h3 className="text-cesium font-semibold mb-2">⚡ Real-Time Analysis</h3>
                                    <p className="text-sm">
                                        Get instant insights powered by advanced AI models that process threats faster than traditional methods.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-cesium font-semibold mb-2">🎯 Intelligent Prioritization</h3>
                                    <p className="text-sm">
                                        AI algorithms automatically prioritize threats based on severity, context, and potential impact.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-cesium font-semibold mb-2">🔄 Continuous Learning</h3>
                                    <p className="text-sm">
                                        Our AI models are continuously updated with the latest threat intelligence and security patterns.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </section>
        </main>
    );
}
