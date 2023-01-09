import React, { useState } from 'react'
import classes from '../../scss/MenuMobile.module.scss'
import '../data/Menu.json'

export function MenuMobile() {

  const [isAvtive, setIsActive] = useState(false)

  return (
    <div className={classes.menu}>
        <h3></h3>
    </div>
  )
}
