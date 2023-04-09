import React, {useEffect, useState} from 'react'
import MenuBar from './components/Navbar'
import Basic from './components/pricingoffers/Basic'

export default function UpgradePlan() {

    const [urlParams, setUrlParams] = useState(window.location.href.split('?')[1])
    const [currentPlan, setCurrentPlan] = useState('free')
    const [fromApp, setFromApp] = useState(false)

    useEffect(() => {
        if (urlParams) {
            if (urlParams.includes('fromApp=true')) {
                setFromApp(true)
            }
            if (urlParams.includes('currentPlan=premium')) {
                setCurrentPlan('Premium')
            }
            if (urlParams.includes('currentPlan=basic')) {
                setCurrentPlan('Basic')
            }
            if (urlParams.includes('currentPlan=free')) {
                setCurrentPlan('Free')
            }
        }
    },[urlParams])

   

  return (
    <>
        <MenuBar />
        <div class="w-100 m-auto">
            <div class="text-center mt-5">
                {fromApp ? <h2>You are currently on the {currentPlan} plan.</h2> : <h2>Available plans:</h2>}

                {(currentPlan==='Free') && 
                <Basic />

                }

            </div>
        </div>
    </>
  )
}
