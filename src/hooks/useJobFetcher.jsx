import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const useJobFetcher = (listSize = 5) => {
    const [jobIds, setJobIds] = useState([]);
    const [jobDetails, setJobDetails] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const fetchingRef = useRef(false); // To prevent duplicate fetches

    const getJobDetails = async (id) => {
        return await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    };

    const fetchJobIds = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "https://hacker-news.firebaseio.com/v0/jobstories.json"
            );
            setJobIds(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error)
            setLoading(false);
        }
    }, []);

    const fetchJobDetails = useCallback(async () => {
        if (fetchingRef.current || currentIndex >= jobIds.length) return;

        fetchingRef.current = true;
        try {
            setLoading(true);
            const endIndex = Math.min(currentIndex + listSize, jobIds.length);
            const fetchJobDetails = jobIds.slice(currentIndex, endIndex).map(getJobDetails);
            const fetchJobResponses = await Promise.all(fetchJobDetails);
            const newDetails = fetchJobResponses.map(response => response.data);

            setJobDetails(prevDetails => [...prevDetails, ...newDetails]);
            setCurrentIndex(endIndex);
            setLoading(false);
            fetchingRef.current = false;
        } catch (error) {
            console.error(error)
            setLoading(false);
            fetchingRef.current = false;
        }
    }, [jobIds, currentIndex, listSize]);

    useEffect(() => {
        fetchJobIds();
    }, [fetchJobIds]);

    useEffect(() => {
        if (jobIds.length > 0 && jobDetails.length === 0) {
            fetchJobDetails();
        }
    }, [jobIds, fetchJobDetails]);

    return {
        jobDetails,
        loading,
        hasMore: currentIndex < jobIds.length,
        fetchMore: fetchJobDetails
    };
};

export default useJobFetcher;
