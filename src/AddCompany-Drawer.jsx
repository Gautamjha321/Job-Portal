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
      reset();
    }
  }, [dataAddCompany, fetchCompanies, reset]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-lg mx-auto">
        <DrawerHeader>
          <DrawerTitle className="text-center text-2xl font-bold">
            Add a New Company
          </DrawerTitle>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-6 pb-0"
        >
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Company Name</label>
            <Input placeholder="Enter company name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Company Logo</label>
            <Input
              type="file"
              accept="image/png, image/jpeg"
              className="file:text-gray-500"
              {...register("logo")}
            />
            {errors.logo && (
              <p className="text-red-500 text-sm">{errors.logo.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="destructive"
            className="w-full sm:w-48 self-center"
          >
            Add Company
          </Button>

          {errorAddCompany?.message && (
            <p className="text-red-500 text-sm text-center">
              {errorAddCompany?.message}
            </p>
          )}
          {loadingAddCompany && (
            <div className="flex justify-center py-2">
              <BarLoader width="100%" color="#36d7b7" />
            </div>
          )}
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
