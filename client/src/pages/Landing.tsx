import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Globe, FileText, TrendingUp, Shield, Code, Zap } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track page views, visitor behavior, and engagement metrics in real-time."
    },
    {
      icon: Users,
      title: "Visitor Insights",
      description: "Capture detailed visitor information including location, device, and browsing patterns."
    },
    {
      icon: Globe,
      title: "Geographic Data",
      description: "Visualize your audience distribution with detailed geographic analytics."
    },
    {
      icon: FileText,
      title: "Lead Generation",
      description: "Create custom forms and capture leads directly through your tracking pixels."
    },
    {
      icon: Code,
      title: "Easy Integration",
      description: "Simple JavaScript tracking pixel that works with any website or platform."
    },
    {
      icon: Shield,
      title: "GDPR Compliant",
      description: "Built-in privacy controls and cookie consent management for compliance."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">PixelTrack</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.href = '/login'}>
                Sign In
              </Button>
              <Button onClick={() => window.location.href = '/register'}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Advanced Website Analytics
            <span className="block text-primary-600">& Lead Generation</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Track visitors, capture leads, and gain insights with our powerful pixel-based analytics platform. 
            GDPR compliant and easy to integrate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = '/register'}>
              <Zap className="h-5 w-5 mr-2" />
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/login'}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to understand your audience
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Powerful analytics tools designed for modern websites and marketing teams
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Trusted by thousands of websites worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10M+</div>
              <div className="text-primary-100">Page views tracked daily</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-primary-100">Active websites</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-primary-100">Uptime guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to start tracking your visitors?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of websites using PixelTrack for advanced analytics and lead generation.
          </p>
          <Button size="lg" onClick={() => window.location.href = '/api/login'}>
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                <BarChart3 className="text-white text-xs" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">PixelTrack</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 PixelTrack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
