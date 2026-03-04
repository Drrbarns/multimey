'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface CourseRegistration {
  id: string;
  registration_id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  course_title: string;
  amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_reference: string | null;
  created_at: string;
}

export default function CourseRegistrationsPage() {
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, revenue: 0 });

  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('course_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const list = (data || []) as CourseRegistration[];
      setRegistrations(list);
      setStats({
        total: list.length,
        paid: list.filter((r) => r.payment_status === 'paid').length,
        pending: list.filter((r) => r.payment_status === 'pending').length,
        revenue: list.filter((r) => r.payment_status === 'paid').reduce((sum, r) => sum + Number(r.amount), 0),
      });
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const filteredRegistrations = registrations.filter((r) => {
    const matchesFilter = filter === 'all' || r.payment_status === filter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.registration_id.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      failed: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'paid' ? 'bg-green-500' : status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Registrations</h1>
          <p className="text-gray-500 text-sm mt-0.5">1v1 Online Importation Class sign-ups</p>
        </div>
        <button
          onClick={fetchRegistrations}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          <i className="ri-refresh-line"></i> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Registrations', value: stats.total, icon: 'ri-user-add-line', color: 'text-blue-600 bg-blue-50' },
          { label: 'Paid', value: stats.paid, icon: 'ri-checkbox-circle-line', color: 'text-green-600 bg-green-50' },
          { label: 'Pending Payment', value: stats.pending, icon: 'ri-time-line', color: 'text-amber-600 bg-amber-50' },
          { label: 'Total Revenue', value: `GH₵${stats.revenue.toFixed(2)}`, icon: 'ri-money-dollar-circle-line', color: 'text-purple-600 bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <i className={`${stat.icon} text-xl`}></i>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            {(['all', 'paid', 'pending', 'failed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading registrations...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-12 text-center">
            <i className="ri-user-add-line text-4xl text-gray-300 mb-3 block"></i>
            <p className="text-gray-500 font-medium">No registrations found</p>
            <p className="text-gray-400 text-sm">Registrations will appear here once students sign up</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-gray-900 text-sm">{reg.full_name}</p>
                      <p className="text-xs text-gray-500">{reg.email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{reg.phone}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{reg.location}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">GH₵{Number(reg.amount).toFixed(2)}</td>
                    <td className="px-4 py-3.5">{statusBadge(reg.payment_status)}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(reg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400 max-w-[100px] truncate font-mono">
                      {reg.registration_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredRegistrations.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {filteredRegistrations.length} of {registrations.length} registration{registrations.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
