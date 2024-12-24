import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from '../../../components/ui/FormField';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { Plus, Trash2 } from 'lucide-react';

interface CustomEventBuilderProps {
  onSave: (config: any) => void;
}

export const CustomEventBuilder: React.FC<CustomEventBuilderProps> = ({ onSave }) => {
  const [conditions, setConditions] = useState<any[]>([]);
  const { register, handleSubmit } = useForm();

  const addCondition = () => {
    setConditions([...conditions, { type: 'click', target: '', score: 1 }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const onSubmit = (data: any) => {
    const config = {
      ...data,
      conditions,
      type: 'custom'
    };
    onSave(config);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Nome do Evento"
            name="eventName"
            register={register('eventName', { required: true })}
            placeholder="Ex: Clique no Botão CTA"
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Condições de Disparo</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCondition}
                icon={<Plus className="w-4 h-4" />}
              >
                Adicionar Condição
              </Button>
            </div>

            {conditions.map((condition, index) => (
              <div key={index} className="flex items-center space-x-4">
                <select
                  value={condition.type}
                  onChange={(e) => {
                    const newConditions = [...conditions];
                    newConditions[index] = {
                      ...condition,
                      type: e.target.value
                    };
                    setConditions(newConditions);
                  }}
                  className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="click">Clique</option>
                  <option value="scroll">Rolagem</option>
                  <option value="hover">Hover</option>
                  <option value="time">Tempo na Página</option>
                </select>

                <input
                  type="text"
                  value={condition.target}
                  onChange={(e) => {
                    const newConditions = [...conditions];
                    newConditions[index] = {
                      ...condition,
                      target: e.target.value
                    };
                    setConditions(newConditions);
                  }}
                  placeholder="Seletor CSS ou valor"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />

                <input
                  type="number"
                  value={condition.score}
                  onChange={(e) => {
                    const newConditions = [...conditions];
                    newConditions[index] = {
                      ...condition,
                      score: parseInt(e.target.value)
                    };
                    setConditions(newConditions);
                  }}
                  placeholder="Pontuação"
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />

                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeCondition(index)}
                  icon={<Trash2 className="w-4 h-4" />}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Salvar Evento Personalizado
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};