'use client';

import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

function Page() {
  const { slug } = useParams();

  const getUniversity = async () => {
    const res = await axios.get(`/api/v1/universities/${slug}`);
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [slug, 'university', 1],
    queryFn: getUniversity,
  });

  console.log(data, slug);

  return (
    <div className="col-4 w-3/4 mx-auto mt-32">
      {isLoading && <div>Loading...</div>}
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
