import CarDetailPage from '@/components/car/CarDetailPage';
import React from 'react'



export default function page({ params }: { params: { id: string } }) {
  return (
    <div>
      <CarDetailPage id={params.id}/>
    </div>
  );
}
