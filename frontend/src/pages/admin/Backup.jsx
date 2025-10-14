import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Download, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminGetBackupLogs, adminCreateBackup } from '@/services/api';
import { formatDateTime } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const Backup = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-backup-logs'],
    queryFn: () => adminGetBackupLogs(),
  });

  const createBackupMutation = useMutation({
    mutationFn: adminCreateBackup,
    onSuccess: () => {
      toast.success('Backup created successfully!');
      queryClient.invalidateQueries(['admin-backup-logs']);
    },
    onError: () => {
      toast.error('Failed to create backup');
    },
  });

  const logs = data?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>Database Backup - Admin - SpiceWyn</title>
      </Helmet>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold">Database Backup</h1>
          <Button
            onClick={() => createBackupMutation.mutate()}
            isLoading={createBackupMutation.isPending}
          >
            <Database className="w-5 h-5" />
            Backup Now
          </Button>
        </div>

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
                    <th className="text-left py-3 px-4">File Name</th>
                    <th className="text-center py-3 px-4">Type</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-center py-3 px-4">Date</th>
                    <th className="text-center py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 font-mono text-sm">{log.fileName}</td>
                      <td className="py-3 px-4 text-center capitalize">{log.type}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={log.status === 'completed' ? 'success' : log.status === 'failed' ? 'danger' : 'warning'}>
                          {log.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">{formatDateTime(log.createdAt)}</td>
                      <td className="py-3 px-4 text-center">
                        {log.fileUrl && log.status === 'completed' && (
                          <a
                            href={log.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary-600 hover:underline"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        )}
                      </td>
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

export default Backup;
