'use client'

import React, { useEffect, useContext } from 'react'

import { DEFAULT_LANGUAGE } from 'src/constants/language'
import { globalContext } from 'src/contexts/Global'

interface IProps {
  children: React.ReactNode
}

function LocalStorageLoader({ children }: IProps) {
  const { state, dispatch } = useContext(globalContext)

  useEffect(() => {
    const selectedLanguage = localStorage.getItem('SELECTED_LANGUAGE') || DEFAULT_LANGUAGE.code
    if (selectedLanguage !== state?.language) {
      dispatch({ type: 'CHANGE_LANGUAGE', value: selectedLanguage })
    }
  }, [children])

  return <>{children}</>
}

export default LocalStorageLoader