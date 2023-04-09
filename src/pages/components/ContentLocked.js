import React from 'react'
import { Link } from 'react-router-dom'

export default function ContentLocked() {
  return (
    <div>ContentLocked
        <Link to="/upgrade-plan" class="btn-outline-secondary btn">Upgrade Plan</Link>
    </div>
  )
}
