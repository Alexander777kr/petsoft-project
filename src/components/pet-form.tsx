'use client';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { usePetContext } from '@/lib/hooks';
import PetFormBtn from './pet-form-btn';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type PetFormProps = {
  actionType: 'add' | 'edit';
  onFormSubmission: () => void;
};

const petFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Name is required' }).max(100),
    ownerName: z
      .string()
      .trim()
      .min(1, { message: 'Owner name is required' })
      .max(100),
    imageUrl: z.union([
      z.literal(''),
      z.string().trim().url({ message: 'Image url must be a valid url' }),
    ]),
    age: z.coerce.number().int().positive().max(99999),
    notes: z.union([z.literal(''), z.string().trim().max(1000)]),
  })
  .transform((data) => ({
    ...data,
    imageUrl:
      data.imageUrl ||
      'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
  }));

type TPetForm = z.infer<typeof petFormSchema>;

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { handleAddPet, handleEditPet, selectedPet } = usePetContext();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
  });

  return (
    <form
      action={async (formData) => {
        const result = await trigger();
        if (!result) return;
        onFormSubmission();
        const petData = getValues();

        if (actionType === 'add') {
          await handleAddPet(petData);
        } else if (actionType === 'edit') {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register('name')}
            // type="text"
            // defaultValue={actionType === 'edit' ? selectedPet?.name : ''}
            // required
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner name</Label>
          <Input
            id="ownerName"
            {...register('ownerName')}
            // name="ownerName"
            // type="text"
            // required
            //defaultValue={actionType === 'edit' ? selectedPet?.ownerName : ''}
          />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            {...register('imageUrl')}
            // name="imageUrl"
            // type="text"
            // defaultValue={actionType === 'edit' ? selectedPet?.imageUrl : ''}
          />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            {...register('age')}
            // name="age"
            // type="number"
            // required
            // defaultValue={actionType === 'edit' ? selectedPet?.age : ''}
          />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            //   name="notes"
            //   rows={3}
            //   required
            //   defaultValue={actionType === 'edit' ? selectedPet?.notes : ''}
          />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>
      <PetFormBtn actionType={actionType} />
    </form>
  );
}
