'use client'

import React, { ReactNode, createContext, useReducer } from 'react'
import { reducer, initialState } from './reducer'

interface IProps {
  children: ReactNode
}

const defaultDispatch: any = () => null

export const globalContext = createContext({
  state: initialState,
  dispatch: defaultDispatch,
})

export const GlobalContextProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <globalContext.Provider value={{ state, dispatch }}>
    	{ children }
    </globalContext.Provider>
  )
}
