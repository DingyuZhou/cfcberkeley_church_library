'use client'

import React, { useState, useContext } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from 'src/constants/language'
import { globalContext } from 'src/contexts/Global'

function LanguageSwitcher() {
  const { state, dispatch } = useContext(globalContext)

  const handleLanguageChange = (event: any) => {
    const newLanguage = event.target.value as string
    dispatch({ type: 'CHANGE_LANGUAGE', value: newLanguage })
  }

  return (
    <FormControl>
      <InputLabel id="language-switcher-label">Language</InputLabel>
      <Select
        labelId="language-switcher-label"
        id="language-switcher"
        value={state?.language || DEFAULT_LANGUAGE}
        onChange={handleLanguageChange}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            {language.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default LanguageSwitcher