"use client"
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCustomers } from '@/store/slices/customerSlice/customerThunks';
import React, { useEffect } from 'react'
import { GetAllArea } from '../areas/GetAllArea';

const GetAllCustomer = () => {
      const dispatch = useAppDispatch();
      const { isFetchedCustomer} = useAppSelector((s) => s.customers);
    
      useEffect(() => {
        if (!isFetchedCustomer) dispatch(fetchCustomers());
      }, [dispatch, isFetchedCustomer]);
    
  return (
    <GetAllArea/>
  )
}

export default GetAllCustomer