import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Users, UserPlus, Percent, TrendingUp, TrendingDown, Plus, Download } from "lucide-react";
import { TrafficChart, GeographicChart } from "@/components/Charts";
import VisitorTable from "@/components/VisitorTable";
import PixelManagement from "@/components/PixelManagement";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface DashboardStats {
  totalPageViews: number;
  uniqueVisitors: number;
  leadsCapture: number;
  conversionRate: number;
}

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated,
  });

  const { data: pixels = [], isLoading: pixelsLoading } = useQuery({
    queryKey: ["/api/tracking-pixels"],
    enabled: isAuthenticated,
  });

  const { data: visitors = [], isLoading: visitorsLoading } = useQuery({
    queryKey: ["/api/visitors", pixels[0]?.id],
    enabled: isAuthenticated && pixels.length > 0,
  });

  const { data: trafficData = [] } = useQuery({
    queryKey: ["/api/analytics/traffic", pixels[0]?.id],
    enabled: isAuthenticated && pixels.length > 0,
  });

  const { data: geoData = [] } = useQuery({
    queryKey: ["/api/analytics/geographic", pixels[0]?.id],
    enabled: isAuthenticated && pixels.length > 0,
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const dashboardStats: DashboardStats = stats || {
    totalPageViews: 0,
    uniqueVisitors: 0,
    leadsCapture: 0,
    conversionRate: 0,
  };

  const statCards = [
    {
      title: "Total Page Views",
      value: dashboardStats.totalPageViews.toLocaleString(),
      change: "+12.5%",
      trending: "up",
      icon: Eye,
      color: "blue",
    },
    {
      title: "Unique Visitors", 
      value: dashboardStats.uniqueVisitors.toLocaleString(),
      change: "+8.2%",
      trending: "up",
      icon: Users,
      color: "green",
    },
    {
      title: "Leads Captured",
      value: dashboardStats.leadsCapture.toLocaleString(),
      change: "+23.1%", 
      trending: "up",
      icon: UserPlus,
      color: "purple",
    },
    {
      title: "Conversion Rate",
      value: `${dashboardStats.conversionRate}%`,
      change: "-2.4%",
      trending: "down",
      icon: Percent,
      color: "yellow",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      yellow: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Analytics Dashboard
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Last 30 days</span>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Updated 2 minutes ago</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0 gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Pixel
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {statsLoading ? "..." : stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className={`flex items-center ${
                    stat.trending === "up" 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {stat.trending === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Page views and unique visitors over time</CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficChart data={trafficData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Visitor distribution by geographic location</CardDescription>
          </CardHeader>
          <CardContent>
            <GeographicChart data={geoData} />
          </CardContent>
        </Card>
      </div>

      {/* Visitor Data Table */}
      <div className="mb-8">
        <VisitorTable visitors={visitors} isLoading={visitorsLoading} />
      </div>

      {/* Tracking Pixels Management */}
      <PixelManagement
        pixels={pixels}
        onCreatePixel={() => {
          // TODO: Open create pixel modal
        }}
        onViewCode={(pixel) => {
          // TODO: Open code viewing modal
        }}
        onViewAnalytics={(pixel) => {
          // TODO: Navigate to pixel analytics
        }}
      />
    </div>
  );
}
