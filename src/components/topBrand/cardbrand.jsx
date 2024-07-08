import React, { useRef, useState } from 'react';
function Cardbrand({item,index,onClick})
 {
  return (
    <div key={index} className='max-w-[199px] max-h-[199px] rounded-[16px]  cursor-pointer relative'>
            <img  onClick={onClick} src={item.src} width='80%' height='80%' alt={`brand-${index + 1}`} />
           
    </div>
  );
  
}

export default Cardbrand;
