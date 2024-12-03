'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import axios from 'axios';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/ModeToggle';
import { Input } from '@/components/ui/input';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';

type University = {
  id: number;
  name: string;
  web_pages: string[];
  alpha_two_code: string;
  state_province: string | null;
  domains: string[];
  country: string;
};

export default function Page() {
  const [text, setText] = useState<string>('');
  const [data, setData] = useState<University[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchUniversities = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/university?page=${page}&limit=10`
      );

      const result = response.data;
      setData((prevData) => [...prevData, ...result.data]);
      setHasMore(page < result.meta.totalPages);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 200
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
              <ModeToggle />
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="w-1/4">
            <Input
              type="email"
              placeholder="Search"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            {data.map((university) => (
              <div
                key={university.id}
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
            ))}
          </div>
          {loading && <p>Loading...</p>}
          {!hasMore && <p>No more universities to load.</p>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
