import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { adminGetTickets } from '@/services/api';
import { formatDate, getStatusColor } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const Tickets = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: () => adminGetTickets(),
  });

  const tickets = data?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>Support Tickets - Admin - SpiceWyn</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-display font-bold mb-6">Support Tickets</h1>

        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left py-3 px-4">Ticket #</th>
                    <th className="text-left py-3 px-4">Subject</th>
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-center py-3 px-4">Category</th>
                    <th className="text-center py-3 px-4">Priority</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-center py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 font-semibold">{ticket.ticketNumber}</td>
                      <td className="py-3 px-4">{ticket.subject}</td>
                      <td className="py-3 px-4">{ticket.user?.name || ticket.guestEmail}</td>
                      <td className="py-3 px-4 text-center capitalize">{ticket.category}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={ticket.priority === 'urgent' ? 'danger' : 'warning'}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">{formatDate(ticket.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Tickets;
