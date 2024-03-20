"use client";

import React, { useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AlbumArtwork } from "./album-artwork";
import { Album } from "../data/schema";
import { queryGallery } from "../data/query";
import useSWR from "swr";
import {
  PaginationState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTablePagination } from "../../tasks/components/data-table-pagination";
import { Search } from "./Search";
import { Separator } from "@/components/ui/separator";
import { useSearchKey } from "@/atoms/searchKey";

export const GalleryList = ({
  initialData,
}: {
  initialData?: {
    list: Album[];
    totalCount: number;
  };
}) => {
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 50,
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const searchKey = useSearchKey();

  const { data, error, mutate } = useSWR(`/api/gallery`, () =>
    queryGallery({
      pagination: {
        pageIndex: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      },
      searchKey,
    })
  );

  const pageCount = useMemo(() => {
    return Math.ceil((data?.totalCount ?? 0) / pagination.pageSize);
  }, [data, pagination]);

  const table = useReactTable({
    data: data?.list ?? [],
    columns: [],
    manualPagination: true,
    state: {
      pagination,
    },
    pageCount,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <Search
        onSearch={() => {
          table.setPagination({ pageIndex: 0, pageSize: 50 });
          mutate();
        }}
      />
      <Separator className="my-4" />
      <div className="relative">
        <div className="space-y-4">
          <ScrollArea className="h-[600px] w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-14">
              {data?.list.map((album) => (
                <AlbumArtwork
                  key={album.name}
                  album={album}
                  className="w-[220px] h-[120px]"
                  width={220}
                  height={120}
                  pagination={pagination}
                />
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
          <DataTablePagination table={table} />
        </div>{" "}
      </div>
    </>
  );
};
