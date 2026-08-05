"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAreas } from "@/store/slices/areaSlice/areaThunks";

export function GetAllArea() {
  const dispatch = useAppDispatch();
  const { isFetchedArea } = useAppSelector((s) => s.areas);

  useEffect(() => {
    if (!isFetchedArea) dispatch(fetchAreas());
  }, [dispatch, isFetchedArea]);



  return (
    null
  )
}
