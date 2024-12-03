'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/ModeToggle';
import { Input } from '@/components/ui/input';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

type University = {
  id: number;
  name: string;
  web_pages: string[];
  alpha_two_code: string;
  state_province: string | null;
  domains: string[];
  country: string;
};

const fetchUniversities = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: any;
}) => {
  const [, search] = queryKey;
  const response = await axios.get(
    `http://localhost:4000/university?page=${pageParam}&limit=12&search=${search}`
  );
  return response.data;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Page() {
  const [search, setSearch] = useState('');
  const { ref, inView } = useInView({
    threshold: 0.2,
    rootMargin: '0px 0px -200px 0px',
  });

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(
      ['universities', search],
      ({ pageParam }) =>
        fetchUniversities({ pageParam, queryKey: ['universities', search] }),
      {
        getNextPageParam: (lastPage) => {
          const nextPage = lastPage.meta.currentPage + 1;
          return nextPage <= lastPage.meta.totalPages ? nextPage : undefined;
        },
      }
    );

  // Trigger fetch with delay when inView is true
  if (inView && hasNextPage && !isFetchingNextPage) {
    delay(500).then(() => fetchNextPage());
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Uni Search</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />

              <ModeToggle />
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="w-1/4">
            <Input
              type="text"
              placeholder="Search for universities"
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            {data?.pages.map((page) =>
              page.data.map((university: University, index: number) => (
                <div
                  key={university.id}
                  ref={
                    index === page.data.length - 1 && hasNextPage ? ref : null
                  }
                  className="relative group aspect-video rounded-xl bg-muted/50 overflow-hidden"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt={`${university.name}`}
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full"
                  />
                  <div className="overlay absolute inset-0 bg-gray-800 bg-opacity-50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                    <p className="text-lg font-medium">{university.name}</p>
                    <p className="text-sm mt-2">
                      Country:{' '}
                      <a
                        href={`https://www.google.com/search?q=${university.country}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {university.country}
                      </a>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 justify-center">
                      {university.web_pages.map((webPage, index) => (
                        <a
                          key={index}
                          href={webPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline"
                        >
                          Visit Website
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {(isFetching || isFetchingNextPage) && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}
          {!hasNextPage && <p>No more universities to load.</p>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
