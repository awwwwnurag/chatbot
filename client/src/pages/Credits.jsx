import React from 'react'
import Loading from './Loading';
import { useEffect, useState } from 'react';
import { dummyPlans } from '../data/dummyData';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { PricingTableFour } from '../components/billingsdk/pricing-table-four';
import { plans } from '../components/billingsdk/billingsdk-config';

const Credits = () => {
  const[plansData,setPlansData]=useState([]);
  const[loading,setLoading]=useState(true);
  const {token,axios} = useAppContext()

  const fetchPlans=async()=>{
    try{
      const {data} = await axios.get('/api/credit/plan', {
        headers: {Authorization : token}

      })
      if (data.success){
        setPlansData(data.plans)
      }else{
        toast.error(data.message || 'Failed to fetch plans')
      }

    }catch(error){
      toast.error(error.message)

    }
    setLoading(false)
  }
  ///for purchaisng pro plans etc
  const PurchasePlan = async(planId)=>{
    try{
      const {data} = await axios.post('/api/credit/purchase', {planId},{headers:{Authorization: token }})
      if (data.success){
        window.location.href = data.url
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }

  }
  useEffect(()=>{
    fetchPlans();
  },[]);
  if (loading) return <Loading/>



  return (
    <div className="h-full py-12 px-4 overflow-y-auto custom-scrollbar">
      <PricingTableFour
        plans={plans}
        title="Choose Your Perfect Plan"
        description="Transform your project with our comprehensive pricing options designed for every need."
        subtitle="Simple Pricing"
        onPlanSelect={(planId) => PurchasePlan(planId)}
        size="medium"
        theme="classic"
        showBillingToggle={false}
        className="max-w-6xl mx-auto"
      />
    </div>
  )
}


export default Credits
