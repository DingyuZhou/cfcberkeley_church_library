import { useContext, useMemo } from 'react'

import { getTextInSelectedLanguage } from 'src/constants/language'
import { globalContext } from 'src/contexts/Global'

function useTisl() {
  const { state } = useContext(globalContext)

  return useMemo(() => {
    const selectedLanguage = state?.language

    function getTisl(textInEnglish: string) {
      return getTextInSelectedLanguage(textInEnglish, state?.language)
    }

    return {
      selectedLanguage,
      getTisl,
    }
  }, [state?.language])
}

export default useTisl
