import React from 'react';
import { LineChart, BarChart, Users, Mail, Clock, AlertCircle } from 'lucide-react';
import { EmailStats } from '../types';

const mockStats: EmailStats = {
  delivered: 1250,
  opened: 856,
  clicked: 432,
  bounced: 23,
  spam: 5,
  timeSeries: Array.from({ length: 7 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    delivered: Math.floor(Math.random() * 200) + 100,
    opened: Math.floor(Math.random() * 150) + 50,
    clicked: Math.floor(Math.random() * 100),
  })),
};

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">EmailFlow Pro</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Delivered"
            value={mockStats.delivered}
            icon={<Mail className="h-6 w-6" />}
            trend="+12.5%"
          />
          <StatCard
            title="Open Rate"
            value={`${((mockStats.opened / mockStats.delivered) * 100).toFixed(1)}%`}
            icon={<Users className="h-6 w-6" />}
            trend="+5.2%"
          />
          <StatCard
            title="Click Rate"
            value={`${((mockStats.clicked / mockStats.delivered) * 100).toFixed(1)}%`}
            icon={<LineChart className="h-6 w-6" />}
            trend="+3.1%"
          />
          <StatCard
            title="Bounce Rate"
            value={`${((mockStats.bounced / mockStats.delivered) * 100).toFixed(1)}%`}
            icon={<AlertCircle className="h-6 w-6" />}
            trend="-1.2%"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Campaigns</h2>
            <div className="space-y-4">
              {[
                { name: 'Welcome Series', status: 'active', sent: 450, opens: 320 },
                { name: 'Product Launch', status: 'scheduled', sent: 0, opens: 0 },
                { name: 'Newsletter #12', status: 'completed', sent: 1200, opens: 840 },
              ].map((campaign) => (
                <div key={campaign.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{campaign.name}</h3>
                    <span className="text-sm text-gray-500">
                      {campaign.status === 'active' && <span className="text-green-500">● Active</span>}
                      {campaign.status === 'scheduled' && <span className="text-blue-500">◆ Scheduled</span>}
                      {campaign.status === 'completed' && <span className="text-gray-500">✓ Completed</span>}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{campaign.sent} sent</div>
                    <div className="text-sm text-gray-500">{campaign.opens} opens</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Schedules</h2>
            <div className="space-y-4">
              {[
                { name: 'Monthly Newsletter', time: '2024-03-15 09:00', recipients: 2500 },
                { name: 'Product Update', time: '2024-03-18 14:30', recipients: 1800 },
                { name: 'Customer Survey', time: '2024-03-20 10:00', recipients: 3000 },
              ].map((schedule) => (
                <div key={schedule.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h3 className="font-medium">{schedule.name}</h3>
                      <span className="text-sm text-gray-500">{schedule.time}</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{schedule.recipients.toLocaleString()} recipients</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string | number; icon: React.ReactNode; trend: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="text-gray-500">{icon}</div>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
}