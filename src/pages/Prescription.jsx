import React, { useEffect, useState } from 'react';
import { apiGET } from '../utilities/apiHelpers';
import { useSelector } from 'react-redux';
import PrescriptionCard from '../components/presecription/PrescriptionCard';

function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const usersid = useSelector(state => state?.user?.userData?.id) || "";
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await apiGET(`v1/prescription/get-prescription-by-user/${usersid}`);
        setPrescriptions(response?.data?.data?.data || []);
      } catch (error) {
        setError('There was an error fetching the prescription data!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [usersid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
        {prescriptions?.map((item, index) => (
          <PrescriptionCard item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Prescription;
