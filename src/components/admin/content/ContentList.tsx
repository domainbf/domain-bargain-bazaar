import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Save, X } from 'lucide-react';

interface ContentListProps {
  settings: any[];
  editingId: string | null;
  editValue: string;
  setEditValue: (value: string) => void;
  setEditingId: (id: string | null) => void;
  handleSave: (id: string) => void;
}

const ContentList = ({
  settings,
  editingId,
  editValue,
  setEditValue,
  setEditingId,
  handleSave
}: ContentListProps) => {
  return (
    <div className="grid gap-4">
      {settings?.map((setting) => (
        <div key={setting.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-white">{setting.key}</h3>
              <p className="text-sm text-gray-400">{setting.type}</p>
            </div>
            {editingId === setting.id ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSave(setting.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-1" />
                  保存
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingId(null)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  取消
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingId(setting.id);
                  setEditValue(setting.value);
                }}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                编辑
              </Button>
            )}
          </div>
          {editingId === setting.id ? (
            setting.type === 'html' ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="min-h-[100px] bg-white/10 border-white/20 text-white"
              />
            ) : (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            )
          ) : (
            <div className="text-gray-300 whitespace-pre-wrap">
              {setting.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContentList;