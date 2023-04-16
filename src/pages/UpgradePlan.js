import React, {useEffect, useState} from 'react'
import MenuBar from './components/Navbar'
import Basic from './components/pricingoffers/Basic'
import Free from './components/pricingoffers/Free'
import Pro from './components/pricingoffers/Pro'
import { Link } from 'react-router-dom'

export default function UpgradePlan() {

    const [urlParams, setUrlParams] = useState(window.location.href.split('?')[1])
    const [currentPlan, setCurrentPlan] = useState('Free')
    const [fromApp, setFromApp] = useState(false)
    const [billingPeriod,setBillingPeriod] = useState('yr')
    const [monthlyStatus,setMonthlyStatus] = useState('btn-outline-secondary')
    const [yearlyStatus,setYearlyStatus] = useState('btn-primary')
    const [pricing,setPricing] = useState({
        free: {
            monthly:0,
            yearly:0
        },
        standard: {
            monthly:10,
            yearly:100
        },
        pro: {
            monthly:15,
            yearly:150
        },
        })


    function handleSetToMonth() {
        setBillingPeriod('mo')
        setMonthlyStatus('btn-primary')
        setYearlyStatus('btn-outline-secondary')
    }

    function handleSetToYear() {
        setBillingPeriod('yr')
        setMonthlyStatus('btn-outline-secondary')
        setYearlyStatus('btn-primary')
    }


    useEffect(() => {
        if (urlParams) {
            if (urlParams.includes('fromApp=true')) {
                setFromApp(true)
            }
            if (urlParams.includes('currentPlan=pro')) {
                setCurrentPlan('Pro')
            }
            if (urlParams.includes('currentPlan=standard')) {
                setCurrentPlan('Standard')
            }
            if (urlParams.includes('currentPlan=free')) {
                setCurrentPlan('Free')
            }
            
        }
    },[urlParams])

   

  return (
    <>
        <MenuBar />
    <div class="container py-5">
        {fromApp && <Link to="/"><button class="btn btn-primary">&lt; Back to Dashboard</button></Link>}
        <div class="text-center my-5">
            <h2 class="mb-3">Upgrade your account.</h2>
            {fromApp ? <h1>You are currently on the {currentPlan} plan.</h1> : <h1>Available plans:</h1>}
        </div>

        
      {(!currentPlan==='Pro') && <div class="d-flex justify-content-center mb-3">
        
        <div class="btn-group w-100 mw-50 w-md-50">
          <button onClick={handleSetToMonth} class={"btn btn-block w-50 "+monthlyStatus}>Monthly</button>
          <button onClick={handleSetToYear} class={"btn btn-block w-50 "+yearlyStatus}>Yearly</button>
        </div>
      </div>}

    <div class="row row-cols-1 row-cols-md-2 mb-3 text-center">
      {!currentPlan==='Free' && 
      <div class="col">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3">
            <h4 class="my-0 fw-normal">Free</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">£0<small class="text-muted fw-light">/{billingPeriod}</small></h1>
            <ul class="list-unstyled mt-3 mb-4">
              <li>1 point of access</li>
              <li>Single car supported</li>
              <li>Limited metrics</li>
              <li>Email support</li>
            </ul>
            <button type="button" class="w-100 btn btn-lg btn-outline-primary">Sign up for free</button>
          </div>
        </div>
      </div>}


      {(!currentPlan==='Free' || !currentPlan==='Standard') && <div class="col">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3">
            <h4 class="my-0 fw-normal">Standard</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">£{(billingPeriod==='mo') ? pricing.standard.monthly : pricing.standard.yearly}<small class="text-muted fw-light">/{billingPeriod}</small></h1>
            <ul class="list-unstyled mt-3 mb-4">
                <li>10 points of access</li>
                <li>Advanced data visualisation</li>
                <li>Fully customisable</li>
                <li>Priority email support</li>
            </ul>
            <button type="button" class="w-100 btn btn-lg btn-primary">Upgrade now</button>
          </div>
        </div>
      </div>}

      {(!currentPlan==='Free' || !currentPlan==='Standard' || !currentPlan==='Pro') && <div class="col">
        <div class="card mb-4 rounded-3 shadow-sm border-primary">
          <div class="card-header py-3 text-bg-primary border-primary">
            <h4 class="my-0 fw-normal">Pro</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">£{(billingPeriod==='mo') ? pricing.pro.monthly : pricing.pro.yearly}<small class="text-muted fw-light">/{billingPeriod}</small></h1>
            <ul class="list-unstyled mt-3 mb-4">
              <li>Unlimited user access</li>
              <li>Multiple cars supported</li>
              <li>Phone and email support</li>
            </ul>
            <button type="button" class="w-100 btn btn-lg btn-primary">Contact us</button>
          </div>
        </div>
      </div>}

      {(currentPlan==='Pro') && <div class="col">
        <div class="border-top pt-4">
          <h4>Want a feature that we dont have yet?</h4>
          <p>Let us know and we will add it to the to-do list!</p>
          <form>
            <textarea class="w-100 my-2" placeholder=""/>
            <button class="btn btn-primary btn-block">Submit</button>
          </form>
          
        </div>
      </div>
          }

    </div>
    </div>
  
    </>
  )
}
