import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { User } from '../../types';

interface TrainerAssignmentProps {
  trainers: User[];
  members: User[];
  onAssign: (memberId: string, trainerId: string) => Promise<void>;
  onUnassign: (memberId: string) => Promise<void>;
  loading: boolean;
}

export const TrainerAssignment = ({
  trainers,
  members,
  onAssign,
  onUnassign,
  loading
}: TrainerAssignmentProps) => {
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [selectedTrainer, setSelectedTrainer] = useState<string>('');

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssignment = async () => {
    if (selectedMember && selectedTrainer) {
      await onAssign(selectedMember, selectedTrainer);
      setSelectedMember('');
      setSelectedTrainer('');
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">تعيين المدربين</h3>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="البحث عن متدرب..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المتدرب
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            >
              <option value="">اختر متدرب</option>
              {filteredMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المدرب
            </label>
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            >
              <option value="">اختر مدرب</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          onClick={handleAssignment}
          disabled={!selectedMember || !selectedTrainer}
          className="w-full"
        >
          تعيين المدرب
        </Button>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">التعيينات الحالية</h4>
        <div className="space-y-2">
          {members
            .filter(member => member.trainerId)
            .map(member => {
              const trainer = trainers.find(t => t.id === member.trainerId);
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      المدرب: {trainer?.name}
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onUnassign(member.id)}
                  >
                    إلغاء التعيين
                  </Button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};