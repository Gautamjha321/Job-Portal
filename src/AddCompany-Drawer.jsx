import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UseFetch from '@/Hooks/use-fetch';
import { addNewCompany } from '@/Api/api';
import { BarLoader } from 'react-spinners';

const schema = z.object({
  name: z.string().min(1, 'Company name is required'),
  logo: z.any().refine(
    (file) => file && file[0] && (file[0].type === 'image/png' || file[0].type === 'image/jpeg'),
    { message: 'Logo must be a PNG or JPEG image' }
  ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = UseFetch(addNewCompany);

  const onSubmit = (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
      reset();  // clear form after successful submit
    }
  }, [dataAddCompany, fetchCompanies, reset]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">Add Company</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='flex gap-2 p-4 pb-0'>
          <Input placeholder="Company name" {...register("name")} />
          <Input type='file' accept="image/*" className="file:text-gray-500" {...register("logo")} />
          <Button type="submit" variant="destructive" className="w-40">Add</Button>
        </form>

        {errors.name && <p className='text-red-500 text-sm px-4'>{errors.name.message}</p>}
        {errors.logo && <p className='text-red-500 text-sm px-4'>{errors.logo.message}</p>}
        {errorAddCompany?.message && <p className='text-red-500 text-sm px-4'>{errorAddCompany?.message}</p>}
        {loadingAddCompany && <BarLoader width={"100%"} color='#36d7b7' />}

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
