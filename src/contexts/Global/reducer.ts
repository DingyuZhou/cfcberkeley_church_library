import { DEFAULT_LANGUAGE } from 'src/constants/language'

export interface IState {
  language: string
}

export interface IAction {
  type: string
  value: any
}

export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case 'CHANGE_LANGUAGE':
      const newSelectedLanguage = action.value

      if (typeof window !== 'undefined') {
        localStorage.setItem('SELECTED_LANGUAGE', newSelectedLanguage)
      }

      return {
        ...state,
        language: newSelectedLanguage,
      }

    default:
      return state
  }
}

export const initialState: IState = {
  language: DEFAULT_LANGUAGE.code,
}
