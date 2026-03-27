import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle, Calendar, AlertCircle, Wallet } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { ConfirmedMeetingCard } from '../../components/calendar/ConfirmedMeetingCard';
import { useAuth } from '../../context/AuthContext';
import { Entrepreneur } from '../../types';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';
import { confirmedMeetings } from '../../data/confirmedMeetings';
import { walletBalances } from '../../data/walletBalances';
import { isAfter, startOfToday, parseISO } from 'date-fns';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  
  if (!user) return null;
  
  // Get collaboration requests sent by this investor
  const sentRequests = getRequestsFromInvestor(user.id);
  const requestedEntrepreneurIds = sentRequests.map(req => req.entrepreneurId);
  
  // Get upcoming meetings for current user
  const upcomingMeetings = confirmedMeetings
    .filter((m) => m.participantIds.includes(user.id))
    .filter((m) => isAfter(parseISO(m.startTime), startOfToday()))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 2);

  // Get wallet balance
  const userWallet = walletBalances.find((wb) => wb.userId === user.id) || {
    userId: user.id,
    balance: 0,
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  };
  
  // Filter entrepreneurs based on search and industry filters
  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Industry filter
    const matchesIndustry = selectedIndustries.length === 0 || 
      selectedIndustries.includes(entrepreneur.industry);
    
    return matchesSearch && matchesIndustry;
  });
  
  // Get unique industries for filter
  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
  
  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prevSelected => 
      prevSelected.includes(industry)
        ? prevSelected.filter(i => i !== industry)
        : [...prevSelected, industry]
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-600">Find and connect with promising entrepreneurs</p>
        </div>
        
        <Link to="/entrepreneurs">
          <Button
            leftIcon={<PlusCircle size={18} />}
          >
            View All Startups
          </Button>
        </Link>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} />}
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <Badge
                  key={industry}
                  variant={selectedIndustries.includes(industry) ? 'primary' : 'gray'}
                  className="cursor-pointer"
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Users size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Total Startups</p>
                <h3 className="text-xl font-semibold text-primary-900">{entrepreneurs.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <PieChart size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Industries</p>
                <h3 className="text-xl font-semibold text-secondary-900">{industries.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Users size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Your Connections</p>
                <h3 className="text-xl font-semibold text-accent-900">
                  {sentRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Upcoming Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Featured Startups</h2>
            </CardHeader>
            
            <CardBody>
              {filteredEntrepreneurs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEntrepreneurs.slice(0, 4).map(entrepreneur => (
                    <EntrepreneurCard
                      key={entrepreneur.id}
                      entrepreneur={entrepreneur}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No startups match your filters</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedIndustries([]);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Upcoming Meetings Sidebar */}
        <div className="space-y-4">
          {/* Wallet Card */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Wallet</h2>
              <Link to="/wallet" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View
              </Link>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${userWallet.balance.toLocaleString('en-US', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
                <Link
                  to="/wallet"
                  className="block w-full text-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors"
                >
                  Manage Wallet
                </Link>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Meetings</h2>
              <Link to="/calendar" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </CardHeader>
            
            <CardBody>
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMeetings.map(meeting => (
                    <ConfirmedMeetingCard
                      key={meeting.id}
                      meeting={meeting}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Calendar size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No upcoming meetings</p>
                  <Link to="/calendar/requests" className="text-sm font-medium text-primary-600 hover:text-primary-500 mt-2 inline-block">
                    Request a meeting
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
