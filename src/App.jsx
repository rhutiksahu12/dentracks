import React from 'react';
import useJobFetcher from './hooks/useJobFetcher';


export default function App() {
  const { jobDetails, loading, hasMore, fetchMore } = useJobFetcher();

  

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Hacker News Job Listings
        </h1>
        <div className="space-y-6">
          {jobDetails.map((job, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
              <p className="text-gray-600 mb-4">Posted by: {job.by}</p>

              <a href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                View Job
              </a>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          {loading && (
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          )}
          {hasMore && !loading && (
            <button
              onClick={fetchMore}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Load More Jobs
            </button>
          )}
          {!hasMore && !loading && (
            <p className="text-gray-600 font-semibold">No more jobs to load.</p>
          )}
        </div>
      </div>
    </div >
  );
}