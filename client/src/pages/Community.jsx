import React from 'react'
import { useState,useEffect } from 'react'
import Loading from './Loading'
import { dummyPublishedImages } from '../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'motion/react';

const Community = () => {
  const [images,setImages]=useState([]);
  const[loading,setLoading]=useState(true);
  const[refreshing,setRefreshing]=useState(false);

  const fetchImages=async()=>{
    try{
      const {data} = await axios.get('/api/user/published-images')
      if (data.success){
        setImages(data.images)
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh=()=>{
    setRefreshing(true);
    fetchImages();
  }

  useEffect(()=>{
    fetchImages();
  },[]);

  if (loading) return <Loading/>
   


  return (
    <div className='p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-medium text-[var(--text-main)]'>Community Ideas</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className='px-4 py-2 text-sm text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {refreshing ? (
            <>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              Refreshing...
            </>
          ) : (
            <>
              🔄 Refresh
            </>
          )}
        </button>
      </div>
      {images.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {images.map((item, index) => (
            <motion.a 
              key={index} 
              href={item.imageUrl} 
              target='_blank' 
              whileHover={{ 
                scale: 1.05,
                rotateX: 5,
                rotateY: -5,
                z: 50
              }}
              initial={{ perspective: 1000 }}
              className='relative group block liquid-glass col-hover rounded-2xl overflow-hidden aspect-square border-slate-200 dark:border-white/5 shadow-xl shadow-black/5 cursor-target'
            >
              <img
                src={item.imageUrl} 
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBWODBIODBWNjBaIiBmaWxsPSIjOUI0MjQyIi8+CjxwYXRoIGQ9Ik04MCA5MEgxMjBWMTA4SDgwVjkwWiIgZmlsbD0iIzlCNDI0MiIvPgo8L3N2Zz4K';
                }}
                className='w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110'/>
                
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6'>
                  <p className='text-white text-sm font-bold tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75'>
                    @{item.userName || "Creator"}
                  </p>
                  <p className='text-white/60 text-[10px] font-semibold uppercase tracking-widest mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100'>
                    View High Res
                  </p>
                </div>
            </motion.a>
          ))}
        </div>  
      ) : (
        <div className='text-center mt-20 p-12 liquid-glass rounded-3xl'>
          <p className='text-[var(--text-main)] text-xl font-medium mb-4'>No community masterpieces yet.</p>
          <p className='text-sm text-[var(--text-muted)]'>
            Generate something magical in chat and publish it to the world!
          </p>
        </div>
      )}
    </div>
  )
}

export default Community
