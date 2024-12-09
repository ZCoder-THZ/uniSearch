'use client';

import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';

function Page() {
  const { slug } = useParams();

  const getUniversity = async () => {
    const res = await axios.get(`/api/v1/universities/${slug}`);
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [slug, 'university'],
    queryFn: getUniversity,
    retry: 1,
  });

  return (
    <div className="col-4 w-3/4 mx-auto mt-32">
      {isLoading && <Loading />}
      {data && (
        <div>
          <h1>University Name: {data.university.name}</h1>
          <h2>Country: {data.university.country}</h2>
          <h3>
            Website:
            <a
              href={data.university.web_pages[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {data.university.web_pages[0]}
            </a>
          </h3>
          <p>
            <strong>Additional Info:</strong>
          </p>
          <p>{data.additionalInfo}</p>
        </div>
      )}
    </div>
  );
}

export default Page;

const Loading = () => (
  <div className="p-4">
    <Skeleton height={20} count={1} width={200} className="mb-4" />
    <Skeleton height={20} count={1} width={200} className="mb-4" />

    <Skeleton height={10} count={10} />
  </div>
);
