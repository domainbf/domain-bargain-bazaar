import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContentFormProps {
  newSetting: {
    key: string;
    value: string;
    type: string;
  };
  setNewSetting: (setting: any) => void;
  handleCreate: () => void;
}

const ContentForm = ({ newSetting, setNewSetting, handleCreate }: ContentFormProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="键名（例如：site_title）"
          value={newSetting.key}
          onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
          className="bg-white/10 border-white/20 text-white"
        />
        <Select
          value={newSetting.type}
          onValueChange={(value) => setNewSetting(prev => ({ ...prev, type: value }))}
        >
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">文本</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="image">图片</SelectItem>
            <SelectItem value="link">链接</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          添加
        </Button>
      </div>
      <Textarea
        placeholder="内容值"
        value={newSetting.value}
        onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
        className="bg-white/10 border-white/20 text-white"
      />
    </div>
  );
};

export default ContentForm;