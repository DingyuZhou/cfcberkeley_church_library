import { useContext, useMemo } from 'react'

import { getTextInSelectedLanguage, getDbTextInSelectedLanguage } from 'src/constants/language'
import { globalContext } from 'src/contexts/Global'

function useTisl() {
  const { state } = useContext(globalContext)

  return useMemo(() => {
    const selectedLanguage = state?.language

    // get UI text in the selected language
    function getUiTisl(textInEnglish: string, replacements?: string[][]) {
      return getTextInSelectedLanguage(textInEnglish, state?.language, replacements)
    }

    // get text that is fetched from database in the selected language
    function getDbTisl(textFromDatabase?: string) {
      return getDbTextInSelectedLanguage((textFromDatabase || ''), selectedLanguage)
    }

    return {
      selectedLanguage,
      getUiTisl,
      getDbTisl,
    }
  }, [state?.language])
}

export default useTisl
